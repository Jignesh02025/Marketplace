import "./Skeleton.css";

const Skeleton = ({ type, count = 1 }) => {
  const skeletons = Array(count).fill(0);

  if (type === "product-card") {
    return (
      <div className="skeleton-grid">
        {skeletons.map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-image Shimmer"></div>
            <div className="skeleton-info">
              <div className="skeleton-text skeleton-title Shimmer"></div>
              <div className="skeleton-text skeleton-subtitle Shimmer"></div>
              <div className="skeleton-text skeleton-price Shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "product-details") {
    return (
      <div className="skeleton-product-details-container">
        <div className="skeleton-product-image Shimmer"></div>
        <div className="skeleton-product-info">
          <div className="skeleton-text skeleton-title-large Shimmer"></div>
          <div className="skeleton-text skeleton-price-large Shimmer"></div>
          <div className="skeleton-specs-grid">
            <div className="skeleton-spec-item Shimmer"></div>
            <div className="skeleton-spec-item Shimmer"></div>
            <div className="skeleton-spec-item Shimmer"></div>
            <div className="skeleton-spec-item Shimmer"></div>
          </div>
          <div className="skeleton-text skeleton-description Shimmer"></div>
          <div className="skeleton-text skeleton-description Shimmer"></div>
          <div className="skeleton-actions">
            <div className="skeleton-button Shimmer"></div>
            <div className="skeleton-button Shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="skeleton-text Shimmer"></div>;
};

export default Skeleton;
