import "./Dashboard.css";
import {
  usePlatforms,
  useRecentConversations,
  useTotalConversations,
} from "../../../hooks/auth/dashboard/useDashboard";
import { LoadingModal } from "../../../components/Loading/ModalLoading";
import { getPlatformFromName, timeAgo } from "../../../Utils/formatDate";
import VietQR from "../../QRCode/QR";
export default function Dashboard() {
  const { totalConversations, loading } = useTotalConversations();
  const { recentConversations, loading: loadingRecent } =
    useRecentConversations();

  const PlatformStatus = () => {
    const { platforms, loading, error } = usePlatforms();

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
      <div className="platform-status">
        {platforms.map((p,index ) => (
          <div key={index} className="status-item">
            <span
              className={`status-dot ${
                p._doc.status === "connected" ? "online" : "offline"
              }`}
            ></span>
            <span className="status-name">{p._doc.name}</span>
            <span
              className={`status-badge ${
                p._doc.status === "connected" ? "connected" : "disconnected"
              }`}
            >
              {p._doc.status === "connected" ? "Connected" : "Disconnected"}
            </span>
          </div>
        ))}
        <LoadingModal show={loadingRecent} text="Đang loadinggg..." />
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your chatbox overview.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon conversation">💬</div>
          <div className="stat-content">
            <p className="stat-label">Total Conversations</p>
            <p className="stat-value">
              {totalConversations?.totalConversations}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">🌐</div>
          <div className="stat-content">
            <p className="stat-label">Active Platforms</p>
            <p className="stat-value">{totalConversations?.activePlatforms}</p>
          </div>
        </div>
        <div className="stat-card ">
          <div className="stat-icon message">📨</div>
          <div className="stat-content">
            <p className="stat-label">Message Today</p>
            <p className="stat-value">{totalConversations?.messagesToday}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon response">✅</div>
          <div className="stat-content ">
            <p className="stat-label">Response Rate</p>
            <p className="stat-value">
              {totalConversations?.totalConversations}
            </p>
          </div>
        </div>
      </div>
      <LoadingModal show={loading} text="Đang loadinggg..." />
      <div className="dashboard-grid">
        <div className="card_dashboard">
          <div className="card-header">
            <h2>Recent Conversations</h2>
            <a href="#" className="view-all">
              View All →
            </a>
          </div>
          <div className="conversations-list">
            {recentConversations?.map((reccent: any) => {
              const lastMsg =
                reccent.lastMessage?.content || "Chưa có tin nhắn";
              const platform = getPlatformFromName(reccent.name!);
              const lastTime = reccent.lastMessage?.createdAt
                ? timeAgo(reccent.lastMessage.createdAt)
                : "";
              return (
                <div key={reccent.id} className="conversation-item">
                  {/* <div className="conv-avatar">{reccent.user.charAt(0)}</div> */}
                  <div className="conv-content">
                    <div className="conv-header">
                      <p className="conv-user">{reccent.name}</p>
                      <span className="conv-platform">{platform}</span>
                    </div>
                    <p className="conv-message">
                      {reccent.lastMessage.content}
                    </p>
                  </div>
                  <p className="conv-time">{lastTime}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Platform Status</h2>
          </div>
          <PlatformStatus />
        </div>
      </div>
    </div>
  );
}
