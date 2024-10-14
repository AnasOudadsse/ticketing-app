import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("accessToken");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";

    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }

    return config;  
  },
  function (error) {
    return Promise.reject(error);
  }
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
