import {Link} from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar customer-navbar">
      <div className="brand">Customer Dashboard</div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`link-container ${menuOpen ? 'open' : ''}`}>
        <Link to="/customer/dashboard" className={`link ${location.pathname === "/customer/dashboard" ? 'active' : ''}`}>
        Dashboard
        </Link>
        <Link to="/customer/book-shipment" className={`link ${location.pathname === "/customer/book-shipment" ? 'active' : ''}`}>
        Book
        </Link>
        <Link to="/customer/profile" className={`link ${location.pathname === "/customer/profile" ? 'active' : ''}`}>
        Profile
        </Link>
        <Link to="/customer/tracking" className={`link ${location.pathname === "/customer/tracking" ? 'active' : ''}`}>
        Track
        </Link>
      </div>
    </nav>
  );
}


export default Navbar