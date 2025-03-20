import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { Navbar } from "./LandingPage";

const Footer = () => (
  <footer className="bg-dark text-light text-center py-3 mt-auto">
    <p className="mb-0">&copy; 2025 EaseShop. All Rights Reserved.</p>
  </footer>
);

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  return (
    <>
      <Navbar />
      <div className="container mt-4 d-flex flex-column min-vh-100">
        <h2 className="mb-4">Your Shopping Cart</h2>

        {Object.keys(cart).length === 0 ? (
          <div className="text-center">
            <p className="text-muted">Your cart is empty.</p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            {Object.entries(cart).map(([category, items]) => (
              <div key={category} className="mb-4">
                <h3 className="text-primary">{category.toUpperCase()}</h3>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(items).map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>${Number(item.price).toFixed(2)}</td>
                          <td>
                            <input
                              type="number"
                              value={item.quantity}
                              min="1"
                              className="form-control"
                              style={{ width: "60px" }}
                              onChange={(e) =>
                                updateQuantity(category, item.id, parseInt(e.target.value))
                              }
                            />
                          </td>
                          <td>${(Number(item.price) * item.quantity).toFixed(2)}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeFromCart(category, item.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <h4 className="mt-3">Total: ${getTotalPrice().toFixed(2) || "0.00"}</h4>
            <button className="btn btn-warning me-2" onClick={clearCart}>
              Clear Cart
            </button>
            <Link to="/checkout" className="btn btn-primary">
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
