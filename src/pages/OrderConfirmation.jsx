import React from "react";
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="container mt-5 text-center">
      <h2>🎉 Order Confirmed! 🎉</h2>
      <p>Thank you for your purchase. Your order has been successfully placed.</p>
      <p>We will send you an update once your order is shipped.</p>
      
      <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
    </div>
  );
};

export default OrderConfirmation;
