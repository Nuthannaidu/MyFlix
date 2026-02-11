import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // <--- THIS LINE IS CRITICAL!
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position="top-right"/>
    </Provider>
  </React.StrictMode>,
);