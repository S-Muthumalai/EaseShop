import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { Navbar } from "./LandingPage";
const UserDetails = () => {
  const [userData, setUserData] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); // Redirect to login page
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setFullName(userSnap.data().fullName);
          setEmail(userSnap.data().email);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        // Update Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { fullName, email });

        // Update Firebase Auth Profile
        await updateProfile(user, { displayName: fullName });

        // Update Email (Optional)
        if (email !== user.email) {
          await updateEmail(user, email);
        }

        // Update Password (Optional)
        if (newPassword) {
          await updatePassword(user, newPassword);
        }

        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message);
    }
  };

  if (!userData) return <p>Loading user details...</p>;

  return (<>   
  <Navbar/>
 <div className="container mt-5">
      <h2>User Profile</h2>
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          className="form-control"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mt-3 m-2" onClick={handleUpdateProfile}>
        Update Profile
      </button>
      <button className="btn btn-primary mt-3 m-2" onClick={handleLogout}>
                    Logout
      </button>
    </div>
    </>
  );
};

export default UserDetails;
