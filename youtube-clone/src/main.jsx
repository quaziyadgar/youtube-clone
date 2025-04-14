import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import App from './App.jsx';
import './index.css';
import { jwtDecode } from 'jwt-decode';

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
        localStorage.removeItem('token');
        console.log({ error })
      }
    }
  }, [dispatch]);

  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthInitializer>
      <App />
    </AuthInitializer>
  </Provider>
);