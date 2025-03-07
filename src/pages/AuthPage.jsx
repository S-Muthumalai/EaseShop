import React, { useState } from "react";
import { signUp, login, signInWithGoogle } from "../firebase";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "./Auth.css";
const AuthPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("user"); // Default role is user
  const navigate = useNavigate(); // Navigation hook

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userRole = await login(email, password);
      alert("Login successful!");

      if (userRole === "admin") {
        navigate("/admin"); // Redirect to admin dashboard
      } else {
        navigate("/home"); // Redirect to user dashboard
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password, fullName, role);
      alert("Signup successful! Please login.");
      setIsFlipped(false); // Flip back to login
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userRole = await signInWithGoogle();
      alert("Google login successful!");

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className={`auth-inner ${isFlipped ? "flipped" : ""}`}>
          
          {/* Login Form */}
          <div className="auth-form login-form">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Login</button>
            </form>
            <button className="google-btn" onClick={handleGoogleLogin}>Login with Google</button>
            <p>Don't have an account? <span onClick={handleFlip}>Register</span></p>
          </div>

          {/* Register Form */}
          <div className="auth-form register-form">
            <h2>Register</h2>
            <form onSubmit={handleSignUp}>
              <input type="text" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Register</button>
            </form>
            <p>Already have an account? <span onClick={handleFlip}>Login</span></p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
