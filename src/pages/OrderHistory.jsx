import React, { useEffect, useState } from "react";
import { Navbar } from "./LandingPage";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("date", "desc"));

    // Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(updatedOrders);
    });

    return () => unsubscribe(); // Cleanup the listener when component unmounts
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "badge bg-warning";
      case "Shipped":
        return "badge bg-primary";
      case "Delivered":
        return "badge bg-success";
      case "Cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>🛍️ Your Order History</h2>

        {orders.length === 0 ? (
          <p>No previous orders found.</p>
        ) : (
          <>
            {orders.map((order, index) => (
              <div key={order.id} className="card mb-4 shadow">
                <div className="card-body">
                  <h5 className="card-title">
                    Order #{index + 1}{" "}
                    <span className={getStatusColor(order.status)}>
                      {order.status}
                    </span>
                  </h5>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.date).toLocaleString() || "N/A"}
                  </p>

                  <div className="row">
                    {/* Left: Customer Details */}
                    <div className="col-md-6">
                      <h6>🧑 Customer Details:</h6>
                      <p><strong>Name:</strong> {order.customer?.name || "N/A"}</p>
                      <p><strong>Email:</strong> {order.customer?.email || "N/A"}</p>
                      <p><strong>Address:</strong> {order.customer?.address || "N/A"}</p>
                      <p><strong>City:</strong> {order.customer?.city || "N/A"}</p>
                      <p><strong>Zip Code:</strong> {order.customer?.zip || "N/A"}</p>
                      <p><strong>Payment Method:</strong> {order.customer?.paymentMethod || "N/A"}</p>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="col-md-6">
                      <h6>🛒 Order Summary:</h6>
                      <ul className="list-group">
                        {Array.isArray(order.items) ? (
                          order.items.map((item, idx) => (
                            <li key={idx} className="list-group-item d-flex justify-content-between">
                              {item.name} (x{item.quantity})
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))
                        ) : (
                          <p>No items found.</p>
                        )}
                      </ul>
                      <h5 className="mt-3">
                        <strong>💰 Total Price:</strong> ${order.total ? order.total.toFixed(2) : "0.00"}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
