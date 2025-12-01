const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// GET /listings
app.get('/listings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM listing.properties');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  try {
    // Test the database connection
    const client = await pool.connect();
    console.log('Connected to the database successfully');
    client.release();

    app.listen(3000, () => {
      console.log('Listing service running on port 3000');
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit the process with an error code
  }
}

startServer();
