const request = require('supertest');
const nock = require('nock');
const app = require('./app');

describe('GET /article-view-count', () => {

    let server;

    beforeEach(() => {
        server = app.listen(3001); // Use a different port for testing
    });

    afterEach((done) => {
        server.close(done);
        nock.cleanAll();
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

    it('handles Wikipedia API error responses', async () => {
        // Mock the Wikipedia API response to simulate an error
        nock('https://wikimedia.org')
            .get(/metrics\/pageviews/)
            .reply(404, {
                error: { info: 'Page not found' }
            });

        const res = await request(server)
            .get('/article-view-count')
            .query({ article: 'NonExistentArticle', month: '202201' });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'Page not found');
    });

    it('handles no response from the Wikipedia API', async () => {
        // Mock the Wikipedia API to simulate no response
        nock('https://wikimedia.org')
            .get(/metrics\/pageviews/)
            .delayConnection(1000)
            .replyWithError({ message: 'Timeout' });

        const res = await request(server)
            .get('/article-view-count')
            .query({ article: 'Node.js', month: '202201' });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'No response received from Wikipedia API');
    });

});
