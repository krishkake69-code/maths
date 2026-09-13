import fs from 'fs';
import path from 'path';
import { writeDataStore } from '../lib/firebase';

const dataFilePath = path.join(process.cwd(), 'src', 'data-store.json');

async function seedFirebase() {
  try {
    const dataStr = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(dataStr);
    
    const success = await writeDataStore(data);
    if (success) {
      console.log('Firebase store seeded successfully!');
      console.log('Keys:', Object.keys(data));
    } else {
      console.error('Failed to seed Firebase store.');
    }
  } catch (err) {
    console.error('Error seeding Firebase:', err);
  }
}

seedFirebase();