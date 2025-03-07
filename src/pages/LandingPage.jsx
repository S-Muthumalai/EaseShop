import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
export const Navbar = () => {
  const {user}=useAuth();
  const {getCartCount}=useCart();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-3" to="/home">
          EaseShop
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-5 fs-6 active">
            <li className="nav-item text-primary">
              <Link className="nav-link active" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item hover:text-primary">
              <Link className="nav-link" to="/shop">
                Shop
              </Link>
            </li>
            <li className="nav-item hover:text-primary">
              <Link className="nav-link" to="/cart">
                Cart ({getCartCount() })
              </Link>
            </li>
            <li className="nav-item hover:text-primary">
              <Link className="nav-link" to="/order-history">
                Order History
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item hover:text-primary">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item hover:text-primary">
                <Link className="nav-link" to="/">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const LandingPage = () => {
  return (
    <div>
      <Navbar/>
      <header className="bg-primary text-white text-center py-5 position-relative">
      <video autoPlay loop muted className="w-100 position-absolute top-0 start-0 h-100 object-fit-cover" style={{filter: "brightness(80%)"}}>
           <source src="/videos/background.mp4" type="video/mp4" />
           Your browser does not support the video tag.
         </video>
         <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <div className="container py-5 my-5 position-relative">
          <h1 className="display-4">Welcome to EaseShop</h1>
          <p className="lead py-3">Your one-stop destination for the best products at amazing prices.</p>
          <div className="container py-3 hover1"><a href="/shop" className="btn text-white border btn-lg mt-3">Shop Now</a></div>
        </div>
      </header>
      <section className="py-5">
        <div className="container border">
          <div className="row text-center ">
            <div className="col-md-4 border">
              <i className="bi bi-truck fs-1 text-primary"></i>
              <h3 className="mt-3">Fast Delivery</h3>
              <p>We ensure quick and safe delivery to your doorstep.</p>
            </div>
            <div className="col-md-4 border">
              <i className="bi bi-cart-check fs-1 text-primary"></i>
              <h3 className="mt-3">Best Prices</h3>
              <p>Affordable prices with top-quality products.</p>
            </div>
            <div className="col-md-4 border">
              <i className="bi bi-shield-lock fs-1 text-primary"></i>
              <h3 className="mt-3">Secure Payments</h3>
              <p>100% safe and secure payment gateways.</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">© 2025 EaseShop. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
// import React from "react";

// const LandingPage = () => {
//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
//         <div className="container">
//           <a className="navbar-brand fw-bold text-primary fs-3" href="#">EaseShop</a>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav ms-auto gap-5 fs-6 active">
//               <li className="nav-item text-primary">
//                 <a className="nav-link active" href="#">Home</a>
//               </li>
//               <li className="nav-item hover:text-primary">
//                 <a className="nav-link" href="/shop">Shop</a>
//               </li>
//               <li className="nav-item hover:text-primary">
//                 <a className="nav-link" href="/cart">Cart</a>
//               </li>
//               <li className="nav-item hover:text-primary">
//                 <a className="nav-link" href="#">About</a>
//               </li>
//               <li className="nav-item hover:text-primary">
//                 <a className="nav-link" href="#">Contact</a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section with Background Video */}
//       <header className="position-relative">
//         {/* Background Video */}
//         <video autoPlay loop muted className="w-100 position-absolute top-0 start-0 h-100 object-fit-cover">
//           <source src="/videos/background.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>

//         {/* Overlay */}
//         <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

//         {/* Text Content */}
//         <div className="container position-relative text-white text-center py-5 my-5">
//           <h1 className="display-4 fw-bold">Welcome to EaseShop</h1>
//           <p className="lead py-3">Your one-stop destination for the best products at amazing prices.</p><br />
//           <a href="/shop" className="btn btn-light btn-lg mt-3">Shop Now</a>
//         </div>
//       </header>

//       {/* Features Section */}
//       <section className="py-5">
//         <div className="container">
//           <div className="row text-center">
//             <div className="col-md-4">
//               <i className="bi bi-truck fs-1 text-primary"></i>
//               <h3 className="mt-3">Fast Delivery</h3>
//               <p>We ensure quick and safe delivery to your doorstep.</p>
//             </div>
//             <div className="col-md-4">
//               <i className="bi bi-cart-check fs-1 text-primary"></i>
//               <h3 className="mt-3">Best Prices</h3>
//               <p>Affordable prices with top-quality products.</p>
//             </div>
//             <div className="col-md-4">
//               <i className="bi bi-shield-lock fs-1 text-primary"></i>
//               <h3 className="mt-3">Secure Payments</h3>
//               <p>100% safe and secure payment gateways.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-dark text-white text-center py-3">
//         <p className="mb-0">© 2025 EaseShop. All Rights Reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
