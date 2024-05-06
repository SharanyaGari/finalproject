
import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../AuthContext/AuthContext';

function LoginPopup() {

  const token = localStorage.getItem('jwt')
  const refreshToken = localStorage.getItem('refresh_token')
  const { setAuthState } = useAuthContext()

  function login() {
    axios.post(
      'http://localhost:3001/refresh-token',
      { refreshToken }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(res => {
        if(res && res.data && res.data.token) {
          const token = res.data.token;
          console.log("got token after refresh: ", token)
          localStorage.setItem('jwt', token);
          setAuthState({expiresAt: Date.now() + 20 * 1000, isAuthenticated: true, tokenAboutToExpire: false})
        }
      })
  }

  return (
    <div className="modal" id="modal">
      <h2>Modal Window</h2>
      <div className="content">Popup</div>
      <div className="actions">
        <button className="toggle-button" onClick={login}>
          login
        </button>
      </div>
    </div>
  )
}

export default LoginPopup;
