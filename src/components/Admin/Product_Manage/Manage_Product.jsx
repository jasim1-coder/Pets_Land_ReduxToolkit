import React, { useEffect, useState } from "react";
import Modal from "../Modals/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageProduct.css"
import "../Admin.css"
import { useDispatch, useSelector } from "react-redux";
import {deleteProduct, editProduct, addProduct,fetchProducts,updatedCategory,getProductsByCategory} from '../../../Redux/Admin/AdminSlice'


const ManageProducts = () => {

  const { products, selectedCategory ,fiterdorders,filterdproducts} = useSelector((state) => state.admin)
  const dispatch = useDispatch()


  
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState({});
  const [modalType, setModalType] = useState(null);
  

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    dispatch(updatedCategory(category));

    if (category === "dog") {
      dispatch(getProductsByCategory(1)); // Fetch products for Dog category
    } else if (category === "cat") {
      dispatch(getProductsByCategory(2)); // Fetch products for Cat category
    } else {
      dispatch(fetchProducts()); // Fetch all products
    }
  };
      const handleDeleteProduct = async (id) => {
        try {
          console.log(id)
          await dispatch(deleteProduct(id)); // Wait for delete action to complete
          toast.success("Product deleted successfully!");
        } catch (error) {
          toast.error(error || "Failed to delete product");
        }
      };
      const filteredProducts = selectedCategory === "all" ? products : filterdproducts;
      useEffect(() => {
        dispatch(fetchProducts());
      }, [ products,filterdproducts]);
  const handleAddProduct = () => {
      setProductData({
        name: "",
      categoryId: "",
      rp: "",
      mrp:"",
      stock: "",
      seller: "",
      ingredients: [],
      image: "",
      description: "",
    });
    setModalType("add")

  }

  const handleEditProduct = (product) => {
    setProductData(product); 
    setIsEditing(true);
    setModalType("edit");
  };



  const handleCloseModal = () => {
    setModalType(null)
  }

  const handleSaveProduct = (updatedProduct) => {
    if(modalType === "add"){
      dispatch(addProduct(updatedProduct))
      toast.success("Product added successfully!");
    }else if (modalType === "edit"){
      dispatch(editProduct({id:updatedProduct.id, updatedProduct}))
      toast.success("Product updated successfully!");
    }
    handleCloseModal();
  };

  return (
    <div className="">
      <h2>Admin Product Management</h2>
      <div className="filter-category">
        <label>Filter by Category:</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="all">All</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
      </div>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <button style={{width:"150px",borderRadius:"40px"}} onClick={() => handleAddProduct()}>Add Product</button>
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Seller</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts?.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.imageUrl || product.image} alt={product.name} className="product-image" />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.rp}</td>
                <td>{product.stock}</td>
                <td>{product.seller}</td>
                <td>
                  <button className="btn" style={{color:"white",backgroundColor:"blue"}} onClick={() => handleEditProduct(product)}>Edit</button>
                 <div><button className="btn" style={{color:"white",backgroundColor:"red"}} onClick={() => handleDeleteProduct(product.id)}>Delete</button></div> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalType && (
        <Modal
          modalType = {modalType}
          productData={productData}
          setProductData={setProductData}
          onSave={handleSaveProduct}
          onClose={handleCloseModal}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default ManageProducts;
