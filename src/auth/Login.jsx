import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import GoogleAuth from './GoogleAuth'
import './Auth.css'

function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()

  const handleGoogleSuccess = (googleUserData) => {
    setError('')
    const result = loginWithGoogle(googleUserData)
    if (!result.success) {
      setError(result.error)
    }
  }

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage || 'Google authentication failed')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(email, password)
    
    if (!result.success) {
      setError(result.error)
      setLoading(false)
    } else {
      // Login successful, user state will be updated by context
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtitle">Sign in to manage hours declarations</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <GoogleAuth 
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          buttonText="Sign in with Google"
        />

        <div className="auth-switch">
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToSignup} className="link-button">
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

