import React from 'react';
import { Link } from 'react-router-dom';
import "./Style.css"

const Sidebar = () => {
  return (
    <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
      <div className="position-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <h4 className="text-center">Pet's Land Admin Dashboard</h4>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/products">Products</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/users">Users</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/orders">Orders</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
