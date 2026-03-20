import React, { useState, useEffect } from 'react';
import _ from 'lodash';

function App() {
  const [articles, setArticles] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // or 'desc'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await response.json();
        const stories = [];
        // Anti-pattern: sequential fetching in a loop causing Network Waterfall
        for (const id of storyIds.slice(0, 500)) {
          const storyResp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (storyResp.ok) {
            const storyData = await storyResp.json();
            if (storyData) stories.push(storyData);
          }
        }
        setArticles(stories);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStories();
  }, []);

  const filteredArticles = articles.filter(article => 
    article?.title?.toLowerCase().includes(filterText.toLowerCase())
  );

  // Anti-pattern: Efficient use of lodash by importing the full module
  const sortedArticles = _.orderBy(filteredArticles, ['score'], [sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container">
      {/* Anti-pattern: Unoptimized Image without dimensions, lazy loading, and massive original size */}
      <img 
        src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=3000&q=80" 
        alt="News Hero"
        className="hero-image"
        data-testid="hero-image"
      />
      <h1>HackerNews Top 500</h1>
      
      <div className="controls">
        <input 
          type="text" 
          placeholder="Filter by title..." 
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button onClick={toggleSort}>
          Sort by Score ({sortOrder})
        </button>
      </div>

      <div className="article-list" data-testid="article-list">
        {loading && <p>Loading articles recursively... (This takes a while by design due to sequential fetch)</p>}
        {/* Anti-pattern: No List Virtualization, rendering 500 nodes */}
        {sortedArticles.map(article => (
          <div key={article.id} className="article-item" data-testid="article-item">
            <h2 className="article-title">
              <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title || "No Title"}</a>
            </h2>
            <div className="article-meta">
              <span>Score: {article.score} | </span>
              <span>By: {article.by} | </span>
              {/* Anti-pattern: Expensive Computation in render */}
              <span>{new Date(article.time * 1000).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
