// Simple database initialization script
const { Pool } = require('pg');
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default database first
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
};

const pool = new Pool(config);

async function initializeDatabase() {
  let client;
  try {
    console.log('🔧 Initializing database...');
    
    client = await pool.connect();
    
    // Check if database exists
    const dbCheck = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (dbCheck.rows.length === 0) {
      console.log('📦 Creating database...');
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('✅ Database created successfully');
    } else {
      console.log('ℹ️ Database already exists');
    }

    console.log('🎉 Database initialization completed!');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    
    if (error.code === '28P01') {
      console.log('💡 Please check your PostgreSQL password in the .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Please make sure PostgreSQL is running on localhost:5432');
    }
    
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

// Only run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };