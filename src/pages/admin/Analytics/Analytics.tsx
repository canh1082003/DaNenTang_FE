import "./Analytics.css"
export default function Analytics() {
  const analyticsData = [
    { label: "Total Messages", value: "18,234", change: "+12.5%", trend: "up" },
    { label: "Avg Response Time", value: "2.3 min", change: "-8.2%", trend: "down" },
    { label: "Customer Satisfaction", value: "94.2%", change: "+3.1%", trend: "up" },
    { label: "Resolved Issues", value: "1,456", change: "+22.3%", trend: "up" },
  ]

  const platformMetrics = [
    { platform: "Facebook", messages: 5420, users: 1250, satisfaction: 95 },
    { platform: "WhatsApp", messages: 3210, users: 890, satisfaction: 92 },
    { platform: "Instagram", messages: 7890, users: 2100, satisfaction: 96 },
    { platform: "Telegram", messages: 1230, users: 450, satisfaction: 88 },
    { platform: "Twitter", messages: 484, users: 200, satisfaction: 85 },
  ]

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Monitor your chatbox performance and metrics</p>
      </div>

      <div className="analytics-grid">
        {analyticsData.map((item, index) => (
          <div key={index} className="analytics-card">
            <p className="analytics-label">{item.label}</p>
            <p className="analytics-value">{item.value}</p>
            <p className={`analytics-change ${item.trend}`}>
              {item.change} {item.trend === "up" ? "📈" : "📉"}
            </p>
          </div>
        ))}
      </div>

      <div className="card_analytics">
        <div className="card-header">
          <h2>Platform Performance</h2>
        </div>
        <div className="table-container">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Messages</th>
                <th>Users</th>
                <th>Satisfaction</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {platformMetrics.map((metric, index) => (
                <tr key={index}>
                  <td className="platform-name">{metric.platform}</td>
                  <td>{metric.messages.toLocaleString()}</td>
                  <td>{metric.users.toLocaleString()}</td>
                  <td>{metric.satisfaction}%</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${metric.satisfaction}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
