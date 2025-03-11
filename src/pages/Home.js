import React from "react";
import Sidebar from "../components/Sidebar";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="home-content">
        <h1 className="home-title">Welcome to Expense Manager</h1>

        {/* About the App Section */}
        <div className="about-app">
          <h2>About Expense Manager</h2>
          <p>
            Expense Manager is a powerful and user-friendly app designed to help
            you track your expenses, set budgets, and manage your finances
            efficiently. Stay on top of your financial goals with ease!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="cards-container">
          <div className="card">
            <h3>Track Your Expenses</h3>
            <p>Monitor your daily expenses and keep your finances in check.</p>
          </div>

          <div className="card">
            <h3>Set & Manage Budgets</h3>
            <p>Set budget limits and get alerts to stay within your spending goals.</p>
          </div>

          <div className="card">
            <h3>Get Financial Insights</h3>
            <p>Analyze your spending trends with visual charts and reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
