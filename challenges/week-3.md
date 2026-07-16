# 🛒 Week 3 Challenge - Dynamic Product Catalog with Search & Filter

An advanced React.js application focused on dynamic data rendering, controlled form components, search optimization, and category-based filtering. 

---

## 🚀 Objective
The goal of this challenge is to build a high-performance **Product Catalog Component**. It will fetch or manage a list of items and allow users to search products in real-time and filter them by category, while handling empty/loading states gracefully.

## ✨ Requirements & Specifications
* **State Management:** 
  * Declare states for `products` (list of items), `searchQuery` (text input), and `selectedCategory` (dropdown/filter value).
* **Core Functionalities:**
  * **Real-time Search:** Filter products dynamically as the user types in the search bar (case-insensitive).
  * **Category Filter:** A dropdown or button group to filter items by categories (e.g., *All, Electronics, Clothing, Books*).
  * **Clear Filters Button:** A reset mechanism to instantly clear the search query and reset the category to "All".
* **Conditional Rendering:** 
  * If no products match the search or filter criteria, display a user-friendly message: `"No products found matching your criteria."`
* **Initial Display:** Show all products by default when the component mounts.

---

## 🛠️ Challenge Tasks (Step-by-Step)
1. Create a `ProductCatalog` component.
2. Initialize a mock data array of at least 6 products (each having `id`, `name`, `category`, `price`, and `image_url`).
3. Implement a search input and give it an `onChange` handler to update `searchQuery`.
4. Implement a filter dropdown (`<select>`) for categories.
5. Write a combined filtering logic that filters the array based on *both* search text and selected category before rendering.

---

## 💻 Recommended Boilerplate Structure

```jsx
import React, { useState } from "react";

// Mock Data
const MOCK_PRODUCTS = [
  { id: 1, name: "Wireless Mouse", category: "Electronics", price: 25 },
  { id: 2, name: "Mechanical Keyboard", category: "Electronics", price: 75 },
  { id: 3, name: "Premium Hoodie", category: "Clothing", price: 45 },
  { id: 4, name: "Denim Jeans", category: "Clothing", price: 60 },
  { id: 5, name: "JavaScript: The Good Parts", category: "Books", price: 30 },
  { id: 6, name: "Learn React in 24 Hours", category: "Books", price: 20 },
];

function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // TODO: Implement your filtering logic here

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>📦 Product Catalog</h2>
      {/* Build your Search Input, Category Dropdown, and Product Grid here */}
    </div>
  );
}

export default ProductCatalog;

```

---
### 📤 Submission Guidelines

* **Branch:** `week-3-solution`
* **Pull Request:** Submit a PR to the main repository.
* **PR Title Format:** `Week 3 Solution - [Your GitHub Username]`

### 🏆 Evaluation & Points

* **Challenge Completed:** 🎯 20 Points *(Due to advanced filtering logic)*
* **PR Merged:** 🏅 10 Points

*Solution by: @mahmudul-Hasan-2*
