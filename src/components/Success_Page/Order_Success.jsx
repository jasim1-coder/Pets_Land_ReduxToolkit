import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Order_Sucess.css';
import axios from 'axios';
import toast from 'react-hot-toast';

function OrderSuccessPage() {
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
        const userId = localStorage.getItem("id");
        if(!userId) return
        if (userId) {
          const response = await axios(`http://localhost:3000/users/${userId}`);
          const data = response.data
          setOrderDetails(data.order); // Store the orders array in state
        } else {
          toast.error('No user ID found.');
        }
    };
    fetchOrderDetails();
  }, []);

  return (
    <div className="order-success-page">
      <div className="order-summary">
        {orderDetails.length === 0 ? (
          <p>No items ordered.</p>
        ) : (
          <>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            {[...orderDetails].reverse().map((order, orderIndex) => (
              <div key={orderIndex} className="order-details">
                <h3>Order Summary</h3>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Date:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
                <p><strong>Total:</strong>  ₹{order.totalPrice.toFixed(2)}</p>
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image"/>
                      <div className="item-details">
                        <p><strong>{item.name}</strong></p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price}</p>
                        <p>Total: ₹{item.total.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>

      <Link to="/" className="continue-shopping-button">
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderSuccessPage;
