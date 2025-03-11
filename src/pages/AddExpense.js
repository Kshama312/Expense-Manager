import React, { useState } from "react";
import { db } from "../firebase";
import { ref, push } from "firebase/database"; // Import Realtime Database methods
import "./AddExpense.css";

const AddExpense = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !date || !category) return;

    const expenseData = { amount, date, category, description };

    try {
      
      await push(ref(db, "expenses"), expenseData);
      console.log("Expense added successfully!");

      setSuccessMessage("Expense added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setAmount("");
      setDate("");
      setCategory("Food");
      setDescription("");
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  return (
    <div className="add-expense-container">
      <h2 className="expense-titl">Add Expense</h2>
      
      {successMessage && <div className="success-popup">{successMessage}</div>}

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

        <button type="submit" className="save-expense-btn">
          Save Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
