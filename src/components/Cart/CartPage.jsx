import React, { useContext, useState, useEffect } from 'react';
// import { CartContext } from "../../context/CartContext";
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import { useSelector,useDispatch } from 'react-redux';
import { removeFromCart,increaseQuantity,decreaseQuantity } from '../../Redux/User/UserSlice';

function CartPage() {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.cart)
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate(); 


  useEffect(() => {
    // Calculate the total price whenever the cart changes
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotalPrice(total.toFixed(2));
  }, [cart]);

  const handlePlaceOrder = () => {
    navigate('/place-order');
  };
  const handleDelete = (id) => {
    dispatch(removeFromCart(id))
  }
  const handleIncreaseQuantity = (id) => {
    dispatch(increaseQuantity(id))
  }
  const handleDecreaseQuantity = (id) => {
    dispatch(decreaseQuantity(id))
  }
  
  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart && cart.length === 0 ? (
  <p className='empty-cart'>Your cart is empty!</p>
) : (
  <div className="cart-items-container">
    {cart && cart.map((product) => (
      <div key={product.id} className="cart-item">
        <img src={product.image} alt={product.name} className="cart-item-image" />
        <div className="cart-item-details">
          <h3>{product.name}</h3>
          <p><strong>Price: ₹</strong>{product.price}</p>
          <p><strong>Quantity: </strong>{product.quantity}</p>
          <p><strong>Total: ₹</strong>{product.price * product.quantity}</p>
          <div className="cart-item-actions">
            <button className="action-btn" onClick={() => handleIncreaseQuantity(product)}>+</button>
            <button className="action-btn" onClick={() => handleDecreaseQuantity(product)}>-</button>
            <button className="action-btn" onClick={() => handleDelete(product)}>Remove</button>
          </div>
        </div>
      </div>
    ))}
    <div className="totall"><p>Total Price: ₹{totalPrice}</p></div>
    <button className="place-order-btn" onClick={handlePlaceOrder}>Buy Now</button>
  </div>
)}

    </div>
  );
}

export default CartPage;
