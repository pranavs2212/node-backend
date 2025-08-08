const request = require('supertest');
const app = require('./app'); // Your Express app
const { Pool } = require('pg');

// This pool will use environment variables in CI
// and fallback to defaults for local testing.
const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'restaurants_db',
    password: process.env.PG_PASSWORD || 'qwerty',
    port: parseInt(process.env.PG_PORT || '5432'),
});

beforeAll(async () => {
    // Optional: any one-time setup
    // This is a good place to check for the database connection or run migrations if needed
});

afterAll(async () => {
    await pool.end();
});

beforeEach(async () => {
    // Ensure the restaurants table exists before truncating
    await pool.query(`
        CREATE TABLE IF NOT EXISTS restaurants (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            cuisine VARCHAR(255),
            rating DECIMAL
        );
    `);

    // Truncate the table to reset data
    await pool.query('TRUNCATE TABLE restaurants RESTART IDENTITY');

    // Insert sample data into the restaurants table
    await pool.query(`
        INSERT INTO restaurants (name, cuisine, rating)
        VALUES ('Testaurant', 'Test Cuisine', 4.0)
    `);
});

describe('Restaurant API', () => {
    it('GET /restaurants --> should return all restaurants', async () => {
        const response = await request(app).get('/restaurants');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Testaurant');
        expect(response.body[0].cuisine).toBe('Test Cuisine');
        expect(parseFloat(response.body[0].rating)).toBe(4); // Convert string rating to number
    });

    // Additional tests can go here...
});
