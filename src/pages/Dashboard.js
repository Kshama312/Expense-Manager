import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import "./Dashboard.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const expensesRef = ref(db, "expenses");
    const budgetRef = ref(db, "budget");

    // Fetch expenses from Firebase
    const unsubscribeExpenses = onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const expenseList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setExpenses(expenseList);

        // ✅ Calculate total expense safely
        const calculatedTotal = expenseList.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
        setTotalExpense(calculatedTotal);
      } else {
        setExpenses([]);
        setTotalExpense(0);
      }
    });

    // Fetch budget limit from Firebase
    const unsubscribeBudget = onValue(budgetRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Budget Data from Firebase:", data); // Debugging
      if (data !== null) {
        setBudgetLimit(Number(data)); // ✅ Use data directly
      } else {
        setBudgetLimit(0);
      }
    });
    

    return () => {
      unsubscribeExpenses();
      unsubscribeBudget();
    };
  }, []);

  // ✅ Calculate remaining balance
  const remainingBalance = budgetLimit - totalExpense;
  const overBudget = remainingBalance < 0;

  // ✅ Process Expense Data for Charts
  const dailyExpenses = {};
  const categoryExpenses = {};
  const monthlyExpenses = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    const month = new Date(expense.date).toLocaleString("default", { month: "short" });
    const category = expense.category;

    dailyExpenses[date] = (dailyExpenses[date] || 0) + expense.amount;
    monthlyExpenses[month] = (monthlyExpenses[month] || 0) + expense.amount;
    categoryExpenses[category] = (categoryExpenses[category] || 0) + expense.amount;
  });

  // ✅ Chart Data
  const barChartData = {
    labels: Object.keys(dailyExpenses),
    datasets: [
      {
        label: "Daily Expenses",
        data: Object.values(dailyExpenses),
        backgroundColor: "#E00063",
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        label: "Category-wise Expenses",
        data: Object.values(categoryExpenses),
        backgroundColor: ["#E00063", "#5B0E96", "#FFA500", "#1E90FF", "#32CD32"],
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(monthlyExpenses),
    datasets: [
      {
        label: "Monthly Expenses",
        data: Object.values(monthlyExpenses),
        borderColor: "#5B0E96",
        backgroundColor: "rgba(91, 14, 150, 0.2)",
      },
    ],
  };

  const budgetChartData = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [totalExpense, Math.max(remainingBalance, 0)],
        backgroundColor: [overBudget ? "#E00063" : "#1E90FF", "#32CD32"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Expense Dashboard</h1>

        {/* Budget Summary */}
        <div className="summary-container">
          <div className="summary-card">
            <h2>Total Expenses</h2>
            <p>₹{totalExpense.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h2>Budget Limit</h2>
            <p>₹{budgetLimit.toFixed(2)}</p>
          </div>
          <div className={`summary-card ${overBudget ? "over-budget" : ""}`}>
            <h2>{overBudget ? "Over Budget" : "Remaining Balance"}</h2>
            <p>₹{remainingBalance.toFixed(2)}</p>
          </div>
        </div>

        {/* Charts Section */}
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

          <div className="chart-card">
            <h2>Budget vs Expenses</h2>
            <Doughnut data={budgetChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
