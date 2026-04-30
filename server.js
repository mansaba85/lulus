import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

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

    await db.query(`CREATE TABLE IF NOT EXISTS classes (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL UNIQUE)`);
    await db.query(`CREATE TABLE IF NOT EXISTS students (id INT PRIMARY KEY AUTO_INCREMENT, nis VARCHAR(50) NOT NULL UNIQUE, name VARCHAR(255) NOT NULL, class_name VARCHAR(100) NOT NULL, token VARCHAR(50) NOT NULL, status ENUM('LULUS', 'TIDAK LULUS') DEFAULT 'LULUS')`);
    await db.query(`CREATE TABLE IF NOT EXISTS admins (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, fullname VARCHAR(255) DEFAULT 'Administrator Utama')`);

    // Migration: ensure fullname exists
    try { await db.query("ALTER TABLE admins ADD COLUMN fullname VARCHAR(255) DEFAULT 'Administrator Utama'"); } catch (e) {}

    // Seed Defaults
    const [rows] = await db.query('SELECT count(*) as count FROM settings');
    if (rows[0].count === 0) {
      await db.query('INSERT INTO settings (school_name) VALUES (?)', ['MA NU 01 Banyuputih']);
    }

    const [adminRows] = await db.query('SELECT count(*) as count FROM admins');
    if (adminRows[0].count === 0) {
      const hashedPass = await bcrypt.hash('admin123', 10);
      await db.query('INSERT INTO admins (username, password, fullname) VALUES (?, ?, ?)', ['admin', hashedPass, 'Administrator Utama']);
      console.log('👤 Admin default dibuat: admin / admin123 (Hashed)');
    } else {
      // Auto-hash existing plain text passwords
      const [allAdmins] = await db.query('SELECT id, username, password FROM admins');
      for (const admin of allAdmins) {
        if (!admin.password.startsWith('$2')) {
          console.log(`🔒 Mengamankan password untuk user: ${admin.username}...`);
          const hashed = await bcrypt.hash(admin.password, 10);
          await db.query('UPDATE admins SET password = ? WHERE id = ?', [hashed, admin.id]);
          console.log(`✅ Password user ${admin.username} berhasil di-hash.`);
        }
      }
    }

    console.log('✅ Server & Database Terkoneksi & Aman!');
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

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Akses ditolak, token hilang!' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token tidak valid atau kadaluarsa!' });
    req.user = user;
    next();
  });
};

// Middleware to check DB readiness
app.use('/api', (req, res, next) => {
  if (!db && req.path !== '/login') {
    return res.status(503).json({ error: 'Database sedang bersiap, silakan coba lagi dalam beberapa detik...' });
  }
  next();
});

// --- API ---

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: 'User tidak ditemukan' });

    const admin = rows[0];
    const validPass = await bcrypt.compare(password, admin.password);
    
    if (validPass) {
      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, token, fullname: admin.fullname });
    } else {
      res.status(401).json({ success: false, message: 'Password salah' });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Protected Admin Routes
app.post('/api/admin/update', authenticateToken, async (req, res) => {
  const { username, password, fullname } = req.body;
  try {
    let query = 'UPDATE admins SET username = ?, fullname = ? WHERE id = 1';
    let params = [username, fullname];

    if (password && password.trim() !== '') {
      const hashedPass = await bcrypt.hash(password, 10);
      query = 'UPDATE admins SET username = ?, password = ?, fullname = ? WHERE id = 1';
      params = [username, hashedPass, fullname];
    }

    await db.query(query, params);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT username, fullname FROM admins WHERE id = 1');
    res.json(rows[0] || { username: 'admin', fullname: 'Administrator Utama' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Other Protected Routes
app.get('/api/settings', async (req, res) => { // Public can see some settings for landing page if needed, but update is protected
  try {
    const [rows] = await db.query('SELECT * FROM settings ORDER BY id LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/settings', authenticateToken, async (req, res) => {
  const { school_name, release_date, release_time, school_logo } = req.body;
  try {
    const cleanDate = release_date ? release_date.split('T')[0] : '2026-05-15';
    const cleanTime = release_time ? (release_time.length === 5 ? `${release_time}:00` : release_time) : '10:00:00';
    
    await db.query(
      'UPDATE settings SET school_name = ?, release_date = ?, release_time = ?, school_logo = ? ORDER BY id LIMIT 1',
      [school_name, cleanDate, cleanTime, school_logo]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/classes', authenticateToken, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM classes');
  res.json(rows);
});

app.post('/api/classes', authenticateToken, async (req, res) => {
  const [result] = await db.query('INSERT INTO classes (name) VALUES (?)', [req.body.name]);
  res.json({ id: result.insertId, name: req.body.name });
});

app.post('/api/bulk-classes', authenticateToken, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.json({ success: true });
    await db.query('DELETE FROM classes WHERE id IN (?)', [ids]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/classes/:id', authenticateToken, async (req, res) => {
  await db.query('DELETE FROM classes WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

app.put('/api/classes/:id', authenticateToken, async (req, res) => {
  const { name } = req.body;
  await db.query('UPDATE classes SET name = ? WHERE id = ?', [name, req.params.id]);
  res.json({ success: true });
});

app.get('/api/students', authenticateToken, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM students');
  res.json(rows);
});

app.post('/api/students', authenticateToken, async (req, res) => {
  const { nis, name, class_name, token, status } = req.body;
  const [result] = await db.query('INSERT INTO students (nis, name, class_name, token, status) VALUES (?, ?, ?, ?, ?)', [nis, name, class_name, token, status]);
  res.json({ id: result.insertId, ...req.body });
});

app.post('/api/bulk-students', authenticateToken, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.json({ success: true });
    await db.query('DELETE FROM students WHERE id IN (?)', [ids]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/students/:id', authenticateToken, async (req, res) => {
  const { nis, name, class_name, token, status } = req.body;
  await db.query('UPDATE students SET nis = ?, name = ?, class_name = ?, token = ?, status = ? WHERE id = ?', [nis, name, class_name, token, status, req.params.id]);
  res.json({ success: true });
});

app.post('/api/students/bulk', authenticateToken, async (req, res) => {
  try {
    const students = req.body;
    if (!students || students.length === 0) return res.json({ success: true });

    // 1. Auto-sync classes: Get unique class names from the imported data
    const uniqueClasses = [...new Set(students.map(s => s.class_name))].filter(Boolean);
    
    if (uniqueClasses.length > 0) {
      const classValues = uniqueClasses.map(name => [name]);
      await db.query('INSERT IGNORE INTO classes (name) VALUES ?', [classValues]);
    }

    // 2. Insert/Update students
    const values = [students.map(s => [s.nis, s.name, s.class_name, s.token, s.status])];
    await db.query('INSERT INTO students (nis, name, class_name, token, status) VALUES ? ON DUPLICATE KEY UPDATE name=VALUES(name), class_name=VALUES(class_name), token=VALUES(token), status=VALUES(status)', values);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// Public Search Route (Siswa check status)
app.get('/api/students/search/:token', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students WHERE UPPER(token) = UPPER(?)', [req.params.token]);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(404).json({ message: 'Not found' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get(/^(.*)$/, (req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
