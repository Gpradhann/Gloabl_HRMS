import fs from 'fs';
import path from 'path';
import { SEED_DATA } from './seed';

const dbFilePath = path.join(process.cwd(), 'db.json');

const getDbData = () => {
  if (fs.existsSync(dbFilePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
      let updated = false;
      for (const key of Object.keys(SEED_DATA)) {
        if (data[key] === undefined) {
          data[key] = JSON.parse(JSON.stringify((SEED_DATA as any)[key]));
          updated = true;
        }
      }
      if (updated) {
        fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
      }
      return data;
    } catch (e) {
      return JSON.parse(JSON.stringify(SEED_DATA));
    }
  } else {
    fs.writeFileSync(dbFilePath, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
    return JSON.parse(JSON.stringify(SEED_DATA));
  }
};

export const db = {
  get<K extends keyof typeof SEED_DATA>(key: K): (typeof SEED_DATA)[K] {
    const data = getDbData();
    return data[key];
  },
  
  set<K extends keyof typeof SEED_DATA>(key: K, value: any) {
    const data = getDbData();
    data[key] = value;
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
  },
  
  reset() {
    fs.writeFileSync(dbFilePath, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
  }
};
