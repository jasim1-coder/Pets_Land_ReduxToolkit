import React, { useEffect } from "react";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import "./Wishlist.css";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../Redux/User/UserSlice";
import { fetchWishlist,toggleWishlist } from "../../Redux/Wishlist/WishListSlice";

const Wishlist = () => {
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.wishlist );

  useEffect(() => {
    dispatch(fetchWishlist())
}, [dispatch]);

  const handleAddToCart = (product) => {
    if (!product || !product.productId) {
      console.error("Product not loaded properly", product);
      return;
    }
    console.log("Adding product to cart:", product.productId);
    dispatch(addToCart(product.productId));  // Fixed `product.Id` to `product.id`
  };

  const handleToggleWishlist = (product) => {
    dispatch(toggleWishlist(product.productId));
  };

  
  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="empty-wishlist">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-items">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <div className="wishlist-actions">
                <button className="cart-btn" onClick={() => handleAddToCart(product)}>
                  <FaShoppingCart /> Add to Cart
                </button>
                <button className="remove-btn" onClick={() => handleToggleWishlist(product)}>
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
