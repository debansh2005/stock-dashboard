import React, { useEffect, useState } from "react";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);

  const [symbol, setSymbol] = useState("IBM");
  const [symbol2, setSymbol2] = useState("AAPL");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load default comparison
 useEffect(() => {
  fetchData();
}, [fetchData]);

 const fetchData = useCallback(() => {
  setLoading(true);
  setError("");

  Promise.all([
    axios.get(`https://stock-backend-zkrj.onrender.com/history/${symbol}`),
    axios.get(`https://stock-backend-zkrj.onrender.com/history/${symbol2}`)
  ])
    .then(([res1, res2]) => {
      if (Array.isArray(res1.data) && res1.data.length > 0) {
        setData(res1.data.reverse());
      }

      if (Array.isArray(res2.data) && res2.data.length > 0) {
        setData2(res2.data.reverse());
      }

      setLoading(false);
    })
    .catch(() => {
      setError("Error fetching data");
      setLoading(false);
    });
}, [symbol, symbol2]);

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: symbol,
        data: data.map(item => item.close),
        borderColor: "blue",
        tension: 0.1
      },
      {
        label: symbol2,
        data: data2.map(item => item.close),
        borderColor: "red",
        tension: 0.1
      }
    ]
  };

 const options = {
  scales: {
    y: {
      beginAtZero: false
    }
  },
  plugins: {
    legend: {
      labels: {
        color: "white"
      }
    }
  }
};

 return (
  <div style={{
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>
    <div style={{
      backgroundColor: "#1e293b",
      padding: "30px",
      borderRadius: "12px",
      width: "900px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
    }}>
      
      <h1 style={{ marginBottom: "20px" }}>
        📊 Stock Dashboard
      </h1>

      {/* INPUTS */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Stock 1 (AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "6px",
            border: "none",
            width: "120px"
          }}
        />

        <input
          type="text"
          placeholder="Stock 2 (TSLA)"
          value={symbol2}
          onChange={(e) => setSymbol2(e.target.value.toUpperCase())}
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "6px",
            border: "none",
            width: "120px"
          }}
        />

        <button
          onClick={fetchData}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Compare
        </button>
      </div>

      {/* OUTPUT */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "#f87171" }}>{error}</p>
      ) : (
        <div style={{
          backgroundColor: "#0f172a",
          padding: "15px",
          borderRadius: "10px"
        }}>
          <Line data={chartData} options={options} />
        </div>
      )}

    </div>
  </div>
);
}

export default App;