import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login_Page.css';
import * as Yup from 'yup';
// import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { fetchCart, setLogin } from '../../Redux/User/UserSlice';
import { useDispatch } from 'react-redux';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Required'),
});

function Login_Page() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  // const { login, setLogin } = useContext(CartContext);

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      // Admin Login
      const admin = users.find(
        (user) =>
          user.email.toLowerCase() === values.email.toLowerCase() && user.password === values.password && user.role === 'admin'
      );

      if (admin) {
        localStorage.setItem('id', admin.id);
        localStorage.setItem('name', admin.name);
        toast.success('Admin Login successful!');
        navigate('/admin');
        dispatch(setLogin(true))
        return;
      }

      // Regular User Login
      const matchedUser = users.find(
        (user) =>
          user.email.toLowerCase() === values.email.toLowerCase() &&
          user.password === values.password 
      );

      if (matchedUser) {
        if(matchedUser.blocked == true){
          toast.error('User blocked by admin');
        }
        else{
          localStorage.setItem('id', matchedUser.id);
        localStorage.setItem('name', matchedUser.name);
        dispatch(setLogin(true));
        toast.success('Login successful!');
        navigate('/');}
        dispatch(fetchCart())
      } else {
        setFieldError('email', 'Invalid email or password');
        setFieldError('password', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Server error. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <div className="Overall">
          <Form className="form-container">
            <div className="form-control">
              <label htmlFor="email">E-mail</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            <button type="button" onClick={() => navigate('/register')}>
              Register
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default Login_Page;
