import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "../App.css"; // Custom CSS file for styling

function App() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filters, setFilters] = useState({
        category: "",
        sold: "",
        priceRange: "",
        sortOrder: "",
    });
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios
            .get("https://backend-project-tjgt.onrender.com/task")
            .then((response) => {
                setTasks(response.data);
                setFilteredTasks(response.data); // Initialize filtered data
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);

        let filtered = tasks.filter((task) => {
            let isInPriceRange = true;

            // Price Range Filtering Logic
            if (value && name === "priceRange") {
                switch (value) {
                    case "0-300":
                        isInPriceRange = task.Price >= 0 && task.Price <= 300;
                        break;
                    case "300-600":
                        isInPriceRange = task.Price > 300 && task.Price <= 600;
                        break;
                    case "600-above":
                        isInPriceRange = task.Price > 600;
                        break;
                    default:
                        isInPriceRange = true;
                }
            }

            return (
                (updatedFilters.category === "" || task.Category === updatedFilters.category) &&
                (updatedFilters.sold === "" || task.Sold.toString() === updatedFilters.sold) &&
                isInPriceRange
            );
        });

        // Sorting Logic
        if (updatedFilters.sortOrder === "low-to-high") {
            filtered.sort((a, b) => a.Price - b.Price);
        } else if (updatedFilters.sortOrder === "high-to-low") {
            filtered.sort((a, b) => b.Price - a.Price);
        }

        setFilteredTasks(filtered);
    };

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = tasks.filter((task) => {
            return (
                task.Title.toLowerCase().includes(term) ||
                task.Description.toLowerCase().includes(term) ||
                task.Category.toLowerCase().includes(term)
            );
        });

        setFilteredTasks(filtered);
    };

    return (
        <>
        <header>
        <nav className="navbar navbar-links">
          <Link to="/">Home</Link> 
          <Link to="/AnalyticsPage">Graph</Link>
          {/* <a href="/info">Info</a> */}
        </nav>
      </header>
        <div className="app-container">
            <h1 className="title">Product List</h1>

            {/* Filter Section */}
            <div className="filters-container">
                <label>
                    Category:
                    <select name="category" value={filters.category} onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Kitchen">Kitchen</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </label>
                <label>
                    Sold:
                    <select name="sold" value={filters.sold} onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </label>
                <label>
                    Price Range:
                    <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="0-300">0 to 300</option>
                        <option value="300-600">300 to 600</option>
                        <option value="600-above">600 and above</option>
                    </select>
                </label>
                <label>
                    Sort Order:
                    <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
                        <option value="">Sort by Price</option>
                        <option value="low-to-high">Low to High</option>
                        <option value="high-to-low">High to Low</option>
                    </select>
                </label>
            </div>

            {/* Search Section */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Title, Description, or Category"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Centered Data Table */}
            <div className="table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>Sold</th>
                            <th>IsSale</th>
                            <th>Date of Sale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => (
                                <tr key={task._id}>
                                    <td>{task.Title}</td>
                                    <td>{task.Price}</td>
                                    <td>{task.Description}</td>
                                    <td>{task.Category}</td>
                                    <td>
                                        <a href={task.Image} target="_blank" rel="noopener noreferrer">
                                            <img src={task.Image} alt={task.Title} className="product-image" />
                                        </a>
                                    </td>
                                    <td>{task.Sold ? "Yes" : "No"}</td>
                                    <td style={{ color: task.IsSale ? 'green' : 'red' }}>
                                        {task.IsSale ? 'Yes' : 'No'}
                                    </td>
                                    <td>
                                        {task.DateOfSale ? new Date(task.DateOfSale).toLocaleDateString() : "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}

export default App;
