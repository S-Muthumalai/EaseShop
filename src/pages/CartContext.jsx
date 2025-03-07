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
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // Save cart to local storage whenever it updates
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add item to cart (category-wise)
  const addToCart = (productData) => {
    const product = productData.product || productData;
    const category = product.category;

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
    setCart((prevCart) => {
      const updatedCategory = { ...prevCart[category] };
      delete updatedCategory[id];

      // Remove category if empty
      if (Object.keys(updatedCategory).length === 0) {
        const { [category]: _, ...restCart } = prevCart;
        return restCart;
      }

      return { ...prevCart, [category]: updatedCategory };
    });
  };

  // ✅ Update item quantity
  const updateQuantity = (category, id, quantity) => {
    setCart((prevCart) => ({
      ...prevCart,
      [category]: {
        ...prevCart[category],
        [id]: { ...prevCart[category][id], quantity: quantity > 0 ? quantity : 1 },
      },
    }));
  };

  // ✅ Clear entire cart
  const clearCart = () => {
    setCart({});
  };

  // ✅ Get total price of all cart items
  const getTotalPrice = () => {
    return Object.values(cart).reduce(
      (total, category) =>
        total +
        Object.values(category).reduce((subTotal, item) => subTotal + item.price * item.quantity, 0),
      0
    );
  };

  // ✅ Get total number of items in cart
  const getCartCount = () => {
    return Object.values(cart).reduce(
      (total, category) =>
        total + Object.values(category).reduce((subTotal, item) => subTotal + item.quantity, 0),
      0
    );
  };

  // ✅ Place Order in Firestore
  const placeOrder = async (userId) => {
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId,
        items: cart,
        totalPrice: getTotalPrice(),
        timestamp: serverTimestamp(),
      });

      // Clear cart after successful order placement
      clearCart();
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, placeOrder, getCartCount, removeFromCart, updateQuantity, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
