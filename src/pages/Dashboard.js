import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from "chart.js";
import "./Dashboard.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const expensesRef = ref(db, "expenses");
    onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const expenseList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setExpenses(expenseList);
      }
    });
  }, []);

  // Process Data
  const dailyExpenses = {};
  const monthlyExpenses = {};
  const categoryExpenses = {};

  expenses.forEach(expense => {
    const date = new Date(expense.date).toLocaleDateString();
    const month = new Date(expense.date).toLocaleString("default", { month: "short" });
    const category = expense.category;

    dailyExpenses[date] = (dailyExpenses[date] || 0) + expense.amount;
    monthlyExpenses[month] = (monthlyExpenses[month] || 0) + expense.amount;
    categoryExpenses[category] = (categoryExpenses[category] || 0) + expense.amount;
  });

  // Chart Data
  const barChartData = {
    labels: Object.keys(dailyExpenses),
    datasets: [{
      label: "Daily Expenses",
      data: Object.values(dailyExpenses),
      backgroundColor: "#E00063",
    }],
  };

  const pieChartData = {
    labels: Object.keys(categoryExpenses),
    datasets: [{
      label: "Category-wise Expenses",
      data: Object.values(categoryExpenses),
      backgroundColor: ["#E00063", "#5B0E96", "#FFA500", "#1E90FF", "#32CD32"],
    }],
  };

  const lineChartData = {
    labels: Object.keys(monthlyExpenses),
    datasets: [{
      label: "Monthly Expenses",
      data: Object.values(monthlyExpenses),
      borderColor: "#5B0E96",
      backgroundColor: "rgba(91, 14, 150, 0.2)"
    }],
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Expense Dashboard</h1>

        <div className="chart-container">
          <div className="chart-card">
            <h2>Daily Expenses</h2>
            <Bar data={barChartData} />
          </div>

          <div className="chart-card">
            <h2>Category-wise Expenses</h2>
            <Pie data={pieChartData} />
          </div>

          <div className="chart-card">
            <h2>Monthly Expenses</h2>
            <Line data={lineChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
