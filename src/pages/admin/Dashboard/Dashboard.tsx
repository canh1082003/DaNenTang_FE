import "./Dashboard.css"
export default function Dashboard() {
  const stats = [
    { label: "Total Conversations", value: "1,234", icon: "💬", color: "#3B82F6" },
    { label: "Active Platforms", value: "5", icon: "🌐", color: "#10B981" },
    { label: "Messages Today", value: "892", icon: "📨", color: "#F59E0B" },
    { label: "Response Rate", value: "98.5%", icon: "✅", color: "#8B5CF6" },
  ]

  const recentConversations = [
    { id: 1, user: "Alice Johnson", platform: "Facebook", message: "Hi, I need help...", time: "2 min ago" },
    { id: 2, user: "Bob Smith", platform: "WhatsApp", message: "Thanks for the update", time: "15 min ago" },
    { id: 3, user: "Carol White", platform: "Instagram", message: "Can you check my order?", time: "1 hour ago" },
    { id: 4, user: "David Brown", platform: "Telegram", message: "Perfect, thank you!", time: "2 hours ago" },
  ]

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your chatbox overview.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card_dashboard">
          <div className="card-header">
            <h2>Recent Conversations</h2>
            <a href="#" className="view-all">
              View All →
            </a>
          </div>
          <div className="conversations-list">
            {recentConversations.map((conv) => (
              <div key={conv.id} className="conversation-item">
                <div className="conv-avatar">{conv.user.charAt(0)}</div>
                <div className="conv-content">
                  <div className="conv-header">
                    <p className="conv-user">{conv.user}</p>
                    <span className="conv-platform">{conv.platform}</span>
                  </div>
                  <p className="conv-message">{conv.message}</p>
                </div>
                <p className="conv-time">{conv.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Platform Status</h2>
          </div>
          <div className="platform-status">
            <div className="status-item">
              <span className="status-dot online"></span>
              <span className="status-name">Facebook</span>
              <span className="status-badge">Connected</span>
            </div>
            <div className="status-item">
              <span className="status-dot online"></span>
              <span className="status-name">WhatsApp</span>
              <span className="status-badge">Connected</span>
            </div>
            <div className="status-item">
              <span className="status-dot online"></span>
              <span className="status-name">Instagram</span>
              <span className="status-badge">Connected</span>
            </div>
            <div className="status-item">
              <span className="status-dot offline"></span>
              <span className="status-name">Telegram</span>
              <span className="status-badge">Disconnected</span>
            </div>
            <div className="status-item">
              <span className="status-dot online"></span>
              <span className="status-name">Twitter</span>
              <span className="status-badge">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
