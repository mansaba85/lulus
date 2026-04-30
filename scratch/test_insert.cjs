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
    const uniqueClasses = ['12.1', '12.2'];
    const classValues = uniqueClasses.map(name => [name]);
    console.log('Inserting values:', JSON.stringify(classValues));
    
    const [result] = await db.query('INSERT IGNORE INTO classes (name) VALUES ?', [classValues]);
    console.log('Result:', JSON.stringify(result));
    
    const [rows] = await db.query('SELECT * FROM classes');
    console.log('Final Classes:', JSON.stringify(rows));
  } catch (e) {
    console.error('Error:', e.message);
  }

  await db.end();
})();
