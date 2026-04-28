import admin from 'firebase-admin';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: firebaseConfig.projectId
});

const db = admin.firestore();
if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
  db.settings({ databaseId: firebaseConfig.firestoreDatabaseId });
}

async function test() {
  const q = db.collection('submissions').limit(1);
  try {
    const snap = await q.get();
    console.log("Admin SDK fetched docs count:", snap.size);
  } catch(e: any) {
    console.error("error:", e.message);
  }
}
test();
