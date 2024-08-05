import React, { useEffect, useState } from 'react';
import useDebounce from '../utils'; // Import the custom hook

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500); // Debounce with 500ms delay

  useEffect(() => {
    const fetchTechCrunchNews = async () => {
      const techCrunchApiKey = '68db54717beb40b59edce861a42e411f';
      const techCrunchUrl = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${techCrunchApiKey}`;
      try {
        const response = await fetch(techCrunchUrl);
        const data = await response.json();
        console.log('TechCrunch data:', data);
        return data.articles.map(article => ({
          ...article,
          source: { name: 'TechCrunch' },
        }));
      } catch (error) {
        console.error('Error fetching TechCrunch data:', error);
        return [];
      }
    };

    const fetchNYTimesNews = async () => {
      const nyTimesApiKey = 'ExsEF8LIqyVLqJvfnL9ucd5GX1HmItew';
      const nyTimesUrl = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${nyTimesApiKey}`;
      try {
        const response = await fetch(nyTimesUrl);
        const data = await response.json();
        console.log('NY Times data:', data);
        return data.results.map(article => ({
          title: article.title,
          description: article.abstract,
          urlToImage: article.multimedia?.[0]?.url,
          source: { name: 'NY Times' },
          publishedAt: article.published_date,
        }));
      } catch (error) {
        console.error('Error fetching NY Times data:', error);
        return [];
      }
    };

    const fetchGuardianNews = async () => {
      const guardianApiKey = '0893d186-c591-40db-b27b-54973ab52abf';
      const guardianUrl = `https://content.guardianapis.com/search?api-key=${guardianApiKey}&show-fields=headline,thumbnail,short-url,body,webPublicationDate`;
      try {
        const response = await fetch(guardianUrl);
        const data = await response.json();
        console.log('The Guardian data:', data);
        return data.response.results.map(item => ({
          title: item.fields.headline,
          // description: item.fields.body,
          urlToImage: item.fields.thumbnail,
          source: { name: 'The Guardian' },
          publishedAt: item.webPublicationDate,
        }));
      } catch (error) {
        console.error('Error fetching Guardian data:', error);
        return [];
      }
    };

    const fetchAllNews = async () => {
      const [techCrunchNews, nyTimesNews, guardianNews] = await Promise.all([
        fetchTechCrunchNews(),
        fetchNYTimesNews(),
        fetchGuardianNews(),
      ]);
      const allNews = [...techCrunchNews, ...nyTimesNews, ...guardianNews];
      setNews(allNews);
      setFilteredNews(allNews);
    };

    fetchAllNews();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = news;

      if (source) {
        filtered = filtered.filter(item => item.source?.name.toLowerCase() === source.toLowerCase());
      }

      if (debouncedKeyword) {
        filtered = filtered.filter(item =>
          item.title?.toLowerCase().includes(debouncedKeyword.toLowerCase()) ||
          item.description?.toLowerCase().includes(debouncedKeyword.toLowerCase())
        );
      }

      if (date) {
        filtered = filtered.filter(item => new Date(item.publishedAt).toISOString().slice(0, 10) === date);
      }

      if (category) {
        filtered = filtered.filter(item => item.category?.toLowerCase() === category.toLowerCase());
      }

      setFilteredNews(filtered);
    };

    applyFilters();
  }, [news, debouncedKeyword, date, category, source]);

  const handleSearch = (event) => {
    event.preventDefault();
    const form = event.target;
    const searchInput = form.elements.search.value;
    const dateInput = form.elements.date.value;
    const categoryInput = form.elements.category.value;
    const sourceInput = form.elements.source.value;
    setKeyword(searchInput);
    setDate(dateInput);
    setCategory(categoryInput);
    setSource(sourceInput);
  };

  return (
    <div className="container news-page">
      <div className="my-3">
        <h2>Top Stories</h2>
        <form className='d-flex gap-2 align-items-center' onSubmit={handleSearch}>
          <input type="text" name="search" className='form-control' placeholder="Search news..." onChange={(e) => setKeyword(e.target.value)} />
          <input type="date" name="date" className='form-control' onChange={(e) => setDate(e.target.value)} />
          <select name="category" className='form-select' onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>
          <select name="source" className='form-select' onChange={(e) => setSource(e.target.value)}>
            <option value="">All Sources</option>
            <option value="techcrunch">TechCrunch</option>
            <option value="nytimes">NY Times</option>
            <option value="theguardian">The Guardian</option>
          </select>
        </form>
      </div>
      <div className="row g-2">
        {filteredNews.map((item, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <div className="card news-card">
              <img
                src={item.urlToImage}
                className="card-img-top"
                alt="..."
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">
                    {item.description}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <div>
                    <small>{item.source?.name}</small>
                  </div>
                  <div>
                    <small>
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
