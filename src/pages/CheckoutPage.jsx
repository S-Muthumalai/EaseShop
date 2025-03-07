import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./LandingPage";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";

const CheckoutPage = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "credit-card",
  });
  const [orderStatus, setOrderStatus] = useState(""); // Order tracking state
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/Home");
    }
  }, [cart, navigate]);

  useEffect(() => {
    if (orderId) {
      // Real-time listener for order status
      const unsubscribe = onSnapshot(doc(db, "orders", orderId), (docSnapshot) => {
        if (docSnapshot.exists()) {
          setOrderStatus(docSnapshot.data().status);
        }
      });
      return () => unsubscribe();
    }
  }, [orderId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const flattenedCart = Object.values(cart).flatMap(category => Object.values(category).flat());

    const newOrder = {
      date: new Date().toISOString(),
      items: flattenedCart,
      total: getTotalPrice(),
      customer: { ...formData },
      status: "Processing",
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      setOrderId(docRef.id);
      alert("Order placed successfully!");
      clearCart();
    } catch (error) {
      console.error("Error placing order: ", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center">🛒 Checkout</h2>
        <div className="row">
          {/* Left Column - Billing Form */}
          <div className="col-md-6">
            <div className="card shadow-lg p-4">
              <h4>Billing Details</h4>
              <form onSubmit={handleSubmit}>
                <input type="text" className="form-control mb-3" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input type="email" className="form-control mb-3" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" className="form-control mb-3" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                <input type="text" className="form-control mb-3" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                <input type="text" className="form-control mb-3" name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleChange} required />
                <select className="form-select mb-3" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  <option value="credit-card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
                <button type="submit" className="btn btn-success w-100">🛍️ Place Order</button>
              </form>
            </div>
          </div>

          {/* Right Column - Order Status */}
          <div className="col-md-6">
            {orderId && (
              <div className="card shadow-lg p-4">
                <h4>📦 Order Status</h4>
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Status:</strong> <span className={`badge ${orderStatus === "Processing" ? "bg-warning" : "bg-success"}`}>{orderStatus}</span></p>
                {orderStatus === "Processing" && (
                  <p className="text-muted">🔄 Your order is being processed. Please wait...</p>
                )}
                {orderStatus === "Shipped" && (
                  <p className="text-success">🚚 Your order is on the way!</p>
                )}
                {orderStatus === "Delivered" && (
                  <p className="text-success">🎉 Your order has been delivered!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
