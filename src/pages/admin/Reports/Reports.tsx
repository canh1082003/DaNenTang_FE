"use client"

import { useState } from "react"
import "./Reports.css"

interface StatCard {
  title: string
  value: string
  change: number
  icon: string
  color: string
}

interface ChartData {
  month: string
  sales: number
}

export default function Reports() {
  const [timeRange, setTimeRange] = useState("monthly")

  const statCards: StatCard[] = [
    {
      title: "Total Sells",
      value: "$654.66k",
      change: 16.24,
      icon: "💰",
      color: "#4CAF50",
    },
    {
      title: "Total Orders",
      value: "$854.66k",
      change: -80.0,
      icon: "📦",
      color: "#FF6B6B",
    },
    {
      title: "Daily Visitors",
      value: "$987.21M",
      change: 80.0,
      icon: "👥",
      color: "#2196F3",
    },
    {
      title: "Daily Visitors",
      value: "$987.21M",
      change: 80.0,
      icon: "👤",
      color: "#FFC107",
    },
  ]

  const chartData: ChartData[] = [
    { month: "Jan", sales: 20 },
    { month: "Feb", sales: 35 },
    { month: "Mar", sales: 45 },
    { month: "Apr", sales: 55 },
    { month: "May", sales: 65 },
    { month: "Jun", sales: 70 },
    { month: "Jul", sales: 75 },
    { month: "Aug", sales: 70 },
    { month: "Sep", sales: 60 },
    { month: "Oct", sales: 50 },
    { month: "Nov", sales: 40 },
    { month: "Dec", sales: 35 },
  ]

  const monthlyStats = [
    { label: "Profit", value: 13570, color: "#FFC107" },
    { label: "Refunds", value: 455877, color: "#2196F3" },
    { label: "Expenses", value: 455877, color: "#4CAF50" },
  ]

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Reports & Analytics</h1>
        <p>Track your business performance and metrics</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: card.color }}>
              {card.icon}
            </div>
            <div className="stat-content">
              <p className="stat-title">{card.title}</p>
              <h3 className="stat-value">{card.value}</h3>
              <p className={`stat-change ${card.change > 0 ? "positive" : "negative"}`}>
                {card.change > 0 ? "↑" : "↓"} {Math.abs(card.change).toFixed(2)}%
              </p>
            </div>
            <a href="#" className="stat-link">
              View details
            </a>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Total Sales Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Total Sales</h2>
            <div className="time-range-buttons">
              <button className={timeRange === "7days" ? "active" : ""} onClick={() => setTimeRange("7days")}>
                7 Days
              </button>
              <button className={timeRange === "monthly" ? "active" : ""} onClick={() => setTimeRange("monthly")}>
                Monthly
              </button>
              <button className={timeRange === "yearly" ? "active" : ""} onClick={() => setTimeRange("yearly")}>
                Yearly
              </button>
            </div>
          </div>
          <div className="line-chart">
            <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <line
                  key={`grid-${i}`}
                  x1="50"
                  y1={50 + i * 30}
                  x2="580"
                  y2={50 + i * 30}
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
              ))}

              {/* Y-axis labels */}
              {[80, 70, 60, 50, 40, 30, 20, 10, 0].map((val, i) => (
                <text key={`label-${i}`} x="35" y={65 + i * 30} fontSize="12" fill="#999" textAnchor="end">
                  {val}
                </text>
              ))}

              {/* Line chart path */}
              <polyline
                points={chartData.map((d, i) => `${50 + (i * 530) / 11},${280 - d.sales * 2.5}`).join(" ")}
                fill="none"
                stroke="#2196F3"
                strokeWidth="3"
              />

              {/* Fill area under line */}
              <polygon
                points={`50,280 ${chartData
                  .map((d, i) => `${50 + (i * 530) / 11},${280 - d.sales * 2.5}`)
                  .join(" ")} 580,280`}
                fill="#2196F3"
                opacity="0.1"
              />

              {/* X-axis labels */}
              {chartData.map((d, i) => (
                <text key={`month-${i}`} x={50 + (i * 530) / 11} y="295" fontSize="12" fill="#999" textAnchor="middle">
                  {d.month}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Monthly Statistics Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Monthly Statistics</h2>
            <select className="time-select">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="stats-legend">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: stat.color }}></span>
                <span className="legend-label">{stat.label}</span>
                <span className="legend-value">{stat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="bar-chart">
            <svg viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={`grid-${i}`}
                  x1="50"
                  y1={30 + i * 40}
                  x2="580"
                  y2={30 + i * 40}
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
              ))}

              {/* Y-axis labels */}
              {["100%", "90%", "80%", "70%", "60%", "50%", "40%", "30%", "20%", "10%", "0%"].map((val, i) => (
                <text key={`label-${i}`} x="35" y={45 + i * 20} fontSize="11" fill="#999" textAnchor="end">
                  {val}
                </text>
              ))}

              {/* Bar groups */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((group) => {
                const x = 50 + group * 30
                const heights = [60, 75, 55]
                return (
                  <g key={`group-${group}`}>
                    {heights.map((height, i) => (
                      <rect
                        key={`bar-${group}-${i}`}
                        x={x + i * 8}
                        y={210 - height}
                        width="6"
                        height={height}
                        fill={monthlyStats[i].color}
                        opacity="0.8"
                      />
                    ))}
                  </g>
                )
              })}

              {/* X-axis labels */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => (
                <text key={`x-label-${num}`} x={50 + num * 30} y="235" fontSize="11" fill="#999" textAnchor="middle">
                  {num}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="bottom-stats">
        {/* Active Creator */}
        <div className="stat-box">
          <h3>Active Creator</h3>
          <p className="stat-number">86,346</p>
          <div className="circular-chart">
            <svg viewBox="0 0 120 120" className="progress-circle">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f0f0" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#FFC107"
                strokeWidth="8"
                strokeDasharray="235.6 314.2"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="65" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#FFC107">
                60/100
              </text>
            </svg>
          </div>
          <div className="mini-chart">
            <svg viewBox="0 0 100 40" preserveAspectRatio="xMidYMid meet">
              <polyline
                points="5,30 15,20 25,25 35,15 45,20 55,10 65,15 75,8 85,12 95,5"
                fill="none"
                stroke="#FFC107"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Recent Order */}
        <div className="stat-box">
          <h3>Recent Order</h3>
          <p className="stat-number">135,86,346</p>
          <div className="circular-chart">
            <svg viewBox="0 0 120 120" className="progress-circle">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f0f0" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="8"
                strokeDasharray="235.6 314.2"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="65" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#4CAF50">
                60/100
              </text>
            </svg>
          </div>
          <div className="mini-chart">
            <svg viewBox="0 0 100 40" preserveAspectRatio="xMidYMid meet">
              <polyline
                points="5,30 15,20 25,25 35,15 45,20 55,10 65,15 75,8 85,12 95,5"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
