import React, { useEffect } from 'react';
import "./GlobalOrder.css"
import { useSelector,useDispatch } from 'react-redux';
import { fetchOrders } from '../../../Redux/Admin/AdminSlice';


const GlobalOrders = () => {
  const orders = useSelector((state) => state.admin.orders)

  useEffect(()=>{
    dispatch(fetchOrders())
  },[orders])

  const dispatch = useDispatch()

  console.log(orders)
  return (
      <div className="row">
        <div><h2>All Orders</h2></div>
        {[...orders].reverse().map((order) => (
          <div key={order.orderId} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Order ID: {order.orderId}</h5>
              </div>
              <div className="card-body">
                <p><strong>Name:</strong> {order.usrName}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Order Date:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
                <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>

                <h6>Items:</h6>
                <div className="scrollable-list">
                <ul className="list-group grp">

                  {order.items.map((item) => (
                    <li key={item.id} className="list-group-item d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded me-3"
                        style={{ width: '50px' }}
                      />
                      <div>
                        <p className="mb-0">{item.name}</p>
                        <small>Quantity: {item.quantity}</small><br />
                        <small>Price: ₹{item.price}</small><br />
                        <small>Total: ₹{item.total}</small>
                      </div>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
              <div className="card-footer text-center">
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

export default GlobalOrders;
