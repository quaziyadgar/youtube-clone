import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom"
import { jwtDecode } from 'jwt-decode';
import './index.css';
import './fontAwesome.js';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch({
          type: 'auth/login/fulfilled',
          payload: {
            token,
            user: { username: decoded.username, email: decoded.email },
          },
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, [dispatch]);

  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthInitializer>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthInitializer>
  </Provider>
);