import React, { useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa"; 
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, toggleWishlist } from "../../Redux/Wishlist/WishListSlice";
import "./Products_list.css";

const ProductList = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist || []); 
  const search = useSelector((state) => state.cart.search);
  const userId = localStorage.getItem("userId"); // Directly get user ID from localStorage

  useEffect(() => {
    dispatch(fetchWishlist()); // Fetch wishlist on component mount
  }, [dispatch]);

  // Function to toggle wishlist
  const handleWishlistToggle = (productId) => {
    console.log("Toggling wishlist for product ID:", productId);
    dispatch(toggleWishlist(productId));
  };
  

  // // Filter products based on search input
  // const filteredProducts = selectedCategory.filter((product) =>
  //   search ? product.name.toLowerCase().includes(search.toLowerCase()) : true
  // );
  if (!selectedCategory || selectedCategory.length === 0) {
    return <p>No products found in this category.</p>;
  }
  return (
    <div className="product-list">
      {selectedCategory.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        selectedCategory.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/products/${product.id}`}>
              <img className="imagess" src={product.imageUrl || product.image} alt={product.name} />
            </Link>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>
  <strong> Price: </strong>
  <span style={{ color: "green", fontWeight: "bold" }}>₹{product.rp}</span>
</p>
<p>
  <strong> MRP: </strong>
  <span style={{ color: "red", fontWeight: "bold", textDecoration: "line-through" }}>
    ₹{product.mrp}
  </span>
</p>
<p>
  <strong> Category: </strong>
  <span style={{ color: "blue", fontWeight: "bold" }}>{product.category}</span>
</p>
<p>
  <strong> Seller: </strong>
  <span style={{ color: "purple", fontWeight: "bold" }}>{product.seller}</span>
</p>

            {/* Wishlist Button */}
            <button
              className={`wishlist-button ${wishlist.some(item => item.id === product.id) ? "added" : ""}`}
              onClick={() => handleWishlistToggle(product.id)}
            >
              {wishlist.some(item => item.id === product.id) ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
