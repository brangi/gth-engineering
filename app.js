const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Endpoint to fetch article view count
app.get('/article-view-count', async (req, res) => {
    const { article, month } = req.query;

    // Validate the input
    if (!article || !month || !/^\d{6}$/.test(month)) {
        return res.status(400).json({ error: 'Article name and a valid month in YYYYMM format are required.' });
    }

    try {
        // Adjust month to match the required (YYYYMMDD) format without dashes
        const startOfMonth = `${month}01`;
        const endOfMonth = `${month}${new Date(parseInt(month.substring(0, 4)), parseInt(month.substring(4, 6)), 0).getDate()}`;

        // Remove potential dashes from dates
        const formattedStart = startOfMonth.replace(/-/g, '');
        const formattedEnd = endOfMonth.replace(/-/g, '');

        // Construct URL for Wikipedia API
        const apiUrl = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encodeURIComponent(article)}/monthly/${formattedStart}/${formattedEnd}`;

        // Make request to Wikipedia API
        const response = await axios.get(apiUrl);
        const viewCount = response.data.items[0].views;

        res.json({ article, month: `${formattedStart.slice(0, 6)}`, viewCount });
    } catch (error) {
        console.info('Error fetching article view count:');
        // Check if error response is from Wikipedia API
        if (error.response) {
            // Wikipedia API error
            res.status(error.response.status).json({
                error: error.response.data.error.info || 'Error fetching data from Wikipedia API'
            });
        } else if (error.request) {
            // Request made but no response received
            res.status(500).json({ error: 'No response received from Wikipedia API' });
        } else {
            // Something happened in setting up the request
            res.status(500).json({ error: 'Error in setting up the request to Wikipedia API' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;