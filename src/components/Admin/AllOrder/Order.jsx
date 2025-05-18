import React, { useEffect, useState } from "react";
import "./GlobalOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, updateOrderStatus,fetchFilteredOrders } from "../../../Redux/Admin/AdminSlice";
import { fetchCart } from "../../../Redux/User/UserSlice";
const GlobalOrders = () => {
  const dispatch = useDispatch();
  const { orders, fiterdorders } = useSelector((state) => state.admin);
  const [isFiltered, setIsFiltered] = useState(false);

  
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState({}); // Store selected statuses

  useEffect(() => {
    dispatch(fetchOrders());
    // dispatch(fetch)
  }, [dispatch]);
  // useEffect(() => {
  //   dispatch(fetchFilteredOrders());
  // }, [dispatch]);

  const handleFilter = () => {
    const params = {
      userId: userId ? userId : null,
      status: status ? status : null,
      startDate: startDate ? startDate : null,
      endDate: endDate ? endDate : null,
    };
  
    dispatch(fetchFilteredOrders(params));
    setIsFiltered(true);
  };
  

  // const handleStatusChange = (orderId, newStatus) => {
  //   if (newStatus === "") return; // Prevent empty updates
  //   dispatch(updateOrderStatus({ orderId, newStatus }));
  // };


  const handleStatusChange = async (orderId, newStatus) => {
    if (!newStatus) return; // Prevent empty updates
  
    await dispatch(updateOrderStatus({ orderId, newStatus }));
  
    // Check if filters are applied, then fetch accordingly
    if (isFiltered) {
      dispatch(fetchFilteredOrders({ 
        userId: userId || null, 
        status: status || null, 
        startDate: startDate || null, 
        endDate: endDate || null 
      }));
    } else {
      dispatch(fetchOrders());
    }
  };
  
  


  const handleSelectChange = (orderId, newStatus) => {
    setSelectedStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  // const filteredOrders = orders.filter((order) => {
  //   return (
  //     (userId ? order.userId === Number(userId) : true) &&
  //     (status ? order.orderStatus === Number(status) : true) &&
  //     (startDate ? new Date(order.orderDate) >= new Date(startDate) : true) &&
  //     (endDate ? new Date(order.orderDate) <= new Date(endDate) : true)
  //   );
  // });

  const displayOrders = isFiltered ? fiterdorders : orders;


  const getOrderStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Shipped";
      case 2:
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="container mt-4" style={{ background: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      {/* Filter Section */}
      <div className="filter-section p-3 mb-4 rounded shadow-sm bg-light">
        <h4 className="text-center">Filter Orders</h4>
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="0">Pending</option>
              <option value="1">Shipped</option>
              <option value="2">Delivered</option>
            </select>
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-primary" onClick={handleFilter}>Apply Filters</button>
        </div>
      </div>

      {/* Orders Listing Section */}
      <div className="row">
        {displayOrders?.length > 0 ? (
          [...displayOrders].reverse().map((order) => (
            <div key={order.id} className="col-md-4 mb-4">
              <div className="card shadow-sm bg-white rounded p-3">
                <h6 className="text-dark">Order ID: {order.id}</h6>
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Payment:</strong> {order.paymentMethod}</p>
                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                <p><strong>Order Updated Date:</strong>{new Date(order.modifiedDate).toLocaleDateString()}</p>
                <p><strong>Order Updated Admin Id:</strong>{order.modifiedByAdminId}</p>

                <p><strong>Status:</strong> {getOrderStatusText(order.orderStatus)}</p>

                <div className="d-flex align-items-center">
                  <select
                    className="form-select me-2"
                    value={selectedStatuses[order.id] || ""}
                    onChange={(e) => handleSelectChange(order.id, Number(e.target.value))}
                  >
                    <option value="">Update Status</option>
                    <option value="0">Pending</option>
                    <option value="1">Shipped</option>
                    <option value="2">Delivered</option>
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleStatusChange(order.id, selectedStatuses[order.id])}
                    disabled={!selectedStatuses[order.id]} // Disable if no selection
                  >
                    Update
                  </button>
                </div>

                <div className="product-list" style={{ maxHeight: "150px", overflowY: "auto" }}>
                  <h6>Products:</h6>
                  <ul>
                    {order.orderItems?.map((item, index) => (
                      <li key={index} className="d-flex align-items-center">
                        <img src={item.productImage} alt={item.productName} className="img-fluid rounded me-3" style={{ width: "50px" }} />
                        <div>
                          <p className="mb-0">{item.productName}</p>
                          <small>Quantity: {item.quantity}</small>
                          <br />
                          <small>Price: ₹{item.totalPrice}</small>
                          <br />
                          <small>Total: ₹{item.totalPrice * item.quantity}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default GlobalOrders;