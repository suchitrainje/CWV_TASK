import React, { useState, useEffect, Suspense, lazy } from 'react';
import sortBy from 'lodash/sortBy';

const ArticleList = lazy(() => import('./ArticleList'));

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
        
        // Anti-pattern fix: Parallel network requests via Promise.all
        const fetchPromises = storyIds.slice(0, 500).map(async (id) => {
          const storyResp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (storyResp.ok) {
            return storyResp.json();
          }
          return null;
        });

        const stories = await Promise.all(fetchPromises);
        setArticles(stories.filter(Boolean));
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

  // Anti-pattern fix: Cherry-picked lodash module import optimizing bundle
  let sortedArticles = sortBy(filteredArticles, ['score']);
  if (sortOrder === 'desc') {
    sortedArticles = sortedArticles.reverse();
  }

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container">
      {/* Anti-pattern fix: Optimized Image markup specifying explicit sizing bounds, lazy, and srcset mapping */}
      <img
        src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75&fm=webp"
        srcSet="
          https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=75&fm=webp 400w,
          https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75&fm=webp 800w,
          https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=75&fm=webp 1200w"
        sizes="(max-width: 800px) 100vw, 800px"
        width="800"
        height="533"
        loading="lazy"
        decoding="async"
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

      <Suspense fallback={<p>Loading Virtualized Component chunk asynchronously...</p>}>
        <ArticleList articles={sortedArticles} loading={loading} />
      </Suspense>
    </div>
  );
}

export default App;
