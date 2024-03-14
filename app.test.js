const request = require('supertest');
const app = require('./app');

describe('GET /article-view-count', () => {

    let server;

    beforeEach(() => {
        server = app.listen(3001); // Use a different port for testing
    });

    afterEach((done) => {
        server.close(done);
    });

    it('should require an article name', async () => {
        const res = await request(app)
            .get('/article-view-count')
            .query({ month: '202201' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Article name and a valid month in YYYYMM format are required.');
    });

    it('should require a valid month in YYYYMM format', async () => {
        const res = await request(app)
            .get('/article-view-count')
            .query({ article: 'Node.js', month: 'invalid' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Article name and a valid month in YYYYMM format are required.');
    });

    it('should return the view count for a valid article and month', async () => {
        const res = await request(app)
            .get('/article-view-count')
            .query({ article: 'Node.js', month: '202201' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('viewCount');
        expect(res.body).toHaveProperty('article');
        expect(res.body).toHaveProperty('month');
    });
});
