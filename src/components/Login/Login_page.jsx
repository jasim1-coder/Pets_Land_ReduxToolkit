// import React from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Login_page.css';
// import * as Yup from 'yup';
// import toast from 'react-hot-toast';
// import { fetchCart, setLogin } from '../../Redux/User/UserSlice';
// import { useDispatch } from 'react-redux';

// const initialValues = {
//   email: '',
//   password: '',
// };

// const validationSchema = Yup.object({
//   email: Yup.string().email('Invalid email format').required('Required'),
//   password: Yup.string().required('Required'),
// });

// function Login_Page() {
//   const dispatch = useDispatch()
//   const navigate = useNavigate();

//   const onSubmit = async (values, { setSubmitting, setFieldError }) => {
//     try {
//       const response = await axios.get('http://localhost:3000/users');
//       const users = response.data;

//       // Admin Login
//       const admin = users.find(
//         (user) =>
//           user.email.toLowerCase() === values.email.toLowerCase() && user.password === values.password && user.role === 'admin'
//       );

//       if (admin) {
//         localStorage.setItem('id', admin.id);
//         localStorage.setItem('name', admin.name);
//         toast.success('Admin Login successful!');
//         navigate('/admin');
//         dispatch(setLogin(true))
//         return;
//       }

//       // Regular User Login
//       const matchedUser = users.find(
//         (user) =>
//           user.email.toLowerCase() === values.email.toLowerCase() &&
//           user.password === values.password 
//       );

//       if (matchedUser) {
//         if(matchedUser.blocked == true){
//           toast.error('User blocked by admin');
//         }
//         else{
//           localStorage.setItem('id', matchedUser.id);
//         localStorage.setItem('name', matchedUser.name);
//         dispatch(setLogin(true));
//         toast.success('Login successful!');
//         navigate('/');}
//         dispatch(fetchCart())
//       } else {
//         setFieldError('email', 'Invalid email or password');
//         setFieldError('password', 'Invalid email or password');
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       toast.error('Server error. Please try again later.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={onSubmit}
//     >
//       {({ isSubmitting }) => (
//         <div className="Overall">
//           <Form className="form-container">
//             <div className="form-control">
//               <label htmlFor="email">E-mail</label>
//               <Field type="email" id="email" name="email" />
//               <ErrorMessage name="email" component="div" className="error" />
//             </div>
//             <div className="form-control">
//               <label htmlFor="password">Password</label>
//               <Field type="password" id="password" name="password" />
//               <ErrorMessage name="password" component="div" className="error" />
//             </div>
//             <button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? 'Logging in...' : 'Login'}
//             </button>
//             <button type="button" onClick={() => navigate('/register')}>
//               Register
//             </button>
//           </Form>
//         </div>
//       )}
//     </Formik>
//   );
// }

// export default Login_Page;
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login_page.css';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { fetchCart, setLogin } from '../../Redux/User/UserSlice';
import { fetchWishlist } from '../../Redux/Wishlist/WishListSlice';
import { useDispatch } from 'react-redux';

const initialValues = {
  username: '', // Changed from email to username
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'), 
  password: Yup.string().required('Password is required'),
});

function Login_Page() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post('https://localhost:7062/api/auth/login', values);
      const { data } = response; 
      console.log(data.data)

      if (data.statusCode === 400) {
        setFieldError('username', data.message);
        setFieldError('password', data.message);
        toast.error(data.message);
        return;
      }

      if (data.statusCode === 200) {
        // Save JWT token & refresh token in local storage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('expiration', data.data.expiration);
        localStorage.setItem('Name', data.data.name);
        localStorage.setItem('Id', data.data.userId);


        
        toast.success(response.data.message);
        dispatch(setLogin(true));
        console.log(data.data.Role)
        navigate(data.data.name === 'admin' ? '/admin' : '/');
        dispatch(fetchCart());
        dispatch(fetchWishlist);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message ;
  
        setFieldError('username', errorMessage);
        setFieldError('password', errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
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
              <label htmlFor="username">Username</label>
              <Field type="text" id="username" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
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
