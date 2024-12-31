import React, { useEffect } from 'react';
import { IoCart, IoPersonCircle } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from "../../images/logo.jpg";
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, setLogin, setSearch, clearCart } from '../../Redux/User/UserSlice';

function Navbar() {
  const cart = useSelector((state) => state.cart.cart);
  const login = useSelector((state) => state.cart.login);

  const search = useSelector((state) => state.cart.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
useEffect(() => {
  const userId = localStorage.getItem("id");
  if (userId) {
    dispatch(setLogin(true));

    dispatch(fetchCart()); // Fetch cart if user is logged in
}},[dispatch])


    

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setLogin(false));
    dispatch(clearCart()); // Optional: You can add clearCart to reset cart state
    toast.success("Logged out successfully!");
    navigate('/login');
  };

  const userName = localStorage.getItem("name");
  const userId = localStorage.getItem("id")

  const Admin = userName === "admin" && userId === "36c8888";

  const handleSearchChange = (e) => {
    dispatch(setSearch(e.target.value)); // Using Redux to handle search state
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Pet Shop Logo" className="logo" />
        {!Admin ? (
          <Link to="/" className="navbar-brand">Pet's Land.</Link>
        ) : (
          <h4><strong>Pet's Land.</strong></h4>
        )}
      </div>
      <div className="navbar-center">
        {!Admin && (
          <form className="search-form">
            <input
              style={{ paddingLeft: "20px" }}
              type="search"
              placeholder="Search for pet products..."
              value={search}
              onChange={handleSearchChange} // Updated to handle search via Redux
            />
            <div style={{ justifyContent: "center", display: "flex" }}>
              <button style={{ paddingRight: "30px" }} type="submit">Search</button>
            </div>
          </form>
        )}
      </div>
      <div className="navbar-right">
        {login ? (
          <>
            <div className="username">
              <IoPersonCircle size={27} color="black" />
              <span className="user-name">{userName}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        )}
        {!Admin && (
          <>
            <Link to="/Order_Success" className="order-link">Orders</Link>
            <Link to="/cart" className="nav-icon">
  {cart && cart.length > 0 && (
    <div className="cart-length">
      <span>{cart.length}</span>
    </div>
  )}
  <IoCart size={25} color="black" />
</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
