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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/product/${id}`);
        setProduct(response.data);
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
    dispatch(addToCart(product));
  };

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <img src={product.image} alt={product.name} />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="description">{product.description}</p>
          <p className="price">Price: ₹{product.price}</p>
          {product.oldPrice && <p className="old-price">Old Price: ₹{product.oldPrice}</p>}
          {product.discount && <p className="discount">Discount: {product.discount}%</p>}
          <p className="category">Category: {product.category}</p>
          <p className="seller">Seller: {product.seller}</p>

          <h3>Ingredients:</h3>
          <ul className="ingredients">
            {product.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={cartStatus === "loading"}
          >
            {cartStatus === "loading" ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
