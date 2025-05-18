
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./Product_detail.css";
import { addToCart } from "../../Redux/User/UserSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const cartStatus = useSelector((state) => state.cart.status);
  const numericId = Number(id); // Convert string to number


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://localhost:7062/api/Products/GetProductById`, {
          params: { Id: numericId }
        });
        console.log("API Response:", response.data);
        setProduct(response.data.data); // ✅ Fixed: Set `data` directly
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!product || !product.id) {
      console.error("Product not loaded properly", product);
      return;
    }
    console.log("Adding product to cart:", product.id);
    dispatch(addToCart(product.id));
  };
  

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <img src={product.image} alt={product.name} />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="description">{product.description}</p>
          <p className="price">Price: ₹{product.rp}</p>  {/* ✅ Fixed */}
          {product.mrp > 0 && <p className="old-price">MRP: ₹{product.mrp}</p>}
          <p className="category">Category: {product.category}</p>
          <p className="seller">Seller: {product.seller}</p>

          <h3 style={{ fontSize: "25px", marginBottom: "8px" }}>Ingredients:</h3>
{product.ingredients?.length > 0 ? (
  <ul style={{ paddingLeft: "16px", marginBottom: "10px" }}>
    {product.ingredients.map((ingredient, index) => (
      <li key={index} style={{ fontSize: "20px", marginBottom: "4px" }}>{ingredient}</li>
    ))}
  </ul>
) : (
  <p style={{ fontSize: "14px", marginBottom: "8px" }}>No ingredients available</p>
)}


          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            // disabled={cartStatus === "loading"}
          >
            {/* {cartStatus === "loading" ? "Adding..." : "Add to Cart"} */}
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
