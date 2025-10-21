"use client"

import { useState } from "react"
import "./Settings.css"

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: "ChatBox Pro",
    email: "admin@chatboxpro.com",
    timezone: "UTC",
    language: "English",
    notifications: true,
    darkMode: false,
    autoReply: true,
    maxResponseTime: 5,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and application preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h2>General Settings</h2>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={settings.email} onChange={(e) => handleChange("email", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select value={settings.timezone} onChange={(e) => handleChange("timezone", e.target.value)}>
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="CST">CST</option>
              <option value="PST">PST</option>
              <option value="GMT">GMT</option>
            </select>
          </div>
          <div className="form-group">
            <label>Language</label>
            <select value={settings.language} onChange={(e) => handleChange("language", e.target.value)}>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Preferences</h2>
          <div className="toggle-group">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange("notifications", e.target.checked)}
              />
              <span>Enable Notifications</span>
            </label>
          </div>
          <div className="toggle-group">
            <label>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleChange("darkMode", e.target.checked)}
              />
              <span>Dark Mode</span>
            </label>
          </div>
          <div className="toggle-group">
            <label>
              <input
                type="checkbox"
                checked={settings.autoReply}
                onChange={(e) => handleChange("autoReply", e.target.checked)}
              />
              <span>Auto Reply</span>
            </label>
          </div>
          <div className="form-group">
            <label>Max Response Time (minutes)</label>
            <input
              type="number"
              value={settings.maxResponseTime}
              onChange={(e) => handleChange("maxResponseTime", Number.parseInt(e.target.value))}
              min="1"
              max="60"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Danger Zone</h2>
          <button className="btn-danger">Delete Account</button>
          <button className="btn-danger">Export Data</button>
        </div>

        <div className="settings-actions">
          <button className="btn-secondary">Reset</button>
          <button className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>

        {saved && <div className="success-message">✓ Settings saved successfully!</div>}
      </div>
    </div>
  )
}
