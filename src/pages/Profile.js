import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { auth } from "../firebase"; // Import Firebase auth
import { sendPasswordResetEmail } from "firebase/auth";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  // Fetch user details from Firebase Auth
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
      });
    }
  }, []);

  // Handle Profile Picture Upload
  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    if (user?.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        alert(`Password reset email sent to ${user.email}`);
      } catch (error) {
        alert("Error sending reset email: " + error.message);
      }
    } else {
      alert("No user email found. Please log in again.");
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      <div className="profile-card">
        {/* Profile Picture Section */}
        <div className="profile-pic-container">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <FaUserCircle className="profile-icon" size={100} color="purple" />
          )}
          <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        </div>

        {/* User Details */}
        <div className="profile-details">
          <p><strong>Name:</strong> {user?.name || "Loading..."}</p>
          <p><strong>Email:</strong> {user?.email || "Loading..."}</p>
        </div>

        {/* Reset Password Button */}
        <div className="profile-actions">
          <button className="btn password-btn" onClick={handlePasswordReset}>
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
