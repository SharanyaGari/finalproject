import React, { useState } from 'react';
import PropTypes from 'prop-types';

const initialAuthState = {
  expiresAt: null,
  isAuthenticated: false,
  tokenAboutToExpire: false
};

const AuthContext = React.createContext(initialAuthState);


const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialAuthState)
  return <AuthContext.Provider value={{authState, setAuthState}}>{children}</AuthContext.Provider>;
}

const useAuthContext = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuthContext };