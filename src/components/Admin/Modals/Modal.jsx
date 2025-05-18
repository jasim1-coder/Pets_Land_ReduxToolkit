import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct, editProduct } from "../../../Redux/Admin/AdminSlice"; // Import actions
import toast from "react-hot-toast";
import "./Modal1.css";

const Modal = ({ modalType, productData, setProductData, onClose }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      console.log(file);
      
      setSelectedFile(file);
      setProductData((prev) => ({ ...prev, image: file })); // Store file
      console.log(productData)
    } else if (["rp", "mrp", "stock"].includes(name)) {
      setProductData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (name === "ingredients") {
      setProductData((prev) => ({
        ...prev,
        [name]: value ? value.split(",").map((item) => item.trim()) : [],
      }));
    } else if (name === "categoryId") {
      setProductData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
      console.log(productData)
    }
  };

  const handleSaveProduct = () => {
    if (productData.id) {
      dispatch(editProduct({ id: productData.id, updatedProduct: productData }));
    } else {
      dispatch(addProduct(productData));

    }
    onClose(); 
  };

  return (
    <div className="modal1">
      <div className="modal-content1">
        <h3>{modalType === "edit" ? "Edit" : "Add Product"}</h3>
        <input type="text" name="name" placeholder="Product Name" value={productData?.name || ""} onChange={handleChange} />
        <select name="categoryId" value={productData.categoryId || ""} onChange={handleChange}>
  <option value="">Select Category</option>
  <option value="1">Dog</option>
  <option value="2">Cat</option>
</select>
        <input type="number" name="rp" placeholder="Price" value={productData.rp || ""} onChange={handleChange} />
        <input type="number" name="mrp" placeholder="MRP" value={productData.mrp || ""} onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock" value={productData.stock || ""} onChange={handleChange} />
        <input type="text" name="seller" placeholder="Seller" value={productData.seller || ""} onChange={handleChange} />
        <input type="text" name="ingredients" placeholder="Ingredients (comma separated)" value={Array.isArray(productData.ingredients) ? productData.ingredients.join(", ") : ""} onChange={handleChange} />
        <input type="text" name="description" placeholder="Description" value={productData.description || ""} onChange={handleChange} />

        {/* File Upload for Image */}
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}

        <button onClick={handleSaveProduct}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
