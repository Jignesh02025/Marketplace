import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import EnquiryModal from "./EnquiryModal";
import LoginRequired from "../../components/LoginRequired/LoginRequired";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./Product.css";

/* ── Similar Product Slider (Auto-sliding) ── */
function SimilarProductSlider({ items, navigate }) {
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector(".similar-card")?.offsetWidth || 280;
    const gap = 18;
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const currentScroll = scrollRef.current.scrollLeft;

    if (dir === 1 && currentScroll >= maxScroll - 5) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === -1 && currentScroll <= 5) {
      scrollRef.current.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
    }
  };

  const startAuto = useCallback(() => {
    timerRef.current = setInterval(() => scroll(1), 3000);
  }, []);

  useEffect(() => {
    startAuto();
    return () => clearInterval(timerRef.current);
  }, [startAuto]);

  const manualScroll = (dir) => {
    clearInterval(timerRef.current);
    scroll(dir);
    startAuto();
  };

  if (!items.length) return null;

  return (
    <div className="similar-slider-wrapper">
      <button className="slider-arrow slider-arrow--left" onClick={() => manualScroll(-1)}>‹</button>
      <div className="similar-grid-slider" ref={scrollRef}>
        {items.map((p) => (
          <div
            className="similar-card"
            key={p.id}
            onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
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
      <button className="slider-arrow slider-arrow--right" onClick={() => manualScroll(1)}>›</button>
    </div>
  );
}

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartItems } = useCart();
  const { wishlistItems, toggleWishlist: toggleWishlistContext } = useWishlist();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const cartHandler = async () => {
    try {
      await API.post("/cart/add", {
        product_id: id
      })
      fetchCartItems();
      console.log("item added")
    } catch (error) {
      console.log(error)
    }
  }

  const isWishlisted = wishlistItems.some(item => String(item.product_id || item.id) === String(id));

  const toggleWishlist = async () => {
    await toggleWishlistContext(id);
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);

      const simRes = await API.get(`/products?page=1&limit=12`);
      const filteredSimilar = (simRes.data.data || [])
        .filter((p) => String(p.id) !== String(id) && p.image_url)
        .slice(0, 10);
      setSimilarProducts(filteredSimilar);

    } catch (err) {
      console.error("Failed to fetch product details", err);
    }
    setLoading(false);
  };

  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <LoginRequired message="Please login to view exclusive product details and pricing." />;
  }

  if (loading) {
    return (
      <div className="product-page">
        <Skeleton type="product-details" />
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
          <div className="product-badge-group">
            {product.category && <span className="category-badge">{product.category}</span>}
            <button
              className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
              onClick={toggleWishlist}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              ❤️
            </button>
          </div>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">₹{Number(product.price).toLocaleString("en-IN")}</p>

          <div className="product-specs-grid">
            <div className="spec-item">
              <span className="spec-label">Carats</span>
              <span className="spec-value">{product.carats || "—"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Color</span>
              <span className="spec-value">{product.color || "—"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Clarity</span>
              <span className="spec-value">{product.clarity || "—"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Shape</span>
              <span className="spec-value">{product.shape || "—"}</span>
            </div>
          </div>

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
            <button className="btn-primary add-to-cart" onClick={cartHandler}>Add to Cart</button>
            <button
              className="btn-secondary enquire"
              onClick={() => setIsEnquiryModalOpen(true)}
            >
              Enquire Now
            </button>
          </div>
        </div>
      </div>

      {/* ── You May Also Like Section ── */}
      {similarProducts.length > 0 && (
        <div className="similar-products-section">
          <h2>You May Also Like</h2>
          <SimilarProductSlider items={similarProducts} navigate={navigate} />
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        product={product}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </div>
  );
}
