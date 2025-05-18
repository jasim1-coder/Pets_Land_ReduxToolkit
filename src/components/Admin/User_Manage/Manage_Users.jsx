import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './ManageUser.css'; 
import Modal from "../Modals/Modal1";
import api from '../../../config/axiosConfig';
// import { AdminContext } from '../../../context/AdminContext';
import { useSelector,useDispatch } from 'react-redux';
import { deleteUser,blockUser,fetchUsers } from '../../../Redux/Admin/AdminSlice';

const ManageUsers = () => {
  const dispatch = useDispatch()
  const {users} = useSelector((state) => state.admin)
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [cartModalContent, setCartModalContent] = useState([]);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalContent, setOrderModalContent] = useState([]);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalContent, setDetailModalContent] = useState([]);
  const [userOrders, setUserOrders] = useState([]); // ✅ Declare state

  // const {deleteUser,users,blockUser} = useContext(AdminContext)
  useEffect(()=>{
    dispatch(fetchUsers())
  },[users])

  const handleOpenCartModal = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${id}`);
      const user = response.data;
      setCartModalContent(user.cart || []); // Set cart content
      setCartModalOpen(true);
    } catch (error) {
      console.error('Error fetching user cart:', error);
    }
  };
  const handleOpenOrderModal = async (id) => { 
    try {
      const response = await api.get(`/Admin/User-Order?UserId=${id}`);
      console.log(response.data); // Debugging: Check API response
      const orders = response.data.data || []; 
  
      setUserOrders(orders); // ✅ Ensure userOrders gets updated
      setOrderModalOpen(true); // ✅ Open modal
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };
  
  
  


  const handleDetailModalOpen = async (id) => {
    try{

      const response = await api.get(`/Admin/Get-UserBy-Id?id=${id}`);
      const user = response.data.data;
      setDetailModalOpen(true)
      setDetailModalContent(user)
    }catch(error){
      console.error('Error fetching user details:', error);

    }
  }

  const handleCloseCartModal = () => {
    setCartModalOpen(false);
    setCartModalContent([]);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setOrderModalContent([]);
  };
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setDetailModalContent([]);
  };

  const handleBlockUser = (id) => {
    dispatch(blockUser({ userId: id }));
  };
  
  

  const handleDelete = async (id) => {
    try {
      dispatch(deleteUser(id)); 
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="">
      <h2 className="">Manage Users</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Details</th>
              <th>Order History</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.isBlocked ? 'bg-danger' : 'bg-success'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td>
                  <button className='btn-info btn' onClick={()=>handleDetailModalOpen(user.id)}>View Details</button>
                </td>
                <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleOpenOrderModal(user.id)}
                >
                  View Orders
                </button>
              </td>

                <td>
                <button
  onClick={() => handleBlockUser(user.id)}
  className={`btn ${user.isBlocked ? 'btn-success' : 'btn-danger'} btn-sm`}
>
  {user.isBlocked ? 'Unblock' : 'Block'}
</button>

                  {/* <button
                    onClick={() => handleDelete(user.id)}
                    className="btn btn-danger btn-sm ml-2"
                  >
                    Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
{/* cart modal */}
      <Modal isOpen={isCartModalOpen} onClose={handleCloseCartModal}>
  {cartModalContent.length > 0 ? (
    <div className="container py-3">
      <div><h2>User Cart</h2></div>
      {cartModalContent.map((item) => (
        <div key={item.id} className="border p-4 mb-4 rounded shadow-sm">
          <div className="d-flex align-items-center">
            <img
              src={item.image} alt={item.title} className="img-fluid rounded me-3" style={{ maxWidth: '80px' }}/>
            <div>
              <h5 className="mb-1">{item.name}</h5>
              <p className="mb-1">
                <span className="text-muted">Quantity:</span> {item.quantity}
              </p>
              <p className="mb-1">
                <span className="text-muted">Price:</span> ₹{item.price}
              </p>
              <p className="mb-1">
                <span className="text-muted">Total Price:</span> ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-danger">No items in the cart.</p>
  )}
</Modal>
{/* order modal   */}
<Modal isOpen={isOrderModalOpen} onClose={handleCloseOrderModal}>
  {userOrders.length > 0 ? (
    <div className="container py-3">
      <h2>User Orders</h2>
      {userOrders.map((order) => (
        <div key={order.id} className="border p-4 mb-4 rounded shadow-sm">
          <h3 className="fs-4">Order ID: {order.id}</h3>
          <p><strong>Name:</strong> {order.customerName}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
          <p><strong>Total Price:</strong> ₹ {order.totalAmount}</p>
          <p><strong>Order Updated Date:</strong>{new Date(order.modifiedDate).toLocaleDateString()}</p>
          <p><strong>Address:</strong>{order.address}</p>

          <h4 className="fs-5">Items:</h4>
          <div className="list-group">
            {order.orderItems?.map((item) => (
              <div key={item.id} className="list-group-item d-flex align-items-center mb-2">
                <img src={item.productImage} alt={item.name} className="img-fluid rounded me-3" style={{ maxWidth: '80px' }} />
                <div>
                  <h5 className="mb-1">{item.productName}</h5>
                  <p className="mb-1"><span className="text-muted">Quantity:</span> {item.quantity}</p>
                  <p className="mb-1"><span className="text-muted">Price:</span> ₹{item.totalPrice}</p>
                  <p><span className="text-muted">Total:</span> ₹{item.totalPrice * item.quantity}</p>
                  </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-danger">No orders found.</p>
  )}
</Modal>



<Modal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal}>
  {detailModalContent ? (
    <div className="container py-3">
      <div><h2>User Details</h2></div>
          <p><strong className="fw-bold">Name: </strong> {detailModalContent.name}</p>
          <p><strong className="fw-bold">Id: </strong> {detailModalContent.id}</p>
          <p><strong className="fw-bold">E-mail: </strong> {detailModalContent.email}</p>
          <p><strong className="fw-bold">Cart Quantity: </strong> {detailModalContent.totalCartItems || 0}</p>
          <p><strong className="fw-bold">Number of Orders:</strong> {detailModalContent.totalOrders || 0}</p>


    </div>
  ) : (
    <p className="text-center text-danger">No Details found.</p>
  )}
</Modal>


    </div>
  );
};

export default ManageUsers;
    