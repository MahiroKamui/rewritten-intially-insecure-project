import Database from "better-sqlite3"

const db = new Database("database.db")

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT
  )
`)

// Seed db
db.exec(`
  INSERT OR IGNORE INTO users (username, email, password) VALUES
    ('lisa', 'lisa@example.com', 'password123'),
    ('niklas', 'niklas@example.com', 'secret'),
    ('bertlis', 'bertlis@example.com', 'qwerty'),
    ('jonas', 'jonas88@example.com', 'letmein'),
    ('anna', 'anna@example.com', '123456')
`)

export default db