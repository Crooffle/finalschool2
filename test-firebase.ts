import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);

async function test() {
  await signInWithEmailAndPassword(auth, "backend_service@internal.app", "super_secret_backend_password_123!");
  console.log("Signed in as", auth.currentUser?.uid);
  
  const docRef = doc(collection(db, "submissions"));
  try {
    await setDoc(docRef, { text: "hello", createdAt: "now" });
    console.log("Success");
  } catch (e: any) {
    console.error("Error writing:", e.message);
  }
}
test();
