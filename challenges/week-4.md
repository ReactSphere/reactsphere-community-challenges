# 🛒 Week 4 Solution - Dynamic Shopping List & Local Storage

A beginner-friendly yet practical React.js application focused on managing state with arrays, controlled inputs, and data persistence using Browser Local Storage.

## 🚀 Objective
Build an interactive Shopping List Manager allowing users to add items, check them off as completed, delete single items, and persist the list state in browser storage across page reloads.

## ✨ Features
* **Add Item**: Controlled input form to append new items with a unique ID, text content, and completion status.
* **Toggle Complete**: Cross out items by toggling their completed flag.
* **Delete Item**: Remove any item instantly using filter methods.
* **Data Persistence**: Syncs and saves the items array automatically to `localStorage`.
* **Conditional Rendering**: Displays a friendly placeholder notice when the list is empty.

## 💻 Source Code (`ShoppingList.jsx`)

```jsx
import React, { useState, useEffect } from "react";

function ShoppingList() {
  // Initialize state from localStorage if available
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("shopping_items");
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [inputValue, setInputValue] = useState("");

  // Sync items to localStorage on change
  useEffect(() => {
    localStorage.setItem("shopping_items", JSON.stringify(items));
  }, [items]);

  // Handle adding a new item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newItem = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setItems([...items, newItem]);
    setInputValue("");
  };

  // Toggle completion status
  const handleToggleComplete = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Delete single item
  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>📝 My Shopping List</h2>
      
      {/* Input Form */}
      <form onSubmit={handleAddItem} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new item..."
          style={{ flex: 1, padding: "8px", fontSize: "16px" }}
        />
        <button type="submit" style={{ padding: "8px 16px", fontSize: "16px", cursor: "pointer" }}>
          Add
        </button>
      </form>

      {/* Item List or Empty Message */}
      {items.length === 0 ? (
        <p style={{ color: "#666", fontStyle: "italic" }}>Your shopping list is empty. Add something below!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderBottom: "1px solid #ddd",
                textDecoration: item.completed ? "line-through" : "none",
                color: item.completed ? "#888" : "#000",
              }}
            >
              <span
                onClick={() => handleToggleComplete(item.id)}
                style={{ cursor: "pointer", flex: 1 }}
              >
                {item.text}
              </span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                style={{ background: "#ff4d4d", color: "#white", border: "none", padding: "4px 8px", cursor: "pointer", borderRadius: "4px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShoppingList;
```

## 🏆 Submission Details
* **Solution by**: @mahmudul-Hasan-2
* **Branch**: `week-4-solution`
