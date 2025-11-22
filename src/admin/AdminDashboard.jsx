import React, { useState, useMemo, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { loadData } from '../dataStorage'
import './AdminDashboard.css'

function AdminDashboard() {
  const { user } = useAuth()
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewMode, setViewMode] = useState('users') // 'users' or 'activity'
  const [error, setError] = useState(null)

  // Get all users from localStorage
  const getAllUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '{}')
      return Object.values(users).map(u => ({
        email: u.email,
        name: u.name,
        createdAt: u.createdAt
      }))
    } catch (error) {
      console.error('Error loading users:', error)
      return []
    }
  }

  // Get hours data for a specific user
  const getUserHoursData = (userEmail) => {
    try {
      if (!userEmail) return {}
      return loadData(userEmail) || {}
    } catch (error) {
      console.error('Error loading user hours:', error)
      return {}
    }
  }

  // Get last activity date from hours data
  const getLastActivityDate = (hoursData) => {
    if (!hoursData || Object.keys(hoursData).length === 0) return null
    let latestDate = null
    Object.keys(hoursData).forEach(employee => {
      Object.keys(hoursData[employee] || {}).forEach(dateStr => {
        try {
          const date = new Date(dateStr)
          if (date && !isNaN(date.getTime())) {
            if (!latestDate || date > latestDate) {
              latestDate = date
            }
          }
        } catch (e) {
          // Skip invalid dates
        }
      })
    })
    return latestDate
  }

  // Get all users with their activity summary
  const usersWithActivity = useMemo(() => {
    const users = getAllUsers()
    return users.map(userData => {
      const hoursData = getUserHoursData(userData.email)
      const employees = Object.keys(hoursData)
      
      // Calculate totals
      let totalDays = 0
      let totalHours = 0
      const employeeTotals = {}
      
      employees.forEach(employee => {
        const dates = Object.keys(hoursData[employee] || {})
        totalDays += dates.length
        const employeeHours = dates.reduce((sum, date) => sum + (hoursData[employee][date] || 0), 0)
        totalHours += employeeHours
        employeeTotals[employee] = employeeHours
      })

      return {
        ...userData,
        totalDays,
        totalHours: totalHours.toFixed(1),
        employeeTotals,
        lastActivity: getLastActivityDate(hoursData)
      }
    })
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const formatDateTime = (date) => {
    if (!date) return 'Never'
    return date.toLocaleDateString('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserDetailedActivity = (userEmail) => {
    const hoursData = getUserHoursData(userEmail)
    const activities = []

    Object.keys(hoursData).forEach(employee => {
      Object.keys(hoursData[employee] || {}).forEach(dateStr => {
        activities.push({
          date: dateStr,
          employee,
          hours: hoursData[employee][dateStr],
          dateObj: new Date(dateStr)
        })
      })
    })

    // Sort by date, newest first
    activities.sort((a, b) => b.dateObj - a.dateObj)

    return activities
  }

  const selectedUserActivities = selectedUser ? getUserDetailedActivity(selectedUser.email) : []

  // Debug: Log users
  useEffect(() => {
    const users = getAllUsers()
    console.log('Admin Dashboard - Users found:', users)
    console.log('Admin Dashboard - Users with activity:', usersWithActivity)
  }, [usersWithActivity])

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <div className="auth-error" style={{ marginTop: '20px' }}>
            Error: {error}
          </div>
        </div>
      </div>
    )
  }

  const allUsers = getAllUsers()

  return (
    <div className="admin-container" style={{ minHeight: '400px' }}>
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>Manage and monitor all user accounts and their hours declarations</p>
        <div className="admin-user-info">
          Logged in as: <strong>{user?.name || 'Unknown'}</strong> ({user?.email || 'No email'})
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
          Total users in system: {allUsers.length}
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${viewMode === 'users' ? 'active' : ''}`}
          onClick={() => {
            setViewMode('users')
            setSelectedUser(null)
          }}
        >
          👥 All Users
        </button>
        <button
          className={`admin-tab ${viewMode === 'activity' ? 'active' : ''}`}
          onClick={() => setViewMode('activity')}
        >
          📊 Activity Overview
        </button>
      </div>

      {viewMode === 'users' && (
        <div className="users-list">
          <div className="users-header">
            <h3>Registered Users ({usersWithActivity.length})</h3>
          </div>

          <div className="users-grid">
            {usersWithActivity.map((userData, index) => (
              <div
                key={userData.email}
                className={`user-card ${selectedUser?.email === userData.email ? 'selected' : ''}`}
                onClick={() => setSelectedUser(userData)}
              >
                <div className="user-card-header">
                  <div className="user-avatar">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{userData.name}</div>
                    <div className="user-email">{userData.email}</div>
                  </div>
                </div>

                <div className="user-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Hours:</span>
                    <span className="stat-value">{userData.totalHours}h</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Days Active:</span>
                    <span className="stat-value">{userData.totalDays}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Last Activity:</span>
                    <span className="stat-value">{formatDateTime(userData.lastActivity)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Joined:</span>
                    <span className="stat-value">{formatDate(userData.createdAt)}</span>
                  </div>
                </div>

                {Object.keys(userData.employeeTotals).length > 0 && (
                  <div className="employee-breakdown">
                    <div className="breakdown-title">By Employee:</div>
                    {Object.entries(userData.employeeTotals).map(([emp, hours]) => (
                      <div key={emp} className="breakdown-item">
                        <span className="employee-name">{emp}:</span>
                        <span className="employee-hours">{hours.toFixed(1)}h</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="view-details-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedUser(userData)
                    setViewMode('activity')
                  }}
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>

          {usersWithActivity.length === 0 && (
            <div className="no-users">
              <p>No users registered yet.</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'activity' && (
        <div className="activity-view">
          {selectedUser ? (
            <>
              <div className="activity-header">
                <button
                  className="back-button"
                  onClick={() => {
                    setSelectedUser(null)
                    setViewMode('users')
                  }}
                >
                  ← Back to Users
                </button>
                <h3>
                  Activity Details: {selectedUser.name}
                </h3>
                <p className="activity-subtitle">{selectedUser.email}</p>
              </div>

              <div className="activity-summary">
                <div className="summary-card">
                  <div className="summary-label">Total Activities</div>
                  <div className="summary-value">{selectedUserActivities.length}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Total Hours</div>
                  <div className="summary-value">
                    {selectedUserActivities.reduce((sum, a) => sum + a.hours, 0).toFixed(1)}h
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Unique Dates</div>
                  <div className="summary-value">
                    {new Set(selectedUserActivities.map(a => a.date)).size}
                  </div>
                </div>
              </div>

              <div className="activity-table-container">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Employee</th>
                      <th>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUserActivities.length > 0 ? (
                      selectedUserActivities.map((activity, index) => (
                        <tr key={`${activity.date}-${activity.employee}-${index}`}>
                          <td>{formatDate(activity.date)}</td>
                          <td>
                            <span className="employee-badge">{activity.employee}</span>
                          </td>
                          <td className="hours-cell">{activity.hours}h</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="no-activity">
                          No hours declared yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="select-user-prompt">
              <p>Select a user from the "All Users" tab to view their detailed activity</p>
              <button
                className="back-button"
                onClick={() => setViewMode('users')}
              >
                ← View All Users
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

