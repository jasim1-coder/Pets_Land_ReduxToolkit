import React, { useState } from "react";
import api from "../../config/axiosConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../Redux/User/UserSlice";
// import { fetchOrders } from "../../Redux/Admin/AdminSlice";

const Razorbutton = ({ amount, addressId }) => {
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const createOrder = async () => {
    try {
      const { data } = await api.post(
        `/Order/CreateOrder?price=${amount}`
      );
      setOrderId(data?.data);
      return data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error in placing order");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Failed to load Razorpay SDK.");
      return;
    }

    const order_id = await createOrder(); // Fetch order_id from backend

    if (!order_id) {
      console.log("Failed to create order.");
      return;
    }
    const options = {
      key: "rzp_test_0tXIKrnrJFMZ96", // Replace with Razorpay Key ID
      amount: amount * 100, // ₹500.00 in paise
      currency: "INR",
      name: "Pet's_Land",
      description: "Order Payment",
      order_id: order_id, // Use order_id from backend
      handler: function (response) {
        verifyPayment(response);
      },
    //   prefill: {
    //     name: address.name,
    //     email: address.email,
    //     contact: address.phone,
    //   },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const verifyPayment = async (paymentData) => {
    try {
      console.log(paymentData);

      const response = await api.post(`/Order/MakeRazorPayment`, paymentData);

      //   const result = await response.json();
      if (response.data.data) {
        console.log(paymentData.razorpay_payment_id);

        placeOrder(paymentData.razorpay_payment_id, amount, addressId);
      } else {
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const placeOrder = async (transactionId, amount, addressid) => {
    try {
      const response = await api.post(`/Order/place-order`, {
        addressId: addressid,
        totalAmount: amount,
        transactionId: transactionId,
      });
      toast.success(response?.data?.message);
       dispatch(fetchCart());
      navigate("/Order_Success");
    } catch (error) {
      toast.success(error?.response?.data?.message || "Error in placing order");
    }
  };
  alert;
  return (
    <button
      className="btn btn-light mt-3 w-50 bg-success rounded-4 text-white shadow"
      disabled={!addressId}
      onClick={handlePayment}
      style={{
        transition: "transform 0.2s, box-shadow 0.3s",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
    >
      Proceed to Payment
    </button>
  );
};

export default Razorbutton;