import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// Create Cart Context
const CartContext = createContext();

// Custom Hook to use the Cart Context
export const useCart = () => useContext(CartContext);

// Cart Provider Component
export const CartProvider = ({ children }) => {
  // Initialize cart from local storage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return {};
    }
  });

  // Save cart to local storage whenever it updates
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // ✅ Add item to cart (category-wise)
  const addToCart = (productData) => {
    if (!productData) return;

    const product = productData.product || productData;
    const category = product.category || "Uncategorized"; // Fallback if category is missing

    setCart((prevCart) => ({
      ...prevCart,
      [category]: {
        ...prevCart[category],
        [product.id]: prevCart[category]?.[product.id]
          ? { ...prevCart[category][product.id], quantity: prevCart[category][product.id].quantity + 1 }
          : { ...product, quantity: 1 },
      },
    }));
  };

  // ✅ Remove item from cart
  const removeFromCart = (category, id) => {
    if (!cart[category] || !cart[category][id]) return;

    setCart((prevCart) => {
      const updatedCategory = { ...prevCart[category] };
      delete updatedCategory[id];

      // Remove category if empty
      return Object.keys(updatedCategory).length === 0
        ? Object.fromEntries(Object.entries(prevCart).filter(([key]) => key !== category))
        : { ...prevCart, [category]: updatedCategory };
    });
  };

  // ✅ Update item quantity
  const updateQuantity = (category, id, quantity) => {
    if (!cart[category] || !cart[category][id]) return;

    setCart((prevCart) => ({
      ...prevCart,
      [category]: {
        ...prevCart[category],
        [id]: { ...prevCart[category][id], quantity: quantity > 0 ? quantity : 1 }, // Prevents zero/negative values
      },
    }));
  };

  // ✅ Clear entire cart
  const clearCart = () => {
    setCart({});
  };

  // ✅ Get total price of all cart items (Prevents NaN errors)
  const getTotalPrice = () => {
    return Object.values(cart || {}).reduce(
      (total, category) =>
        total +
        Object.values(category || {}).reduce(
          (subTotal, item) => subTotal + (Number(item.price) || 0) * (item.quantity || 1),
          0
        ),
      0
    );
  };

  // ✅ Get total number of items in cart
  const getCartCount = () => {
    return Object.values(cart || {}).reduce(
      (total, category) =>
        total + Object.values(category || {}).reduce((subTotal, item) => subTotal + (item.quantity || 1), 0),
      0
    );
  };

  // ✅ Place Order in Firestore (Handles errors better)
  const placeOrder = async (userId) => {
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId,
        items: cart,
        totalPrice: getTotalPrice(),
        timestamp: serverTimestamp(),
      });

      clearCart(); // Clear cart after successful order placement
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again later.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        placeOrder,
        getCartCount,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
