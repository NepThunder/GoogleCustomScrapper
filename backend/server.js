
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const scrapingbee = require('scrapingbee');
const cheerio = require('cheerio');
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

  try {
    if (!urls.length) {
      throw new Error('No URLs provided.');
    }
    const scrapingBeeClient = new scrapingbee.ScrapingBeeClient(SCRAPINGBEE_API_KEY);

    const scrapePromises = urls.map((url) => scrapingBeeClient.get({ url }));

    const scrapedResponses = await Promise.all(scrapePromises);

    console.log(scrapedResponses);

    const scrapedData = scrapedResponses.map((response) => {
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('text/html')) {
        throw new Error('Invalid response content-type');
      }
      const responseData = response.data.toString();
      const cleanedData = responseData.replace(/<iframe\b[^>]*>(.*?)<\/iframe>/gi, '');
      const $ = cheerio.load(cleanedData);
      $('script, style').remove();
      const bodyText = $('body').text();
      const words = bodyText.trim().split(/\s+/).slice(0, 50);
      const shortenedText = words.join(' ');
    
      return {
        url: response.headers['spb-resolved-url'],
        text:shortenedText,
      };
    });

    res.json(scrapedData);
  } catch (error) {
    console.error('Error scraping URLs:', error.message);
    res.status(500).json({ error: 'Error scraping URLs' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
