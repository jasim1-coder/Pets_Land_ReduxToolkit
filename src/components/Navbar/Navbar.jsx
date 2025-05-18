// // import React, { useEffect } from 'react';
// // import { IoCart, IoPersonCircle } from 'react-icons/io5';
// // import { FaHeart } from "react-icons/fa"; 

// // import { Link, useNavigate } from 'react-router-dom';
// // import './Navbar.css';
// // import logo from "../../images/logo.jpg";
// // import toast from 'react-hot-toast';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { fetchCart, setLogin, setSearch, clearCart } from '../../Redux/User/UserSlice';
// // import { clearWishlist, fetchWishlist } from '../../Redux/Wishlist/WishListSlice';

// // function Navbar() {
// //   const cart = useSelector((state) => state.cart.cart || []);
// //   const login = useSelector((state) => state.cart.login);
// //   const wishlist = useSelector((state) => state.wishlist.wishlist || [])

// //   const search = useSelector((state) => state.cart.search);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const userName = localStorage.getItem("Name");
// //   const userId = localStorage.getItem("Id")
// //   useEffect(() => {
// //     // const userId = localStorage.getItem("Id");
// //     if (userId) {
// //       dispatch(setLogin(true));
// //       dispatch(fetchCart()); // Fetch cart if user is logged in
// //       dispatch(fetchWishlist())
// //     }
// //   }, [dispatch,userId]); // Added userId to prevent redundant fetches
// //   const handleLogout = () => {
// //     localStorage.clear();
// //     dispatch(setLogin(false));
// //     dispatch(clearCart()); // Optional: You can add clearCart to reset cart state
// //     dispatch(clearWishlist())
// //     toast.success("Logged out successfully!");
// //     navigate('/login');
// //   };



// //   const Admin = userName === "admin" && userId === "36c8888";

// //   const handleSearchChange = (e) => {
// //     dispatch(setSearch(e.target.value)); // Using Redux to handle search state
// //   };

// //   return (
// //     <nav className="navbar">
// //       <div className="navbar-logo">
// //         <img src={logo} alt="Pet Shop Logo" className="logo" />
// //         {!Admin ? (
// //           <Link to="/" className="navbar-brand">Pet's Land.</Link>
// //         ) : (
// //           <h4><strong>Pet's Land.</strong></h4>
// //         )}
// //       </div>
// //       <div className="navbar-center">
// //         {!Admin && (
// //           <form className="search-form">
// //             <input
// //               style={{ paddingLeft: "20px" }}
// //               type="search"
// //               placeholder="Search for pet products..."
// //               value={search}
// //               onChange={handleSearchChange} // Updated to handle search via Redux
// //             />
// //             <div style={{ justifyContent: "center", display: "flex" }}>
// //               <button style={{ paddingRight: "30px" }} type="submit">Search</button>
// //             </div>
// //           </form>
// //         )}
// //       </div>
// //       <div className="navbar-right">
// //         {login ? (
// //           <>
// //             <div className="username">
// //               <IoPersonCircle size={27} color="black" />
// //               <span className="user-name">{userName}</span>
// //             </div>
// //             <button className="logout-button" onClick={handleLogout}>Logout</button>
// //           </>
// //         ) : (
// //           <Link to="/login">
// //             <button className="login-button">Login</button>
// //           </Link>
// //         )}
// //         {!Admin && (
// //           <>
// //             <Link to="/Order_Success" className="order-link">Orders</Link>
// //             <Link to="/cart" className="nav-icon">
// // {cart?.totalItem > 0 && (
// //   <div className="cart-length">
// //     <span>{cart.totalItem}</span>
// //   </div>
// // )}
// //   <IoCart size={25} color="black" />
// // </Link>
// // <Link to="/Wishlists" className="nav-icon">  
// // {wishlist?.length > 0 && (
// //   <div className="cart-length">
// //     <span>{wishlist?.length}</span>
// //   </div>
// // )}
// // <FaHeart size={24} color="black" />
// // </Link>
// //           </>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // }

// // export default Navbar;
// import React, { useEffect, useState } from 'react';
// import { IoCart, IoPersonCircle } from 'react-icons/io5';
// import { FaHeart } from "react-icons/fa"; 
// import { Link, useNavigate } from 'react-router-dom';
// import './Navbar.css';
// import logo from "../../images/logo.jpg";
// import toast from 'react-hot-toast';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchCart, setLogin, clearCart } from '../../Redux/User/UserSlice';
// import { clearWishlist, fetchWishlist } from '../../Redux/Wishlist/WishListSlice';
// import { fetchProductsByQuery } from '../../Redux/Admin/AdminSlice';

// function Navbar() {
//   const cart = useSelector((state) => state.cart.cart || []);
//   const login = useSelector((state) => state.cart.login);
//   const wishlist = useSelector((state) => state.wishlist.wishlist || []);
//   const searchResult = useSelector((state) => state.admin.searchResult)
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState(""); // Local state for search

//   const userName = localStorage.getItem("Name");
//   const userId = localStorage.getItem("Id");

//   useEffect(() => {
//     if (userId) {
//       dispatch(setLogin(true));
//       dispatch(fetchCart());
//       dispatch(fetchWishlist());
//     }
//   }, [dispatch, userId]);

//   const handleLogout = () => {
//     localStorage.clear();
//     dispatch(setLogin(false));
//     dispatch(clearCart());
//     dispatch(clearWishlist());
//     toast.success("Logged out successfully!");
//     navigate('/login');
//   };

//   const Admin = userName === "admin" && userId === "36c8888";

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value); // Update local state
//   };

//   const handleSearchClick = (e) => {
//     e.preventDefault(); // Prevent form submission refresh
//     if (searchTerm.trim()) {
//       dispatch(fetchProductsByQuery(searchTerm)); // Dispatch search query
//     }
//   };
//   console.log(searchResult)

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">
//         <img src={logo} alt="Pet Shop Logo" className="logo" />
//         {!Admin ? (
//           <Link to="/" className="navbar-brand">Pet's Land.</Link>
//         ) : (
//           <h4><strong>Pet's Land.</strong></h4>
//         )}
//       </div>
//       <div className="navbar-center">
//         {!Admin && (
//           <form className="search-form" onSubmit={handleSearchClick}>
//             <input
//               style={{ paddingLeft: "20px" }}
//               type="search"
//               placeholder="Search for pet products..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//             <div style={{ justifyContent: "center", display: "flex" }}>
//               <button 
//                 style={{ paddingRight: "30px" }} 
//                 type="submit"
//               >
//                 Search
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//       <div className="navbar-right">
//         {login ? (
//           <>
//             <div className="username">
//               <IoPersonCircle size={27} color="black" />
//               <span className="user-name">{userName}</span>
//             </div>
//             <button className="logout-button" onClick={handleLogout}>Logout</button>
//           </>
//         ) : (
//           <Link to="/login">
//             <button className="login-button">Login</button>
//           </Link>
//         )}
//         {!Admin && (
//           <>
//             <Link to="/Order_Success" className="order-link">Orders</Link>
//             <Link to="/cart" className="nav-icon">
//               {cart?.totalItem > 0 && (
//                 <div className="cart-length">
//                   <span>{cart.totalItem}</span>
//                 </div>
//               )}
//               <IoCart size={25} color="black" />
//             </Link>
//             <Link to="/Wishlists" className="nav-icon">  
//               {wishlist?.length > 0 && (
//                 <div className="cart-length">
//                   <span>{wishlist?.length}</span>
//                 </div>
//               )}
//               <FaHeart size={24} color="black" />
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
import React, { useEffect, useState } from 'react';
import { IoCart, IoPersonCircle } from 'react-icons/io5';
import { FaHeart } from "react-icons/fa"; 
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from "../../images/logo.jpg";
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, setLogin, clearCart } from '../../Redux/User/UserSlice';
import { clearWishlist, fetchWishlist } from '../../Redux/Wishlist/WishListSlice';
import { fetchProductsByQuery, clearSearchResults } from '../../Redux/Admin/AdminSlice';

function Navbar() {
  const cart = useSelector((state) => state.cart.cart || []);
  const login = useSelector((state) => state.cart.login);
  const wishlist = useSelector((state) => state.wishlist.wishlist || []);
  const searchResult = useSelector((state) => state.admin.searchResult);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); 

  const userName = localStorage.getItem("Name");
  const userId = localStorage.getItem("Id");

  useEffect(() => {
    if (userId) {
      dispatch(setLogin(true));
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setLogin(false));
    dispatch(clearCart());
    dispatch(clearWishlist());
    toast.success("Logged out successfully!");
    navigate('/login');
  };

  const Admin = userName === "admin" && userId === "36c8888";

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(fetchProductsByQuery(searchTerm));
    }
  };

  const handleClearSearch = () => {
    setSearchTerm(""); // Reset input field
    dispatch(clearSearchResults()); // Clear search results in Redux
  };
  console.log(searchResult)

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
          <form className="search-form" onSubmit={handleSearchClick}>
            <input
              style={{ paddingLeft: "20px" }}
              type="search"
              placeholder="Search for pet products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button 
                type="button" 
                className="clear-search-btn" 
                onClick={handleClearSearch}
              >
                ✖
              </button>
            )}
            <button 
              style={{ paddingRight: "30px" }} 
              type="submit"
            >
              Search
            </button>
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
              {cart?.totalItem > 0 && (
                <div className="cart-length">
                  <span>{cart.totalItem}</span>
                </div>
              )}
              <IoCart size={25} color="black" />
            </Link>
            <Link to="/Wishlists" className="nav-icon">  
              {wishlist?.length > 0 && (
                <div className="cart-length">
                  <span>{wishlist?.length}</span>
                </div>
              )}
              <FaHeart size={24} color="black" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
