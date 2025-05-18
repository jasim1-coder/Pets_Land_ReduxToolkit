import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAddresses, addUserAddress, deleteUserAddress } from "../../Redux/Address/AddressSlice";
import { createOrder } from '../../Redux/Order/OrderSlice';
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Razorbutton from "../RazorPay/RazorButton"
import './Place_Order.css';

const AddressList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const totalPrice = location.state?.totalprice || 0;
  const cart = useSelector((state) => state.cart.cart)
  const { addresses, loading } = useSelector((state) => state.address);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
    houseName: "",
    place: "",
    postOffice: "",
    landMark: "",
  });

  // Fetch User Addresses
  useEffect(() => {
    const userId = localStorage.getItem("Id");
    if (userId) {
      dispatch(fetchUserAddresses());
    }
  }, [dispatch]);  // Removed localStorage.getItem("Id") dependency
  
  // Handle Input Changes for New Address
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Add Address
  const handleAddAddress = () => {
    if (Object.values(newAddress).some((value) => value.trim() === "")) {
      toast.error("All fields are required!");
      return;
    }

  //   dispatch(addUserAddress(newAddress))
  //     .unwrap()
  //     .then(() => {
  //       setNewAddress({
  //         fullName: "",
  //         phoneNumber: "",
  //         pincode: "",
  //         houseName: "",
  //         place: "",
  //         postOffice: "",
  //         landMark: "",
  //       });
  //       toast.success("Address added successfully!");
  //     })
  //     .catch((error) => toast.error(error.message || "Failed to add address"));
  // };
  dispatch(addUserAddress(newAddress))
  .unwrap()
  .then(() => {
    setNewAddress({
      fullName: "",
      phoneNumber: "",
      pincode: "",
      houseName: "",
      place: "",
      postOffice: "",
      landMark: "",
    });  // Reset form
    toast.success("Address added successfully!");
    dispatch(fetchUserAddresses());  // Refresh addresses
  })
  .catch((error) => toast.error(error.message || "Failed to add address"));
  }
  // Delete Address
  const handleDeleteAddress = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      // dispatch(deleteUserAddress(addressId))
      //   .unwrap()
      //   .then(() => toast.success("Address deleted successfully"))
      //   .catch((error) => toast.error(error.message || "Failed to delete address"));

      dispatch(deleteUserAddress(addressId))
  .unwrap()
  .then(() => {
    toast.success("Address deleted successfully");
    dispatch(fetchUserAddresses());  // Refresh addresses
  })
  .catch((error) => toast.error(error.message || "Failed to delete address"));
    }
  };
  

  // Create Order
  const handleCreateOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select an address before placing an order.");
      return;
    }

    dispatch(createOrder({ totalPrice, addressId: selectedAddress }))
      .unwrap()
      .then(() => toast.success("Order placed successfully!"))
      .catch((error) => toast.error(error.message || "Failed to place order"));
  };

  return (
    <div className="address-container">
      <h2>Saved Addresses</h2>

      {loading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p>No saved addresses found.</p>
      ) : (
        <div className={addresses.length > 4 ? "address-slider" : "address-grid"}>
          {addresses.map((address) => (
            <div
              key={address.addressId}
              className={`address-card ${selectedAddress === address.addressId ? "selected" : ""}`}
              onClick={() => setSelectedAddress(address.addressId)}
            >
              <h3>{address.fullName}</h3>
              <p>📞 {address.phoneNumber}</p>
              <p>🏠 {address.houseName}, {address.place}</p>
              <p>📍 {address.landMark}</p>
              <p>📮 {address.postOffice}, {address.pincode}</p>
              <button className="delete-btn" onClick={() => handleDeleteAddress(address.addressId)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Form */}
      <div className="add-address">
        <h3>Add New Address</h3>
        <input type="text" name="fullName" placeholder="Full Name" value={newAddress.fullName} onChange={handleInputChange} />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={newAddress.phoneNumber} onChange={handleInputChange} />
        <input type="text" name="pincode" placeholder="Pincode" value={newAddress.pincode} onChange={handleInputChange} />
        <input type="text" name="houseName" placeholder="House Name" value={newAddress.houseName} onChange={handleInputChange} />
        <input type="text" name="place" placeholder="Place" value={newAddress.place} onChange={handleInputChange} />
        <input type="text" name="postOffice" placeholder="Post Office" value={newAddress.postOffice} onChange={handleInputChange} />
        <input type="text" name="landMark" placeholder="Landmark" value={newAddress.landMark} onChange={handleInputChange} />
        <button onClick={handleAddAddress}>Add Address</button>
      </div>

      {/* Place Order Button */}
      {/* <button className="place-order-btn" onClick={handleCreateOrder} disabled={!selectedAddress}>
        Create Order
      </button> */}
        <Razorbutton
          amount={cart.totalPrice}
          addressId={selectedAddress}
        />    </div>
  );
};

export default AddressList;
