import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Import Firebase auth
import { FaBars, FaHome, FaChartBar, FaPlus, FaHistory, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close sidebar after clicking
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setIsOpen(false); // Close sidebar after logout
  };

  return (
    <>
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleSidebar}>
        <FaBars size={25} />
      </div>

      {/* Sidebar Menu */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => handleNavigation("/home")}>
            <FaHome /> Home
          </li>
          <li onClick={() => handleNavigation("/dashboard")}>
            <FaChartBar /> Dashboard
          </li>
          <li onClick={() => handleNavigation("/add-expense")}>
            <FaPlus /> Add Expense
          </li>
          <li onClick={() => handleNavigation("/expense-history")}>
            <FaHistory /> Expense History
          </li>
          <li onClick={() => handleNavigation("/profile")}>
            <FaUser /> Profile
          </li>
          {/* Logout Below Profile */}
          <li className="logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
