import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import './Auth.css'

function AccountManagement() {
  const { user, updateProfile, logout } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Name cannot be empty')
      return
    }

    setLoading(true)
    const result = updateProfile(name, null)
    setLoading(false)

    if (result.success) {
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(result.error)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword) {
      setError('Please enter your current password')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Verify current password
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    const currentUser = users[user.email]
    
    if (currentUser.password !== currentPassword) {
      setError('Current password is incorrect')
      return
    }

    setLoading(true)
    const result = updateProfile(null, newPassword)
    setLoading(false)

    if (result.success) {
      setSuccess('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(result.error)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <div className="account-container">
      <div className="account-card">
        <h2>Account Management</h2>
        
        <div className="account-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('profile')
              setError('')
              setSuccess('')
            }}
          >
            Profile
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('password')
              setError('')
              setSuccess('')
            }}
          >
            Change Password
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="auth-form">
            <div className="form-group">
              <label htmlFor="account-email">Email</label>
              <input
                type="email"
                id="account-email"
                value={user?.email || ''}
                disabled
                className="disabled-input"
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="account-name">Full Name</label>
              <input
                type="text"
                id="account-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordUpdate} className="auth-form">
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength="6"
                disabled={loading}
              />
              <small>Minimum 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-new-password">Confirm New Password</label>
              <input
                type="password"
                id="confirm-new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength="6"
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="account-actions">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountManagement

