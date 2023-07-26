import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [scrapedData, setScrapedData] = useState([]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUrls();
  };

  const fetchUrls = () => {
    axios
      .get(`https://scrapper-amog.onrender.com/search?q=${query}`)
      .then((response) => {
        setSearchResults(response.data);
        scrapeData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching URLs:', error.message);
      });
  };

  const scrapeData = (urls) => {
    const encodedUrls = urls.map((url) => encodeURIComponent(url));
    axios
      .get(`https://scrapper-amog.onrender.com/scrape?urls=${encodedUrls.join(',')}`)
      .then((response) => {
        setScrapedData(response.data);
        alert("Scraping Successful")
      })
      .catch((error) => {
        alert("The Query couldn't be scraped");
        console.error('Error scraping URLs:', error.message);
      });
  };

  return (
    <div>
      <div className='header'>
        <h1>Website Scrapper</h1>
      </div>
      <form className='formHandler' onSubmit={handleSubmit}>
        <input type="text" value={query} placeholder='Enter your Query' onChange={handleQueryChange} />
        <button type="submit">Search</button>
      </form>
      <div className='Scrapping'>
        <p>Note: Please Wait a couple of minute to complete the Scrapping</p>
        <p>Possible failure of scraping</p>
        <p>1. Youtube website</p>
        <p>2. Instagram website</p>
      </div>
      {scrapedData.length > 0 && (
        <div className='container'>
          <h2>Scraped Text Content</h2>
          {scrapedData.map((data, index) => (
            <div key={index}>
              <h3>URL: {data.url}</h3>
              <p>{data.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
