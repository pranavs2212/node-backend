const request = require('supertest');
const app = require('./app'); // Your Express app
const { Pool } = require('pg');
// This pool will use environment variables in CI
// and fallback to defaults for local testing.
const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'restaurants_db',
    password: process.env.PG_PASSWORD || 'your_password',
    port: parseInt(process.env.PG_PORT || '5432'),
});
beforeAll(() => {
    // Optional: any one-time setup
});
afterAll(async () => {
    await pool.end();
});
beforeEach(async () => {
    await pool.query('TRUNCATE TABLE restaurants RESTART IDENTITY');
await pool.query(
        `INSERT INTO restaurants (name, cuisine, rating)
VALUES ('Testaurant', 'Test Cuisine', 4.0)`
    );
});
describe('Restaurant API', () => {
    // --- ALL YOUR describe(...) AND it(...) TEST BLOCKS GO HERE-- -
        // (Example test)
        it('GET /restaurants --> should return all restaurants',
            async () => {
                const response = await
                    request(app).get('/restaurants');
                expect(response.statusCode).toBe(200);
                expect(response.body.length).toBe(1);
            });
    // ... your other tests
});
