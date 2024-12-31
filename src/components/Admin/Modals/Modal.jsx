import React from "react";
import "./Modal1.css";
import toast from 'react-hot-toast';


const Modal = ({ modalType, productData, setProductData, onSave, onClose }) => {
  
  const handleChange = (e) => {

    const { name, value } = e.target;
    
    if(["price", "oldPrice", "stock"].includes(name)){
      setProductData((prev) => ({...prev, [name]: parseInt(value)}))
    }

    else if(name === "ingredients"){
        setProductData((prev) => ({...prev, [name]: value.split(",").map((item) => item.trim())}))
    }
    else{
    setProductData((prev) => ({ ...prev, [name]: value }));
  }};


  const handleSave = () => {
    if (productData.name && productData.category && productData.price && productData.stock && productData.seller && productData.ingredients && productData.image && productData.description) {
      onSave(productData); 
    } else {
      toast.error("Please fill all fields!");
    }
  };

  return (
    <div className="modal1">
      <div className="modal-content1">
        <h3>{modalType === "edit" ? "Edit" : "Add Product"}</h3>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData?.name || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={productData.category || ""}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price || ""}
          onChange={handleChange}
        />
        <input
          type="number"
          name="oldPrice"
          placeholder="oldPrice"
          value={productData.oldPrice || ""}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={productData.stock || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="seller"
          placeholder="Seller"
          value={productData.seller || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="image url"
          value={productData.image || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ingredients"
          placeholder="Ingredients"
          value={productData.ingredients || []}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={productData.description || ""}
          onChange={handleChange}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
