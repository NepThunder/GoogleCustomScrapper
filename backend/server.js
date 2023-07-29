const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());

const CUSTOM_SEARCH_API_KEY = process.env.CUSTOM_SEARCH_API_KEY;
const CUSTOM_SEARCH_ENGINE_ID = process.env.CUSTOM_SEARCH_ENGINE_ID;
const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const url = `https://www.googleapis.com/customsearch/v1`;
  const params = {
    key: CUSTOM_SEARCH_API_KEY,
    cx: CUSTOM_SEARCH_ENGINE_ID,
    q: query,
    num: 5,
  };

  try {
    const response = await axios.get(url, { params });
    const searchResults = response.data.items.map((item) => item.link);
    console.log(searchResults);
    res.json(searchResults);
  } catch (error) {
    console.error('Error fetching search results:', error.message);
    res.status(500).json({ error: 'Error fetching search results' });
  }
});

app.get('/scrape', async (req, res) => {
  const urls = req.query.urls.split(',');
  async function fetchDataForUrl(url) {
    try {
      const response = await axios.get('https://app.scrapingbee.com/api/v1', {
        params: {
          'api_key': SCRAPINGBEE_API_KEY,
          'url': url,
          'extract_rules': '{"text":"body"}',
        },
      });

      return { url: url, text: response.data.text };
    } catch (error) {
      console.log(`Error fetching data for URL: ${url}`, error.message);
      return { url: url, text: error.message };
    }
  }

  try {
    const results = await Promise.all(urls.map(fetchDataForUrl));
    res.status(200).json(results);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "An error occurred while scraping the URLs" });
  }
});

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000`);
});
