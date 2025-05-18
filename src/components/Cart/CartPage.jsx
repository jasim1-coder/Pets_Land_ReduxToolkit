import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQuantity, decreaseQuantity,clearAllCart } from "../../Redux/User/UserSlice";
import "./CartPage.css";

function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart); 
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, []);

  const handleDelete = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleclearAllCart = () => {
    dispatch(clearAllCart())
  };

  // const handleClearCart = () => {
  //   dispatch(clearCartAsync());  // Dispatch action to clear cart
  // };

  const totalprice = cart?.totalPrice

  const handlePlaceOrder = () => {
    navigate("/place-order",{state : {totalprice}});
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cart?.cartItemsperUser?.length === 0 ? (
        <p className="empty-cart">Your cart is empty!</p>
      ) : (
        <div className="cart-items-container">
          {cart?.cartItemsperUser?.map((product) => (
            <div key={product.productId} className="cart-item">
              <img src={product.image} alt={product.productName} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{product.productName}</h3>
                <p><strong>Price: ₹</strong>{product.price}</p>
                <p><strong>Quantity: </strong>{product.quantity || product.totalAmount / product.price}</p>
                <p><strong>Total: ₹</strong>{product.totalAmount}</p>
                <div className="cart-item-actions">
                  <button className="action-btn" onClick={() => handleIncreaseQuantity(product.productId)}>+</button>
                  <button className="action-btn" onClick={() => handleDecreaseQuantity(product.productId)}>-</button>
                  <button className="action-btn" onClick={() => handleDelete(product.productId)}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          <div className="totall"><p>Total Price: ₹{cart.totalPrice}</p></div>

          {/* Clear Cart Button (Only Show When Cart Has Items) */}
          {cart?.cartItemsperUser?.length > 0 && (
            <button className="clear-cart-btn"  onClick={handleclearAllCart}>Clear Cart</button>
          )}

          <button className="place-order-btn" onClick={handlePlaceOrder}>Proceed to payment</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
