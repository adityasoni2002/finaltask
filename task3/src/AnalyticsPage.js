import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const [salesData, setSalesData] = useState({});
  const [itemsData, setItemsData] = useState({});

  useEffect(() => {
    axios
      .get("https://backend-project-tjgt.onrender.com/task")
      .then((response) => {
        const data = response.data;

        const categorySales = data.reduce((acc, task) => {
          const month = new Date(task.DateOfSale).getMonth();
          if (task.Sold && task.Price > 0) {
            if (!acc[task.Category]) acc[task.Category] = Array(12).fill(0);
            acc[task.Category][month] += task.Price;
          }
          return acc;
        }, {});

        const categoryItems = data.reduce((acc, task) => {
          const month = new Date(task.DateOfSale).getMonth();
          if (!acc[task.Category]) acc[task.Category] = Array(12).fill(0);
          acc[task.Category][month] += 1;
          return acc;
        }, {});

        setSalesData(categorySales);
        setItemsData(categoryItems);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const salesGraphData = {
    labels: Array.from({ length: 12 }, (_, i) => new Date(2025, i).toLocaleString("en-US", { month: "short" })),
    datasets: Object.keys(salesData).map((category) => ({
      label: category,
      data: salesData[category],
      borderColor: "rgba(75, 192, 192, 1)",
      tension: 0.1,
    })),
  };

  const itemsGraphData = {
    labels: Array.from({ length: 12 }, (_, i) => new Date(2025, i).toLocaleString("en-US", { month: "short" })),
    datasets: Object.keys(itemsData).map((category) => ({
      label: category,
      data: itemsData[category],
      borderColor: "rgba(153, 102, 255, 1)",
      tension: 0.1,
    })),
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Analytics</h1>

      <div style={{ marginBottom: "20px", width: "60%" }}>
        <h2 style={{textAlign:"center"}}>Category-Wise Sales Amount (Monthly)</h2> <br></br>
        <Line data={salesGraphData} options={{ responsive: true }} />
      </div>

      <div style={{ marginBottom: "20px", width: "60%" }}>
        <h2 style={{textAlign:"center"}}>Total Items in Each Category (Monthly)</h2><br></br>
        <Line data={itemsGraphData} options={{ responsive: true }} />
      </div>
    </div>
    </>
  );
};

export default AnalyticsPage;
