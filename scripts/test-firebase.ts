import 'dotenv/config';
import { readDataStore } from '../lib/firebase';

async function runTest() {
  console.log('--- FIRESTORE KEYS TEST ---');
  const readData = await readDataStore();
  if (readData) {
    console.log('Keys in Firestore doc:', Object.keys(readData));
    console.log('Type of courses:', typeof readData.courses);
    console.log('Is courses array:', Array.isArray(readData.courses));
    if (Array.isArray(readData.courses)) {
      console.log('Courses count:', readData.courses.length);
      console.log('First course:', readData.courses[0]);
    } else {
      console.log('Raw courses value:', readData.courses);
    }
  }
  process.exit(0);
}

runTest();
