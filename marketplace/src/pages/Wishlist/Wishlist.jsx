import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
import API from "../../api/axios";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, fetchWishlist, removeFromWishlist } = useWishlist();
  const { fetchCartItems } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToCart = async (item) => {
    try {
      await API.post("/cart/add", {
        product_id: item.id
      })
      fetchCartItems();
      console.log("item added")
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <header className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>You have {wishlistItems.length} items saved in your wishlist</p>
        </header>

        {wishlistItems.length > 0 ? (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div className="wishlist-image-wrapper" onClick={() => navigate(`/product/${item.id}`)}>
                  <img src={item.image_url} alt={item.name} />
                  <span className="wishlist-category-tag">{item.category}</span>
                  <button
                    className="remove-wishlist-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.id);
                    }}
                    title="Remove from wishlist"
                  >
                    &times;
                  </button>
                </div>
                <div className="wishlist-info">
                  <h3 onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                  <p className="wishlist-price">₹{item.price.toLocaleString("en-IN")}</p>
                  <div className="wishlist-actions">
                    <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                      Add to Cart 
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-wishlist">
            <div className="empty-icon">❤</div>
            <h2>Your wishlist is empty</h2>
            <p>Looks like you haven't saved anything yet. Explore our collection to find your favorites!</p>
            <button className="continue-shopping-btn" onClick={() => navigate("/collection")}>
              Explore Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
