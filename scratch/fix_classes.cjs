const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🔄 Mengupdate skema database...');
    // Ensure classes.name is UNIQUE
    await db.query('ALTER TABLE classes MODIFY name VARCHAR(100) NOT NULL UNIQUE');
    console.log('✅ Skema berhasil diperbarui.');
  } catch (e) {
    console.log('ℹ️ Skema sudah sesuai atau kolom sudah unik.');
  }

  try {
    console.log('🔄 Sinkronisasi daftar kelas dari data siswa...');
    // Sync all existing class names from students table to classes table
    await db.query('INSERT IGNORE INTO classes (name) SELECT DISTINCT class_name FROM students WHERE class_name IS NOT NULL AND class_name != ""');
    
    const [rows] = await db.query('SELECT * FROM classes');
    console.log(`✅ Berhasil menyinkronkan ${rows.length} kelas.`);
  } catch (e) {
    console.error('❌ Gagal sinkronisasi:', e.message);
  }

  await db.end();
  process.exit(0);
})();
