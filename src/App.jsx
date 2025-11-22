import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import { saveData, loadData, exportData, importData } from './dataStorage'

const EMPLOYEES = ['Meline', 'Cel']
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [hoursInput, setHoursInput] = useState('')
  const [hoursData, setHoursData] = useState({})
  const fileInputRef = useRef(null)

  // Load data on mount
  useEffect(() => {
    const data = loadData()
    if (data) {
      setHoursData(data)
    }
  }, [])

  // Save data whenever it changes
  useEffect(() => {
    if (Object.keys(hoursData).length > 0) {
      saveData(hoursData)
    }
  }, [hoursData])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const formatDateKey = (date) => {
    if (!date) return null
    return date.toISOString().split('T')[0]
  }

  const getHoursForDate = (date, employee) => {
    if (!date || !employee) return null
    const dateKey = formatDateKey(date)
    return hoursData[employee]?.[dateKey] || null
  }

  const handleDateClick = (date) => {
    if (!date || !selectedEmployee) return
    setSelectedDate(date)
    const hours = getHoursForDate(date, selectedEmployee)
    setHoursInput(hours !== null ? hours.toString() : '')
  }

  const handleSaveHours = () => {
    if (!selectedEmployee || !selectedDate || !hoursInput) return
    
    const hours = parseFloat(hoursInput)
    if (isNaN(hours) || hours < 0) {
      alert('Please enter a valid number of hours')
      return
    }

    const dateKey = formatDateKey(selectedDate)
    setHoursData(prev => {
      const newData = { ...prev }
      if (!newData[selectedEmployee]) {
        newData[selectedEmployee] = {}
      }
      newData[selectedEmployee] = {
        ...newData[selectedEmployee],
        [dateKey]: hours
      }
      return newData
    })

    setHoursInput('')
    setSelectedDate(null)
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
    setHoursInput('')
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
    setHoursInput('')
  }

  const getMonthlyTotal = () => {
    if (!selectedEmployee) return 0
    
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const employeeData = hoursData[selectedEmployee] || {}
    
    let total = 0
    Object.keys(employeeData).forEach(dateKey => {
      const date = new Date(dateKey)
      if (date.getFullYear() === year && date.getMonth() === month) {
        total += employeeData[dateKey]
      }
    })
    
    return total.toFixed(2)
  }

  const handleExport = () => {
    exportData()
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      importData(file)
        .then(data => {
          setHoursData(data)
          alert('Data imported successfully!')
        })
        .catch(error => {
          alert('Error importing data. Please make sure the file is valid JSON.')
          console.error(error)
        })
    }
    // Reset input
    event.target.value = ''
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const days = getDaysInMonth(currentDate)

  return (
    <div className="app">
      <div className="header">
        <h1>Hours Declaration</h1>
        <p>Track working hours for your employees</p>
      </div>

      <div className="employee-selector">
        {EMPLOYEES.map(employee => (
          <button
            key={employee}
            className={`employee-button ${selectedEmployee === employee ? 'active' : ''}`}
            onClick={() => {
              setSelectedEmployee(employee)
              setSelectedDate(null)
              setHoursInput('')
            }}
          >
            {employee}
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          className="save-button"
          onClick={handleExport}
          style={{ background: '#2196F3', marginRight: '10px' }}
        >
          Export Data
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".json"
          style={{ display: 'none' }}
        />
        <button
          className="save-button"
          onClick={() => fileInputRef.current?.click()}
          style={{ background: '#FF9800' }}
        >
          Import Data
        </button>
      </div>

      {selectedEmployee ? (
        <>
          <div className="month-selector">
            <button className="month-button" onClick={handlePreviousMonth}>
              ←
            </button>
            <div className="month-display">{monthName}</div>
            <button className="month-button" onClick={handleNextMonth}>
              →
            </button>
          </div>

          <div className="calendar">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="calendar-day other-month"></div>
              }

              const hours = getHoursForDate(date, selectedEmployee)
              const isSelected = selectedDate && formatDateKey(date) === formatDateKey(selectedDate)
              const isToday = formatDateKey(date) === formatDateKey(new Date())

              return (
                <div
                  key={formatDateKey(date)}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${hours !== null ? 'has-hours' : ''}`}
                  onClick={() => handleDateClick(date)}
                  style={isToday ? { borderColor: '#ff9800', borderWidth: '3px' } : {}}
                >
                  <div className="day-number">{date.getDate()}</div>
                  {hours !== null && (
                    <div className="hours-display">{hours}h</div>
                  )}
                </div>
              )
            })}
          </div>

          {selectedDate && (
            <div className="hours-input-section">
              <h3>
                Enter hours for {selectedDate.toLocaleDateString('default', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <div className="hours-input-group">
                <input
                  type="number"
                  className="hours-input"
                  placeholder="Hours"
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                  min="0"
                  step="0.5"
                />
                <button
                  className="save-button"
                  onClick={handleSaveHours}
                  disabled={!hoursInput}
                >
                  Save Hours
                </button>
                <button
                  className="save-button"
                  onClick={() => {
                    if (window.confirm('Delete hours for this date?')) {
                      const dateKey = formatDateKey(selectedDate)
                      setHoursData(prev => {
                        const newData = { ...prev }
                        if (newData[selectedEmployee] && newData[selectedEmployee][dateKey]) {
                          const { [dateKey]: removed, ...rest } = newData[selectedEmployee]
                          newData[selectedEmployee] = rest
                        }
                        return newData
                      })
                      setSelectedDate(null)
                      setHoursInput('')
                    }
                  }}
                  style={{ background: '#f44336' }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          <div className="monthly-summary">
            <h2>Monthly Summary for {selectedEmployee}</h2>
            <div className="total-hours">{getMonthlyTotal()}</div>
            <div className="summary-label">Total Hours in {monthName}</div>
          </div>
        </>
      ) : (
        <div className="no-employee-selected">
          Please select an employee to start declaring hours
        </div>
      )}
    </div>
  )
}

export default App

