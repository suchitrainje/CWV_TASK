import React, { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const dateFormatter = new Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

const ArticleItem = React.memo(({ article }) => {
  const formattedDate = useMemo(() => {
    return dateFormatter.format(new Date(article.time * 1000));
  }, [article.time]);

  return (
    <div className="article-item" data-testid="article-item">
      <h2 className="article-title">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {article.title || 'No Title'}
        </a>
      </h2>
      <div className="article-meta">
        <span>Score: {article.score} | </span>
        <span>By: {article.by} | </span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
});

const ArticleList = ({ articles, loading }) => {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated height for fixed virtualization calculation
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: '600px',
        overflow: 'auto',
      }}
      data-testid="article-list"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const article = articles[virtualRow.index];
          if (!article) return null;
          return (
            <div
              key={article.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ArticleItem article={article} />
            </div>
          );
        })}
      </div>
      {loading && <p>Loading articles rapidly via Promise.all...</p>}
    </div>
  );
};

export default ArticleList;
