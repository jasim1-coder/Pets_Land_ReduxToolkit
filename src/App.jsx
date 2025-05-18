import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login_Page from "./components/Login/Login_page";
import Register_Page from "./components/Login/Register_page";
// import Front_page from "./components/Front_page";
import Layout from "./Layout/Layout";
// import ProductList from "./components/Products_list/Products_list";
import Home from "./components/Home/Home";
import ProductDetail from "./components/Product_detail/Products_details";
import CartPage from "./components/Cart/CartPage";
import PlaceOrderPage from "./components/Order/Place_Order";
import OrderSuccessPage from "./components/Success_Page/Order_Success";

import { Toaster } from "react-hot-toast";

import ManageProducts from "./components/Admin/Product_Manage/Manage_Product"; // Add this
import ManageUsers from "./components/Admin/User_Manage/Manage_Users"; // Add this
import AdminDashboard from "./components/Admin/Dashbord/Admin_Home";
import LayoutAdmin from "./components/AdminLayout.jsx/LayoutAdmin";
import GlobalOrders from "./components/Admin/AllOrder/Order";
import Wishlist from "./components/Wishlists/Wishlist";

function App() {
  return (
    <BrowserRouter>
          <Toaster />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/place-order" element={<PlaceOrderPage />} />
              <Route path="/Order_Success" element={<OrderSuccessPage />} />
              <Route path="/Login" element={<Login_Page />} />
              <Route path="/register" element={<Register_Page />} />
              <Route path="/Wishlists" element={<Wishlist />} />

            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="orders" element={<GlobalOrders />} />
        </Route>
          </Routes>
    </BrowserRouter>
  );
}

export default App;
