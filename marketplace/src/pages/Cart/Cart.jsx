import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../../api/axios";
import { useCart } from "../../context/CartContext";
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, setCartItems, fetchCartItems } = useCart();

    useEffect(() => {
        fetchCartItems();
    }, []);
    const handleQuantityRemove = async (id) => {
        try {
            await API.post("/cart/remove/", {
                product_id: id
            })
            const res = await API.get("/cart/");
            setCartItems(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    const handleQuantityAdd = async (id) => {
        try {
            await API.post("/cart/add", {
                product_id: id
            });

            // ✅ Refresh cart
            const res = await API.get("/cart/");
            setCartItems(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    const removeItem = async (id) => {
        try {
            const res = await API.delete("/cart/delete", {
                data: { product_id: id }
            });
            setCartItems(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Delete failed:", error.response ? error.response.data : error.message);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 50;
    const total = subtotal + shipping;

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>Your Shopping Bag</h1>
                <p>{cartItems.length} items in your bag</p>
            </div>

            {cartItems.length > 0 ? (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item-card" onClick={() => navigate(`/product/${item.id}`)}>
                                <div className="item-image">
                                    <img src={item.image_url} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <div className="item-info-header">
                                        <h3>{item.name}</h3>
                                        <p className="item-category">{item.category}</p>
                                    </div>
                                    <div className="item-specs">
                                        <span><strong>Carat:</strong> {item.carat}ct</span>
                                        <span><strong>Color:</strong> {item.color}</span>
                                        <span><strong>Clarity:</strong> {item.clarity}</span>
                                    </div>
                                    <div className="item-actions">
                                        <div className="quantity-control" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => handleQuantityRemove(item.id)} aria-label="Decrease quantity">−</button>
                                            <span className="quantity-count">{item.quantity}</span>
                                            <button onClick={() => handleQuantityAdd(item.id, 1)} aria-label="Increase quantity">+</button>
                                        </div>
                                        <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}>Remove</button>
                                    </div>
                                </div>
                                <div className="item-price">
                                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary-wrapper">
                        <div className="cart-summary">
                            <h2>Order Summary</h2>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Estimated Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <button className="checkout-btn">Proceed to Checkout</button>
                            <div className="summary-footer">
                                <div className="payment-icons">
                                    <span>Visa</span>
                                    <span>Mastercard</span>
                                    <span>Amex</span>
                                    <span>Apple Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your bag is currently empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <button className="continue-shopping" onClick={() => navigate('/products')}>Continue Shopping</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
