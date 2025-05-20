import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';
import appConfig from './config/appConfig';
import logo from './assets/logo.png'; // Assuming you have a logo image

function Layout({ children }) {
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    // Format the current date when the component mounts
    const today = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Pool Party Logo" />
            <h1>{appConfig.appName}</h1>
          </Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/build">Build</Link></li>
            <li><Link to="/daily">Pool of the Day</Link></li>
            <li><Link to="/search">Search Cards</Link></li>
            <li><Link to="/set/TDM">TDM Cards</Link></li>
          </ul>
        </nav>
      </header>
      
      <main className="app-main">
        {children}
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/about">About</Link>
          </div>
          <div className="footer-date">
            {currentDate}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;