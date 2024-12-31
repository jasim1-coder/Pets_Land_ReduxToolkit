import React, { useState, useContext } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Place_Order.css';
// import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { useSelector,useDispatch } from 'react-redux';
import { clearCart } from '../../Redux/User/UserSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  street: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string().required('Postal code is required'),
  paymentMethod: Yup.string()
    .oneOf(['creditCard', 'paypal'], 'Please select a payment method')
    .required('Payment method is required'),
});

const initialValues = {
  name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  paymentMethod: '',
};

function PlaceOrderPage() {
  const cart = useSelector((state) => state.cart.cart)
  const dispatch = useDispatch()
  // const {  setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const placeOrder = async (address, paymentMethod) => {
    const userId = localStorage.getItem('id');
    if (!userId) {
      toast.error('User not logged in.');
      return;
    }

    try {
      setLoading(true);

      // Fetch user data
      const userResponse = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = userResponse.data;

      // Create order object
      const order = {
        orderId: Date.now(),
        userId: userId,
        usrName:user.name,
        timestamp: new Date().toISOString(),
        address,
        paymentMethod,
        items: cart.map(item => ({
          id: item.id,
          image: item.image,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
        totalPrice: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      };

      // Add order to user's `Orders`
      const updatedUserOrders = [...user.order, order];
      await axios.patch(`http://localhost:3000/users/${userId}`, { order: updatedUserOrders });

      await axios.post('http://localhost:3000/Orders', order);

      // Update product stock
      for (const item of cart) {
        const productResponse = await axios.get(`http://localhost:3000/product/${item.id}`);
        const product = productResponse.data;
  
        const updatedProduct = {
          ...product,
          stock: product.stock - item.quantity, // Reduce stock
        };
  
        await axios.put(`http://localhost:3000/product/${item.id}`, updatedProduct);
      }

      // Clear the cart
      await axios.patch(`http://localhost:3000/users/${userId}`, { cart: [] });
      dispatch(clearCart([]));
      toast.success('Order placed successfully!');
      navigate('/Order_Success');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = values => {
    const address = `${values.street}, ${values.city}, ${values.state}, ${values.postalCode}`;
    placeOrder(address, values.paymentMethod);
  };

  const formFields = [
    { name: 'name', type: 'text', placeholder: 'Full Name' },
    { name: 'email', type: 'email', placeholder: 'Email Address' },
    { name: 'phone', type: 'text', placeholder: 'Phone Number' },
    { name: 'street', type: 'text', placeholder: 'Street Address' },
    { name: 'city', type: 'text', placeholder: 'City' },
    { name: 'state', type: 'text', placeholder: 'State' },
    { name: 'postalCode', type: 'text', placeholder: 'Postal Code' },
  ];

  return (
    <div className="place-order-page">
      <h2>Place Your Order</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="place-order-form">
            <h3>Address Details</h3>
            {formFields.map(field => (
              <div key={field.name} className="form-field">
                <Field
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  required
                />
                <ErrorMessage name={field.name} component="div" className="error-message" />
              </div>
            ))}
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <label>
                <Field
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={values.paymentMethod === 'creditCard'}
                />
                Credit Card
              </label>
              <label>
                <Field
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={values.paymentMethod === 'paypal'}
                />
                PayPal
              </label>
              <ErrorMessage name="paymentMethod" component="div" className="error-message" />
            </div>
            <button type="submit" className="place-order-submit-btn" disabled={loading}>
              {loading ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PlaceOrderPage;
