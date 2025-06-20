import React from 'react';

export default function ProfessionalReviews({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <div><h2 className="section-title">Professional Reviews</h2><p>No professional reviews found.</p></div>;
  }

  return (
    <div className="reviews-section">
      <h2 className="section-title">Professional Reviews</h2>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <h3 className="review-source">{review.source} ({review.review_year}) - <span className={`sentiment ${review.sentiment?.toLowerCase()}`}>{review.sentiment}</span></h3>
            <p className="review-snippet">"{review.text}"</p>
            {review.link && <a href={review.link} target="_blank" rel="noopener noreferrer" className="review-link">Read Full Review &rarr;</a>}
            
            {(review.keywords?.positive?.length > 0 || review.keywords?.negative?.length > 0) &&
              <div className="keywords-container">
                {review.keywords.positive?.map(k => <span key={k} className="tag positive">{k}</span>)}
                {review.keywords.negative?.map(k => <span key={k} className="tag negative">{k}</span>)}
              </div>
            }
          </div>
        ))}
      </div>
      <style jsx>{`
        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-primary);
          border-bottom: 2px solid var(--color-accent);
          padding-bottom: 0.5rem;
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .review-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .review-source {
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.75rem;
        }
        .sentiment {
          font-weight: bold;
        }
        .sentiment.positive { color: #28a745; }
        .sentiment.negative { color: #dc3545; }
        .sentiment.neutral { color: #ffc107; }
        .review-snippet {
          font-style: italic;
          color: var(--text-secondary);
          margin: 0 0 1rem;
          padding-left: 1rem;
          border-left: 3px solid var(--border);
        }
        .review-link {
          font-weight: 600;
          color: var(--color-accent);
          text-decoration: none;
        }
        .review-link:hover {
          text-decoration: underline;
        }
        .keywords-container {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .tag {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .tag.positive {
          background-color: #28a74520;
          color: #28a745;
        }
        .tag.negative {
          background-color: #dc354520;
          color: #dc3545;
        }
      `}</style>
    </div>
  );
}