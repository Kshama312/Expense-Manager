import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, remove } from "firebase/database";
import { FaTrash } from "react-icons/fa"; // Using only the delete icon
import "./ExpenseHistory.css"; // Make sure styles match the theme

const ExpenseHistory = () => {
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
      } else {
        setExpenses([]);
      }
    });
  }, []);

  // Delete function
  const handleDelete = async (id) => {
    const expenseRef = ref(db, `expenses/${id}`);
    await remove(expenseRef);
  };

  return (
    <div className="expense-history-container">
      <h2 className="expense-title">Expense History</h2>
      {expenses.length === 0 ? (
        <p className="no-expenses">No expenses found.</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <div className="expense-details">
                <p><strong>Amount:</strong> ₹{expense.amount}</p>
                <p><strong>Date:</strong> {expense.date}</p>
                <p><strong>Category:</strong> {expense.category}</p>
                <p><strong>Description:</strong> {expense.description}</p>
              </div>
              <FaTrash className="delete-icon" onClick={() => handleDelete(expense.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseHistory;
