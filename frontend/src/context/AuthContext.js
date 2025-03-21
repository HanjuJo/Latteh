import React from 'react';

const AuthContext = React.createContext({
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  updateUser: () => {},
  user: null,
  token: null
});

export default AuthContext; 