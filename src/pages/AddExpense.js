import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, set, get } from "firebase/database"; // Import Firebase methods
import "./AddExpense.css";

const AddExpense = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [budget, setBudget] = useState("");
  const [totalExpense, setTotalExpense] = useState(0);

  // Fetch total expenses from Firebase
  useEffect(() => {
    const fetchExpenses = async () => {
      const expensesRef = ref(db, "expenses");
      const snapshot = await get(expensesRef);
      if (snapshot.exists()) {
        const expensesData = snapshot.val();
        const total = Object.values(expensesData).reduce((acc, exp) => acc + parseFloat(exp.amount), 0);
        setTotalExpense(total);
      }
    };

    const fetchBudget = async () => {
      const budgetRef = ref(db, "budget");
      const snapshot = await get(budgetRef);
      if (snapshot.exists()) {
        setBudget(snapshot.val());
      }
    };

    fetchExpenses();
    fetchBudget();
  }, []);

  // Handle Expense Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !date || !category) return;

    const expenseData = { amount: parseFloat(amount), date, category, description };

    try {
      await push(ref(db, "expenses"), expenseData);
      setSuccessMessage("Expense added successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
      setAmount("");
      setDate("");
      setCategory("Food");
      setDescription("");

      setTotalExpense(totalExpense + parseFloat(amount));

      if (budget && totalExpense + parseFloat(amount) > budget) {
        alert("⚠️ Warning! You have exceeded your monthly budget.");
      }
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  // Handle Budget Submission
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!budget) return;

    try {
      await set(ref(db, "budget"), parseFloat(budget));
      setSuccessMessage("Budget set successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error setting budget: ", error);
    }
  };

  return (
    <div className="add-expense-container">
      <h2 className="expense-titl">Add Expense</h2>

      {successMessage && <div className="success-popup">{successMessage}</div>}

      {/* Budget Section */}
      <form onSubmit={handleBudgetSubmit} className="budget-form">
        <label>Set Monthly Budget</label>
        <input
          type="number"
          placeholder="Enter Budget Amount"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />
        <button type="submit" className="set-budget-btn">Save Budget</button>
      </form>

      {/* Expense Form */}
      <form onSubmit={handleSubmit} className="expense-form">
        <label>Amount</label>
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Others">Others</option>
        </select>

        <label>Description</label>
        <textarea
          placeholder="Enter description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" className="save-expense-btn">Save Expense</button>
      </form>

      {/* Budget & Expense Overview */}
      <div className="budget-overview">
        <h3>Budget: ₹{budget || "Not Set"}</h3>
        <h3>Total Expenses: ₹{totalExpense}</h3>
        {budget && totalExpense > budget && <p className="warning-text">⚠️ Budget Exceeded!</p>}
      </div>
    </div>
  );
};

export default AddExpense;
