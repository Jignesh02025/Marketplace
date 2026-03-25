import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./Product.css";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch main product
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);

      // 2. Fetch similar products (just fetching a few from the list for now)
      const simRes = await API.get(`/products?page=1&limit=4`);
      // Filter out the current product from similar products
      const filteredSimilar = (simRes.data.data || []).filter((p) => String(p.id) !== String(id)).slice(0, 4);
      setSimilarProducts(filteredSimilar);

    } catch (err) {
      console.error("Failed to fetch product details", err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="product-loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-empty">
        <h2>Product not found 😔</h2>
        <button className="btn-primary" onClick={() => navigate("/collection")}>
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="product-page">
      {/* ── Breadcrumb ── */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/")}>Home</span> /{" "}
        <span onClick={() => navigate("/collection")}>Collection</span> /{" "}
        <span className="current">{product.name}</span>
      </div>

      {/* ── Product Top Section ── */}
      <div className="product-container">
        {/* Left: Image */}
        <div className="product-image-container">
          <img src={product.image_url} alt={product.name} className="product-main-img" />
        </div>

        {/* Right: Details */}
        <div className="product-details">
          {product.category && <span className="category-badge">{product.category}</span>}
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">₹{Number(product.price).toLocaleString("en-IN")}</p>

          <div className="product-description">
            <h3>Description</h3>
            <p>
              Exquisitely crafted, this piece brings a touch of elegance to any occasion. 
              Made with the finest materials and an eye for intricate detail, it’s a timeless addition to your collection.
            </p>
          </div>

          <div className="product-highlights">
            <ul>
              <li>✨ Premium Quality Guarantee</li>
              <li>🛡️ BIS Hallmarked</li>
              <li>🚚 Free Insured Shipping</li>
              <li>🔄 7-Day Easy Returns</li>
            </ul>
          </div>

          <div className="product-actions">
            <button className="btn-primary add-to-cart">Add to Cart 🛍️</button>
            <button className="btn-secondary enquire" onClick={() => navigate(`/contact?product=${encodeURIComponent(product.name)}`)}>Enquire Now</button>
          </div>
        </div>
      </div>

      {/* ── Similar Products Section ── */}
      {similarProducts.length > 0 && (
        <div className="similar-products-section">
          <h2>You May Also Like</h2>
          <div className="similar-grid">
            {similarProducts.map((p) => (
              <div 
                className="similar-card" 
                key={p.id} 
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="similar-img-wrapper">
                  <img src={p.image_url} alt={p.name} />
                </div>
                <div className="similar-info">
                  <h4>{p.name}</h4>
                  <p>₹{Number(p.price).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
