import React from "react";
import { useParams } from "react-router-dom";
import { useCart } from "./CartContext";
import phone from './images/phone.jpg';
import laptop from './images/lap.jpg';
import headphones from './images/headphone.jpg';
import smartwatch from './images/smartwatch.jpg';
import { Navbar } from "./LandingPage";

// Product Data
const products = [
  { id: 1, name: "Smartphone", price: 699, image: phone, description: "A high-end smartphone with the latest features.", category: "phone" },
  { id: 2, name: "Laptop", price: 999, image: laptop, description: "A powerful laptop with high performance.", category: "laptop" },
  { id: 3, name: "Headphones", price: 199, image: headphones, description: "Noise-canceling headphones for great audio quality.", category: "headphones" },
  { id: 4, name: "Smartwatch", price: 299, image: smartwatch, description: "A stylish smartwatch with health tracking.", category: "smartwatch" },
  { id: 5, name: "Smartphone", price: 699, image: phone, description: "A high-end smartphone with the latest features.", category: "phone" },
  { id: 6, name: "Laptop", price: 999, image: laptop, description: "A powerful laptop with high performance.", category: "laptop" },
  { id: 7, name: "Headphones", price: 199, image: headphones, description: "Noise-canceling headphones for great audio quality.", category: "headphones" },
  { id: 8, name: "Smartwatch", price: 299, image: smartwatch, description: "A stylish smartwatch with health tracking.", category: "smartwatch" },
  { id: 9, name: "Smartphone", price: 999, image: phone, description: "A high-end smartphone with the latest features.", category: "phone" },
  { id: 10, name: "Laptop", price: 999, image: laptop, description: "A powerful laptop with high performance.", category: "laptop" },
  { id: 11, name: "Headphones", price: 199, image: headphones, description: "Noise-canceling headphones for great audio quality.", category: "headphones" },
  { id: 12, name: "Smartwatch", price: 299, image: smartwatch, description: "A stylish smartwatch with health tracking.", category: "smartwatch" },
];

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  // Find the product based on ID
  const product1 = products.find((item) => item.id === parseInt(id));

  if (!product1) {
    return <h2 className="text-center mt-5">Product not found</h2>;
  }

  // Get related products (same category but not the selected product)
  const relatedProducts = products.filter((product) => product.category === product1.category && product.id !== product1.id);

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Product Details Section */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <img src={product1.image} className="img-fluid rounded shadow h-100 w-50" alt={product1.name} />
          </div>
          <div className="col-md-6">
            <h2>{product1.name}</h2>
            <h4 className="text-primary">{product1.price}</h4>
            <p>{product1.description}</p>
            <button className="btn btn-success" onClick={() => addToCart(product1)}>Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="container mt-5">
        <h3 className="text-center">Explore More Products</h3>
        {relatedProducts.length > 0 ? (
          <div className="row">
            {relatedProducts.map((product) => (
              <div key={product.id} className="col-md-3 mb-4">
                <div className="card">
                  <img src={product.image} className="card-img-top" alt={product.name} />
                  <div className="card-body text-center">
                    <h5>{product.name}</h5>
                    <p>{product.price}</p>
                    <button className="btn btn-primary" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-3">There are no related products.</p>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p className="mb-0">© 2025 EaseShop. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ProductDetails;


