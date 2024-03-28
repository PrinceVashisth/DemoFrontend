import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const AuthRoute = ({ element, ...rest }) => {
  const isAuthenticated = true; // Replace this with your authentication logic

  return isAuthenticated ? <Route {...rest} element={element} /> : <Navigate to="/" />;
};

export default AuthRoute;
