import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // ✅ Correct import
import { Link } from 'react-router-dom';
import "./Order_Sucess.css";
import toast from 'react-hot-toast';
import { fetchOrders } from '../../Redux/Order/OrderSlice';

function OrderSuccessPage() {
  const dispatch = useDispatch(); // ✅ Add useDispatch

  const userOrder = useSelector((state) => state.order.userOrder); // ✅ Corrected selector
  console.log(userOrder);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="order-success-page">
      <div className="order-summary">
        {userOrder?.length === 0 ? (
          <p>No items ordered.</p>
        ) : (
          <>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            {[...userOrder].reverse().map((order, orderIndex) => (
  <div key={orderIndex} className="order-details">
    <h3>Order Summary</h3>
    <p><strong>Order ID:</strong> {order.id}</p>
    <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
    <p><strong>Status:</strong> {order.orderStatus}</p>
    <p><strong>Order Updated Date:</strong>{new Date(order.updatedDate).toLocaleDateString()}</p>
    <p><strong>Customer Name:</strong> {order.customerName}</p>
    <p><strong>Address:</strong> {order.addressDetails}</p>

    <p><strong>Total Amount:</strong> ₹{order.totalPrice.toFixed(2)}</p>
    <h4>Items:</h4>
    <ul>
      {order.orderProducts.map((item, index) => (
        <li key={index} className="order-item">
          <img src={item.image} alt={item.productName} className="item-image" />
          <div className="item-details">
            <p><strong>{item.productName}</strong></p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ₹{item.totalAmount}</p>
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
