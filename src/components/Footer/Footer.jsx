import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer bg-body-tertiary">
      <div className="container1">
        <div className="footer-section">
          <h5>About Pet's Land</h5>
          <p>Your one-stop shop for all your pet needs! Whether it’s for your feline friends or canine companions, we’ve got you covered.</p>
        </div>
        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/">Shop</a></li>
            <li><a href="/">About Us</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h5>Contact Us</h5>
          <p>Email: support@petsland.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Location: 123 Pet Street, Petland</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Pet's Land. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
