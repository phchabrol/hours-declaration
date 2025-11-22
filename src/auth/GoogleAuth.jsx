import React, { useEffect, useRef } from 'react'
import './Auth.css'

function GoogleAuth({ onSuccess, onError, buttonText = 'Sign in with Google' }) {
  const buttonRef = useRef(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // Wait for Google Identity Services to load
    const initializeGoogleAuth = () => {
      if (window.google && window.google.accounts && !isInitialized.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        })

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(
            buttonRef.current,
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left'
            }
          )
        }

        isInitialized.current = true
      } else if (!window.google) {
        // Retry after a short delay if Google script hasn't loaded yet
        setTimeout(initializeGoogleAuth, 100)
      }
    }

    const handleCredentialResponse = (response) => {
      if (response.credential) {
        // Decode the JWT token to get user info
        try {
          const base64Url = response.credential.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
          const userData = JSON.parse(jsonPayload)
          
          // Call success callback with user data
          onSuccess({
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            sub: userData.sub, // Google user ID
            emailVerified: userData.email_verified
          })
        } catch (error) {
          console.error('Error decoding Google credential:', error)
          if (onError) {
            onError('Failed to process Google authentication')
          }
        }
      }
    }

    // Initialize when component mounts
    initializeGoogleAuth()

    // Also try on window load
    window.addEventListener('load', initializeGoogleAuth)

    return () => {
      window.removeEventListener('load', initializeGoogleAuth)
    }
  }, [onSuccess, onError])

  return (
    <div className="google-auth-container">
      <div ref={buttonRef} id="google-signin-button"></div>
      {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <div className="google-auth-warning">
          <small>
            Google Client ID not configured. Set VITE_GOOGLE_CLIENT_ID in your .env file.
          </small>
        </div>
      )}
    </div>
  )
}

export default GoogleAuth

