import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import toast from "react-hot-toast";
import "./Register_Page.css";

const initialValues = {
  name: "",
  userName: "",
  email: "",
  phoneNo: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  userName: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phoneNo: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

function Register_Page() {
  const navigate = useNavigate();

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const requestData = {
        name: values.name,
        userName: values.userName,
        email: values.email,
        phoneNo: values.phoneNo,
        password: values.password,
      };
  
      console.log("Request Payload:", requestData); // Debugging Step
  
      const response = await axios.post("https://localhost:7062/api/auth/SignUp", requestData);
      console.log("API Response:", response.data); // Debugging Step
  
      if (response.data.statusCode === 201) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <div className="Overall">
          <Form className="form-container">
            <div className="form-control">
              <label htmlFor="name">Name</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div className="form-control">
              <label htmlFor="userName">Username</label>
              <Field type="text" id="userName" name="userName" />
              <ErrorMessage name="userName" component="div" className="error" />
            </div>

            <div className="form-control">
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-control">
              <label htmlFor="phoneNo">Phone Number</label>
              <Field type="text" id="phoneNo" name="phoneNo" />
              <ErrorMessage name="phoneNo" component="div" className="error" />
            </div>

            <div className="form-control">
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="form-control">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field type="password" id="confirmPassword" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>
            <button type="button" onClick={() => navigate("/login")}>
              Back to Login
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default Register_Page;
