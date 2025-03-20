import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { Navbar } from "./LandingPage";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ShopPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
        console.log("Fetched products:", productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <header className="bg-primary text-white text-center py-2">
        <div className="container">
          <h1 className="display-4">Shop Our Products</h1>
          <p className="lead">Find the best deals on the latest tech.</p>
        </div>
      </header>

      <div className="container my-5">
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : products.length > 0 ? (
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-3 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.imageUrl || product.image || "https://via.placeholder.com/200"}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "300px", objectFit: "cover", width: "100%" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">${product.price}</p>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => addToCart(product)}
                    >
                      🛒 Add to Cart
                    </button>
                    <Link to={`/product/${product.id}`} className="btn btn-primary hover1">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No products available.</p>
        )}
      </div>

      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">© 2025 EaseShop. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ShopPage;
