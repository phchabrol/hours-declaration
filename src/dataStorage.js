// Data storage utility for saving and loading hours data
// Uses localStorage for browser storage and provides file export/import

const getStorageKey = (userEmail) => {
  return userEmail ? `hoursDeclarationData_${userEmail}` : 'hoursDeclarationData'
}

export const saveData = (data, userEmail = null) => {
  try {
    // Save to localStorage with user-specific key
    const storageKey = getStorageKey(userEmail)
    localStorage.setItem(storageKey, JSON.stringify(data))
    
    // Also save to file (for browser download)
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    // Create a download link (optional - can be triggered manually)
    // For now, we'll just use localStorage as the primary storage
    return true
  } catch (error) {
    console.error('Error saving data:', error)
    return false
  }
}

export const loadData = (userEmail = null) => {
  try {
    const storageKey = getStorageKey(userEmail)
    const data = localStorage.getItem(storageKey)
    if (data) {
      return JSON.parse(data)
    }
    return {}
  } catch (error) {
    console.error('Error loading data:', error)
    return {}
  }
}

export const exportData = (userEmail = null) => {
  try {
    const data = loadData(userEmail)
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hours-declaration-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting data:', error)
    alert('Error exporting data')
  }
}

export const importData = (file, userEmail = null) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        saveData(data, userEmail)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

