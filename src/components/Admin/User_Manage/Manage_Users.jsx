import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './ManageUser.css'; 
import Modal from "../Modals/Modal1";
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
      const response = await axios.get(`http://localhost:3000/users/${id}`);
      const user = response.data;
      setOrderModalContent(user.order || []); // Set order content
      
      setOrderModalOpen(true);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };
  const handleDetailModalOpen = async (id) => {
    try{
      const response = await axios.get(`http://localhost:3000/users/${id}`);
      const user = response.data;
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

  const handleBlockUser = (id, blocked) => {
    dispatch(blockUser({ userId: id, isBlocked: blocked }));
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
              <th>Cart Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.blocked ? 'bg-danger' : 'bg-success'}`}>
                    {user.blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td>
                  <button className='btn-info btn' onClick={()=>handleDetailModalOpen(user.id)}>View Details</button>
                </td>
                <td>
                  {user.order && user.order.length > 0 ? (
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleOpenOrderModal(user.id)}
                    >
                      View Orders
                    </button>
                  ) : (
                    <span>No Orders</span>
                  )}
                </td>
                <td>
                  {user.cart && user.cart.length > 0 ? (
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleOpenCartModal(user.id)}
                    >
                      View Cart
                    </button>
                  ) : (
                    <span>Empty Cart</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleBlockUser(user.id, user.blocked)}
                    className={`btn ${user.blocked ? 'btn-success' : 'btn-danger'} btn-sm`}
                  >
                    {user.blocked ? 'Unblock' : 'Block'}
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
  {orderModalContent.length > 0 ? (
    <div className="container py-3">
      <div><h2>User Orders</h2></div>
      {orderModalContent.map((order) => (
        <div key={order.orderId} className="border p-4 mb-4 rounded shadow-sm">
          <h3 className="fs-4">Order ID: {order.orderId}</h3>
          <p><strong className="fw-bold">Name:</strong> {order.usrName}</p>
          <p><strong className="fw-bold">Address:</strong> {order.address}</p>
          <p><strong className="fw-bold">Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong className="fw-bold">Order Date:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
          <p><strong className="fw-bold">Total Price:</strong> ₹ {order.totalPrice}</p>
          
          <h4 className="fs-5">Items:</h4>
          <div className="list-group">
            {order.items.map((item) => (
              <div key={item.id} className="list-group-item d-flex align-items-center mb-2">
                <img src={item.image} alt={item.name} className="img-fluid rounded me-3" style={{ maxWidth: '80px' }} />
                <div>
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="mb-1"><span className="text-muted">Quantity:</span> {item.quantity}</p>
                  <p className="mb-1"><span className="text-muted">Price:</span> ₹{item.price}</p>
                  <p><span className="text-muted">Total:</span> ₹{item.total}</p>
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
          <p><strong className="fw-bold">Cart Quantity: </strong> {detailModalContent.cart?.length || 0}</p>
          <p><strong className="fw-bold">Number of Orders:</strong> {detailModalContent.order?.length || 0}</p>


    </div>
  ) : (
    <p className="text-center text-danger">No Details found.</p>
  )}
</Modal>


    </div>
  );
};

export default ManageUsers;
    