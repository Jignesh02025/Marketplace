import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    const fetchCartItems = async () => {
        try {
            const res = await API.get("/cart/");
            setCartItems(res.data);
            const count = res.data.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(count);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchCartItems();
        }
    }, []);

    // Also update count whenever cartItems changes
    useEffect(() => {
        const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
    }, [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, fetchCartItems, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};
