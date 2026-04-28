import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth, db } from '../src/lib/firebase.js';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-jwt-key-2026';
const SITE_PASS = process.env.SITE_PASSWORD || 'thanksforall';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'rakhasangatbaik';
const siteHash = bcrypt.hashSync(SITE_PASS, 10);
const adminHash = bcrypt.hashSync(ADMIN_PASS, 10);

const DB_SECRET = 'super_secret_backend_key';

const app = express();

// Vercel automatically parses the body. express.json() will hang if the stream is already consumed.
app.use((req, res, next) => {
  if (req.body !== undefined) {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(cookieParser());

// Check Visitor Auth (includes Admin because Admin usually implies viewing the site)
const getAuthToken = (req: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return req.cookies?.session;
};

const requireVisitor = (req: any, res: any, next: any) => {
  const token = getAuthToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid session' });
  }
};

const requireAdmin = (req: any, res: any, next: any) => {
  requireVisitor(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  });
};

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  let role = null;
  if (bcrypt.compareSync(password, adminHash)) role = 'admin';
  else if (bcrypt.compareSync(password, siteHash)) role = 'visitor';

  if (role) {
    const token = jwt.sign({ role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('session', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ role, token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/verify', (req, res) => {
  const token = getAuthToken(req);
  if (!token) return res.json({ role: null });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    res.json({ role: decoded.role });
  } catch {
    res.json({ role: null });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('session', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ success: true });
});

app.post('/api/submissions', requireVisitor, async (req: any, res: any) => {
  try {
    const { text } = req.body;
    const docRef = doc(collection(db, 'submissions'));
    await setDoc(docRef, { text, serverSecret: DB_SECRET, createdAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to submit' });
  }
});

app.get('/api/submissions', requireAdmin, async (req: any, res: any) => {
  try {
    const q = query(collection(db, 'submissions'), where('serverSecret', '==', DB_SECRET));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

export default app;
