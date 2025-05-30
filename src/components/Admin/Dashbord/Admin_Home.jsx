import React, {  useEffect } from "react";
import PieChart from "../PieChart/PieChart";
import { fetchUsers,fetchOrders,fetchProducts, fetchTotalRevenue, fetchProductsPurchased } from "../../../Redux/Admin/AdminSlice";
import { useSelector,useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  // const navigate = useNavigate
  // const userId = localStorage.getItem("Id")
  // if(!userId) return navigate('/Login')
  const dispatch = useDispatch()
  const {orders,users,products,totalOrders,totalProducts,totalUsers,recentOrders,totalRevenue,totalProductPurchased} = useSelector((state) => state.admin)
  

  useEffect(() => {
    if (users.length === 0) dispatch(fetchUsers());
    if (orders.length === 0) dispatch(fetchOrders());
    if(totalRevenue === 0) dispatch(fetchTotalRevenue())
    if(totalProductPurchased === 0) dispatch(fetchProductsPurchased())
  }, [dispatch]);     


  

  return (
    <div className="container-fluid">
      <div className="row">
        <main className="col-md-12 px-4">
          <h2>Dashboard</h2>
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <p className="card-text">{totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card text-white bg-success mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Products</h5>
                  <p className="card-text">{totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card text-white bg-warning mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Orders</h5>
                  <p className="card-text">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card text-white bg-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Revenue</h5>
                  <p className="card-text">₹{totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card text-white bg-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Product Purchased</h5>
                  <p className="card-text">₹{totalProductPurchased}</p>
                </div>
              </div>
            </div>
          </div>
          <h2>Recent Orders</h2>
          {recentOrders && recentOrders.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Order ID</th>
                  <th scope="col">User Name</th>
                  <th scope="col">Payment Method</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[...recentOrders].reverse().map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.paymentMethod }</td>
                    <td>{order.totalAmount ? order.totalAmount.toFixed(2) : "N/A"}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No recent orders available.</p>
          )}
        </main>
        <PieChart/>

      </div>
    </div>
  );
};

export default AdminDashboard;
