import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "./CartContext";
import { Navbar } from "./LandingPage";
import { db } from "../firebase"; // Import Firestore database instance
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          setProduct({ id: productSnap.id, ...productData });

          // Fetch related products (same category, excluding current product)
          const relatedQuery = query(
            collection(db, "products"),
            where("category", "==", productData.category)
          );
          const relatedSnap = await getDocs(relatedQuery);
          const relatedData = relatedSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(item => item.id !== id);
          setRelatedProducts(relatedData);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <h2 className="text-center mt-5">Loading product details...</h2>;
  }

  if (!product) {
    return <h2 className="text-center mt-5">Product not found</h2>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar />

      {/* Product Details Section */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <img src={product.imageUrl} className="img-fluid rounded shadow h-100 w-50" alt={product.name} />
          </div>
          <div className="col-md-6">
            <h2>{product.name}</h2>
            <h4 className="text-primary">${product.price}</h4>
            <p>{product.description}</p>
            <button className="btn btn-success" onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="container mt-5">
        <h3 className="text-center">Explore More Products</h3>
        {relatedProducts.length > 0 ? (
          <div className="row">
            {relatedProducts.map((related) => (
              <div key={related.id} className="col-md-3 mb-4">
                <div className="card">
                  <img src={related.imageUrl} className="card-img-top" alt={related.name} />
                  <div className="card-body text-center">
                    <h5>{related.name}</h5>
                    <p>${related.price}</p>
                    <button className="btn btn-primary" onClick={() => addToCart(related)}>
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
      <footer className="bg-dark text-white text-center py-3 mt-5 mt-auto">
        <p className="mb-0">© 2025 EaseShop. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ProductDetails;
