import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Error parsing stored user:', e)
        localStorage.removeItem('auth_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    const user = users[email]
    
    if (user && user.password === password) {
      const userData = { email: user.email, name: user.name }
      setUser(userData)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const signup = (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    
    if (users[email]) {
      return { success: false, error: 'Email already registered' }
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    users[email] = {
      email,
      password, // In production, this should be hashed
      name,
      createdAt: new Date().toISOString()
    }

    localStorage.setItem('users', JSON.stringify(users))
    
    const userData = { email, name }
    setUser(userData)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    
    return { success: true }
  }

  const loginWithGoogle = (googleUserData) => {
    try {
      const { email, name, picture, sub } = googleUserData
      
      // Store Google user info
      const users = JSON.parse(localStorage.getItem('users') || '{}')
      
      // Check if user exists, if not create account
      if (!users[email]) {
        users[email] = {
          email,
          name,
          picture,
          googleId: sub,
          authProvider: 'google',
          createdAt: new Date().toISOString()
        }
        localStorage.setItem('users', JSON.stringify(users))
      } else {
        // Update existing user with Google info if needed
        users[email] = {
          ...users[email],
          picture: picture || users[email].picture,
          googleId: sub,
          authProvider: 'google'
        }
        localStorage.setItem('users', JSON.stringify(users))
      }
      
      // Set current user
      const userData = { 
        email, 
        name, 
        picture,
        authProvider: 'google'
      }
      setUser(userData)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      
      return { success: true }
    } catch (error) {
      console.error('Error with Google login:', error)
      return { success: false, error: 'Failed to authenticate with Google' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const updateProfile = (name, newPassword) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    const users = JSON.parse(localStorage.getItem('users') || '{}')
    const currentUser = users[user.email]

    if (!currentUser) {
      return { success: false, error: 'User not found' }
    }

    // Update name
    if (name) {
      currentUser.name = name
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' }
      }
      currentUser.password = newPassword
    }

    users[user.email] = currentUser
    localStorage.setItem('users', JSON.stringify(users))

    // Update current user state
    const updatedUser = { ...user }
    if (name) {
      updatedUser.name = name
    }
    setUser(updatedUser)
    localStorage.setItem('auth_user', JSON.stringify(updatedUser))

    return { success: true }
  }

  const value = {
    user,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

