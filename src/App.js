import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [stage, setStage] = useState('easy'); // For switching between easy, medium, hard stages
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Start with page 1 for pagination

  const fetchCats = async (page, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=5&page=${page}&order=Desc`);
      const data = await response.json();
      if (append) {
        setCats(prevCats => [...prevCats, ...data]);
      } else {
        setCats(data);
      }
    } catch (err) {
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCats(page); // Fetch cats whenever page changes for easy and medium
  }, [page, stage]);

  useEffect(() => {
    if (stage === 'hard') {
      fetchCats(page); // Fetch cats when entering hard stage
    } else {
      setCats([]); // Clear cats when switching stage
      setPage(1); // Reset page
    }
  }, [stage]);

  // Infinite Scroll Handler for Hard Stage
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50 // Adjust threshold for triggering
    ) {
      setPage(prevPage => prevPage + 1); // Load next page when reaching bottom
    }
  };

  useEffect(() => {
    if (stage === 'hard') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [stage]);

  return (
    <div className="app-container">
      <h1>Cat Image Gallery</h1>
      <div className="filter-section">
        <button className={stage === 'easy' ? 'active' : ''} onClick={() => {
          setStage('easy');
          setCats([]); // Clear previous cats when switching to easy
          setPage(1); // Reset page
        }}>Easy</button>
        <button className={stage === 'medium' ? 'active' : ''} onClick={() => {
          setStage('medium');
          setCats([]); // Clear previous cats when switching to medium
          setPage(1); // Reset page
        }}>Medium</button>
        <button className={stage === 'hard' ? 'active' : ''} onClick={() => {
          setStage('hard');
          setCats([]); // Clear previous cats when switching to hard
          setPage(1); // Reset page
        }}>Hard</button>
      </div>

      <div className="content-section">
        {stage === 'easy' && (
          <div className="easy-stage">
            <div className="grid"> {/* Using grid layout for easy stage */}
              {loading && <p>Loading...</p>}
              {error && <p>{error}</p>}
              {cats.length === 0 && !loading && <p>No data available</p>}
              {cats.map((cat, index) => (
                <div className="card" key={index}>
                  <img src={cat.url} alt="cat" />
                </div>
              ))}
            </div>
            <div className="pagination">
              <button onClick={() => {
                if (page > 1) {
                  setPage(prevPage => prevPage - 1);
                }
              }} disabled={page === 1}>Previous</button>
              <button onClick={() => setPage(prevPage => prevPage + 1)}>Next</button>
            </div>
          </div>
        )}

        {stage === 'medium' && (
          <div className="medium-stage">
            <div className="grid"> {/* Using grid layout for medium stage */}
              {loading && <p>Loading...</p>}
              {error && <p>{error}</p>}
              {cats.length === 0 && !loading && <p>No data available</p>}
              {cats.map((cat, index) => (
                <div className="card" key={index}>
                  <img src={cat.url} alt="cat" />
                </div>
              ))}
            </div>
            <div className="pagination">
              <button onClick={() => {
                if (page > 1) {
                  setPage(prevPage => prevPage - 1);
                }
              }} disabled={page === 1}>Previous</button>
              <button onClick={() => setPage(prevPage => prevPage + 1)}>Next</button>
            </div>
          </div>
        )}

        {stage === 'hard' && (
          <div className="list"> {/* Single column layout for hard stage */}
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {cats.length === 0 && !loading && <p>No data available</p>}
            {cats.map((cat, index) => (
              <div className="card" key={index}>
                <img src={cat.url} alt="cat" />
              </div>
            ))}
            {loading && <p>Loading more...</p>} {/* Loading indicator for more images */}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
