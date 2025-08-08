const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'restaurants_db',
password: '',
port: 5432,
});
app.use(express.json());
// --- ALL YOUR app.get, app.post, etc. ROUTES GO HERE ---
// (Example route)
app.get('/restaurants', async (req, res) => {
try {
const result = await pool.query('SELECT * FROM restaurants ORDER BY id ASC');
res.json(result.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: "An internal server error occurred" });
}
});
// ... your other routes
// Only start the server if the file is run directly
if (process.env.NODE_ENV !== 'test') {
app.listen(port, () => {
console.log(`Server running on
http://localhost:${port}`);
});
}
// Export the app for testing
module.exports = app;
