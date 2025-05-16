import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import BuildPage from './pages/BuildPage';
// import DailyPage from './pages/DailyPage';
import AboutPage from './pages/AboutPage';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/build" element={<BuildPage />} />
        <Route path="/build/:id" element={<BuildPage />} />
        {/* <Route path="/daily" element={<DailyPage />} /> */}
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();