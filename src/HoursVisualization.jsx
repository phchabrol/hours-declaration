import React, { useState, useMemo } from 'react'
import './HoursVisualization.css'

const PERIOD_OPTIONS = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 3 Months', value: '3months' },
  { label: 'Custom Range', value: 'custom' }
]

function HoursVisualization({ hoursData, employees }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState(employees)

  const getDateRange = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (selectedPeriod) {
      case 'week': {
        const start = new Date(today)
        start.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
        return { start, end: new Date(today) }
      }
      case 'month': {
        const start = new Date(today.getFullYear(), today.getMonth(), 1)
        return { start, end: today }
      }
      case '30days': {
        const start = new Date(today)
        start.setDate(today.getDate() - 30)
        return { start, end: today }
      }
      case '3months': {
        const start = new Date(today)
        start.setMonth(today.getMonth() - 3)
        return { start, end: today }
      }
      case 'custom': {
        if (!startDate || !endDate) return null
        return {
          start: new Date(startDate),
          end: new Date(endDate)
        }
      }
      default:
        return null
    }
  }

  const getHoursForDateRange = useMemo(() => {
    const range = getDateRange()
    if (!range) return []

    const { start, end } = range
    const days = []
    const current = new Date(start)

    while (current <= end) {
      const dateKey = current.toISOString().split('T')[0]
      const dayData = {
        date: new Date(current),
        dateKey,
        hours: {}
      }

      selectedEmployees.forEach(employee => {
        const employeeData = hoursData[employee] || {}
        dayData.hours[employee] = employeeData[dateKey] || 0
      })

      days.push(dayData)
      current.setDate(current.getDate() + 1)
    }

    return days
  }, [selectedPeriod, startDate, endDate, hoursData, selectedEmployees])

  const getTotalHours = (employee) => {
    return getHoursForDateRange.reduce((sum, day) => sum + (day.hours[employee] || 0), 0)
  }

  const getMaxHours = () => {
    let max = 0
    getHoursForDateRange.forEach(day => {
      selectedEmployees.forEach(employee => {
        max = Math.max(max, day.hours[employee] || 0)
      })
    })
    return max || 1 // Avoid division by zero
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric' })
  }

  const range = getDateRange()
  const maxHours = getMaxHours()
  const colors = {
    'Meline': '#667eea',
    'Cel': '#f093fb'
  }

  return (
    <div className="visualization-container">
      <h2>Hours Visualization</h2>
      
      <div className="visualization-controls">
        <div className="period-selector">
          <label>Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            {PERIOD_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {selectedPeriod === 'custom' && (
          <div className="custom-date-range">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
        )}

        <div className="employee-filters">
          {employees.map(employee => (
            <label key={employee} className="employee-checkbox">
              <input
                type="checkbox"
                checked={selectedEmployees.includes(employee)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedEmployees([...selectedEmployees, employee])
                  } else {
                    setSelectedEmployees(selectedEmployees.filter(emp => emp !== employee))
                  }
                }}
              />
              <span style={{ color: colors[employee] || '#333' }}>{employee}</span>
            </label>
          ))}
        </div>
      </div>

      {range && (
        <>
          <div className="summary-stats">
            {selectedEmployees.map(employee => (
              <div key={employee} className="stat-card" style={{ borderColor: colors[employee] || '#333' }}>
                <div className="stat-label">{employee}</div>
                <div className="stat-value">{getTotalHours(employee).toFixed(1)}h</div>
                <div className="stat-period">
                  {formatDate(range.start)} - {formatDate(range.end)}
                </div>
              </div>
            ))}
          </div>

          <div className="chart-container">
            <div className="chart-title">Daily Hours Breakdown</div>
            <div className="chart">
              {getHoursForDateRange.map((day, index) => (
                <div key={day.dateKey} className="chart-day">
                  <div className="chart-bars">
                    {selectedEmployees.map(employee => {
                      const hours = day.hours[employee] || 0
                      const height = (hours / maxHours) * 100
                      return (
                        <div
                          key={employee}
                          className="chart-bar"
                          style={{
                            height: `${height}%`,
                            backgroundColor: colors[employee] || '#333',
                            width: `${100 / selectedEmployees.length}%`
                          }}
                          title={`${employee}: ${hours}h`}
                        >
                          {hours > 0 && (
                            <div className="bar-value">{hours}h</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="chart-date">
                    {formatDate(day.date)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="table-view">
            <div className="table-title">Detailed View</div>
            <table className="hours-table">
              <thead>
                <tr>
                  <th>Date</th>
                  {selectedEmployees.map(employee => (
                    <th key={employee} style={{ color: colors[employee] || '#333' }}>
                      {employee}
                    </th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {getHoursForDateRange.map(day => {
                  const dayTotal = selectedEmployees.reduce((sum, emp) => sum + (day.hours[emp] || 0), 0)
                  return (
                    <tr key={day.dateKey}>
                      <td>{day.date.toLocaleDateString('default', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</td>
                      {selectedEmployees.map(employee => (
                        <td key={employee}>
                          {day.hours[employee] > 0 ? `${day.hours[employee]}h` : '-'}
                        </td>
                      ))}
                      <td className="day-total">{dayTotal > 0 ? `${dayTotal.toFixed(1)}h` : '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  {selectedEmployees.map(employee => (
                    <td key={employee}><strong>{getTotalHours(employee).toFixed(1)}h</strong></td>
                  ))}
                  <td className="day-total">
                    <strong>
                      {selectedEmployees.reduce((sum, emp) => sum + getTotalHours(emp), 0).toFixed(1)}h
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {!range && selectedPeriod === 'custom' && (
        <div className="no-data-message">
          Please select a start and end date
        </div>
      )}
    </div>
  )
}

export default HoursVisualization

