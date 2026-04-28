import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  const q = query(collection(db, "submissions"), where("serverSecret", "==", "super_secret_backend_key"));
  try {
    const snap = await getDocs(q);
    console.log("Success, count:", snap.size);
  } catch (e: any) {
    console.error("Error reading:", e.message);
  }
}
test();
