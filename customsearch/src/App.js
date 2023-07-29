import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [query, setQuery] = useState('');
  // const [searchResults, setSearchResults] = useState([]);
  const [scrapedData, setScrapedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchUrls();
  };

  const fetchUrls = () => {
    axios
      // .get(`http://localhost:5000/search?q=${query}`)
      .get(`https://scrapper-amog.onrender.com/search?q=${query}`)
      .then((response) => {
        // setSearchResults(response.data);
        scrapeData(response.data);
      })
      .catch((error) => {
        setLoading(false); 
        console.error('Error fetching URLs:', error.message);
      });
  };

  const scrapeData = (urls) => {
    const encodedUrls = urls.map((url) => encodeURIComponent(url));
    axios
      // .get(`http://localhost:5000/scrape?urls=${encodedUrls.join(',')}`)
      .get(`https://scrapper-amog.onrender.com/scrape?urls=${encodedUrls.join(',')}`)
      .then((response) => {
        setScrapedData(response.data);
        alert("Scraping Successful");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
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
        <p style={{marginBottom:'4px'}}>2. Instagram website</p>
      </div>
      {loading && <p style={{textAlign:'center',color:'red',fontSize:'20px'}}>Loading...</p>} 
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
