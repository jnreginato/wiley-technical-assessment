import path from 'path';
import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';

const dbPath = path.resolve(__dirname, 'courses.db');
const db: DatabaseType = new Database(dbPath);

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    duration INTEGER,
    instructor TEXT
  )
`,
).run();

export default db;
