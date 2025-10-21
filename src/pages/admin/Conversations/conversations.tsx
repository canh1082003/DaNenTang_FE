"use client"

import { useState } from "react"
import "./conversations.css"

export default function Conversations() {
  const [conversations, setConversations] = useState([
    { id: 1, user: "Alice Johnson", platform: "Facebook", status: "active", messages: 45, lastMessage: "2 min ago" },
    { id: 2, user: "Bob Smith", platform: "WhatsApp", status: "active", messages: 23, lastMessage: "15 min ago" },
    { id: 3, user: "Carol White", platform: "Instagram", status: "inactive", messages: 12, lastMessage: "1 hour ago" },
    { id: 4, user: "David Brown", platform: "Telegram", status: "active", messages: 67, lastMessage: "2 hours ago" },
    { id: 5, user: "Eve Davis", platform: "Facebook", status: "inactive", messages: 8, lastMessage: "1 day ago" },
  ])

  const [showModal, setShowModal] = useState(false)
  const [newConv, setNewConv] = useState({ user: "", platform: "" })

  const handleAddConversation = () => {
    if (newConv.user && newConv.platform) {
      setConversations([
        ...conversations,
        {
          id: conversations.length + 1,
          user: newConv.user,
          platform: newConv.platform,
          status: "active",
          messages: 0,
          lastMessage: "just now",
        },
      ])
      setNewConv({ user: "", platform: "" })
      setShowModal(false)
    }
  }

  const handleDeleteConversation = (id: number) => {
    setConversations(conversations.filter((conv) => conv.id !== id))
  }

  return (
    <div className="conversations-page">
      <div className="page-header">
        <h1>Conversations</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Conversation
        </button>
      </div>

      <div className="table-container">
        <table className="conversations-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Messages</th>
              <th>Last Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conv) => (
              <tr key={conv.id}>
                <td className="user-cell">
                  <div className="user-avatar">{conv.user.charAt(0)}</div>
                  <span>{conv.user}</span>
                </td>
                <td>{conv.platform}</td>
                <td>
                  <span className={`status-badge ${conv.status}`}>{conv.status}</span>
                </td>
                <td>{conv.messages}</td>
                <td>{conv.lastMessage}</td>
                <td className="actions-cell">
                  <button className="btn-icon" title="View">
                    👁️
                  </button>
                  <button className="btn-icon" title="Edit">
                    ✏️
                  </button>
                  <button className="btn-icon delete" title="Delete" onClick={() => handleDeleteConversation(conv.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Conversation</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>User Name</label>
                <input
                  type="text"
                  placeholder="Enter user name"
                  value={newConv.user}
                  onChange={(e) => setNewConv({ ...newConv, user: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Platform</label>
                <select value={newConv.platform} onChange={(e) => setNewConv({ ...newConv, platform: e.target.value })}>
                  <option value="">Select platform</option>
                  <option value="Facebook">Facebook</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Twitter">Twitter</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddConversation}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
