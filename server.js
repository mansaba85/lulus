import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let db;

// Init DB & Tables with Retry Logic
const initDB = async (retries = 5) => {
  try {
    console.log('🔄 Menghubungkan ke Database...');
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    
    db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create Tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        school_name VARCHAR(255) DEFAULT 'MA NU 01 Banyuputih',
        release_date DATE DEFAULT '2026-05-15',
        release_time TIME DEFAULT '10:00:00',
        school_logo LONGTEXT
      )
    `);

    await db.query(`CREATE TABLE IF NOT EXISTS classes (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL)`);
    await db.query(`CREATE TABLE IF NOT EXISTS students (id INT PRIMARY KEY AUTO_INCREMENT, nis VARCHAR(50) NOT NULL UNIQUE, name VARCHAR(255) NOT NULL, class_name VARCHAR(100) NOT NULL, token VARCHAR(50) NOT NULL, status ENUM('LULUS', 'TIDAK LULUS') DEFAULT 'LULUS')`);
    await db.query(`CREATE TABLE IF NOT EXISTS admins (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)`);

    // Seed Defaults
    const [rows] = await db.query('SELECT count(*) as count FROM settings');
    if (rows[0].count === 0) {
      await db.query('INSERT INTO settings (school_name) VALUES (?)', ['MA NU 01 Banyuputih']);
    }

    const [adminRows] = await db.query('SELECT count(*) as count FROM admins');
    if (adminRows[0].count === 0) {
      await db.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', 'admin123']);
      console.log('👤 Admin default dibuat: admin / admin123');
    }

    console.log('✅ Server & Database Terkoneksi!');
  } catch (err) {
    if (retries > 0) {
      console.log(`⏳ Database belum siap, mencoba lagi dalam 5 detik... (${retries} sisa percobaan)`);
      setTimeout(() => initDB(retries - 1), 5000);
    } else {
      console.error('❌ DB ERROR:', err.message);
    }
  }
};

initDB();

// --- API ---

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) res.json({ success: true });
    else res.status(401).json({ success: false });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM settings ORDER BY id LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/settings', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'DB not ready' });
  const { school_name, release_date, release_time, school_logo } = req.body;
  
  try {
    // Rapiin format Tanggal dan Jam agar MySQL DATE/TIME tidak error
    const cleanDate = release_date ? release_date.split('T')[0] : '2026-05-15';
    const cleanTime = release_time ? (release_time.length === 5 ? `${release_time}:00` : release_time) : '10:00:00';

    console.log('📝 Menyimpan pengaturan baru...');
    
    // Update baris pertama yang ditemukan
    const [result] = await db.query(
      'UPDATE settings SET school_name = ?, release_date = ?, release_time = ?, school_logo = ? ORDER BY id LIMIT 1',
      [school_name, cleanDate, cleanTime, school_logo]
    );

    console.log(`✅ Berhasil! (${result.affectedRows} baris terupdate)`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ GAGAL SIMPAN:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Classes & Students (Simplified for brevity but fully functional)
app.get('/api/classes', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM classes');
  res.json(rows);
});
app.post('/api/classes', async (req, res) => {
  const [result] = await db.query('INSERT INTO classes (name) VALUES (?)', [req.body.name]);
  res.json({ id: result.insertId, name: req.body.name });
});
app.delete('/api/classes/:id', async (req, res) => {
  await db.query('DELETE FROM classes WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

app.get('/api/students', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM students');
  res.json(rows);
});
app.post('/api/students', async (req, res) => {
  const { nis, name, class_name, token, status } = req.body;
  const [result] = await db.query('INSERT INTO students (nis, name, class_name, token, status) VALUES (?, ?, ?, ?, ?)', [nis, name, class_name, token, status]);
  res.json({ id: result.insertId, ...req.body });
});
app.post('/api/students/bulk', async (req, res) => {
  const values = [req.body.map(s => [s.nis, s.name, s.class_name, s.token, s.status])];
  await db.query('INSERT INTO students (nis, name, class_name, token, status) VALUES ? ON DUPLICATE KEY UPDATE name=VALUES(name), class_name=VALUES(class_name), token=VALUES(token), status=VALUES(status)', values);
  res.json({ success: true });
});
app.delete('/api/students/:id', async (req, res) => {
  await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});
app.get('/api/students/search/:token', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM students WHERE UPPER(token) = UPPER(?)', [req.params.token]);
  if (rows.length > 0) res.json(rows[0]);
  else res.status(404).json({ message: 'Not found' });
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get(/^(.*)$/, (req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
