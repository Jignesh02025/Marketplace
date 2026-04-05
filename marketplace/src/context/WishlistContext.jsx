import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);

    const fetchWishlist = async () => {
        try {
            const res = await API.get("/wishlist/");
            setWishlistItems(res.data);
            setWishlistCount(res.data.length);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const toggleWishlist = async (productId) => {
        try {
            await API.post("/wishlist/", { product_id: productId });
            await fetchWishlist();
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await API.delete("/wishlist/remove", {
                data: { product_id: productId }
            });
            await fetchWishlist();
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchWishlist();
        }
    }, []);

    return (
        <WishlistContext.Provider value={{ wishlistItems, wishlistCount, fetchWishlist, toggleWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
