import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {lazy, Suspense} from "react";

const App = lazy(()=> import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Suspense fallback={<div>Загрузка...</div>}>
          <App />
      </Suspense>
  </React.StrictMode>
);

reportWebVitals();
