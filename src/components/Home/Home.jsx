import React, { useState, useEffect } from "react";
import ProductList from "../Products_list/Products_list";
import "./Home.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, updatedCategory, getProductsByCategory } from "../../Redux/Admin/AdminSlice";

const bannerImages = [
  "https://img.freepik.com/premium-photo/dogs-cats-peeking-clear-solid-blue-top-line-petshop-banner-happy-smile-funny-generative-ai-image-weber_31965-211700.jpg?w=900",
  "https://img.freepik.com/premium-photo/dogs-cats-peeking-clear-solid-blue-top-line-petshop-banner-happy-smile-funny-generative-ai-weber_31965-181292.jpg?w=900",
  "https://img.freepik.com/premium-photo/dogs-cats-peeking-clear-solid-blue-top-line-petshop-banner-happy-smile-funny-generative-ai-image-weber_31965-192247.jpg?w=900",
  "https://img.freepik.com/free-vector/hand-drawn-pet-shop-template-design_23-2150339791.jpg?t=st=1732008931~exp=1732012531~hmac=26994d48c7bb1d9c932bbe48e0ef3a46cf012373ff0b6decc7e85946920d3c47&w=1380",
];

function Home() {
  const dispatch = useDispatch();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [userSelected, setUserSelected] = useState("all");
  const { products, selectedCategory, filterdproducts,searchResult } = useSelector((state) => state.admin);

  const handleCategoryChange = (category) => {
    setUserSelected(category); // Update state
    dispatch(updatedCategory(category));

    if (category === "dog") {
      dispatch(getProductsByCategory(1)); // Fetch products for Dog category
    } else if (category === "cat") {
      dispatch(getProductsByCategory(2)); // Fetch products for Cat category
    } else {
      dispatch(fetchProducts()); // Fetch all products
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Run handleCategoryChange("all") when component mounts
  useEffect(() => {
    handleCategoryChange("all");
  }, []);

  const filteredProducts = searchResult.length > 0 ? searchResult : selectedCategory === "all" ? products : filterdproducts;
  console.log(filteredProducts);

  return (
    <div className="home">
      {/* Slideshow Banner */}
      <div className="banner">
        <img src={bannerImages[currentBannerIndex]} alt={`Banner ${currentBannerIndex + 1}`} className="banner-image" />
      </div>

      {/* Category Selection */}
      <div className="categories">
        <div
          className="category-card"
          onClick={() => handleCategoryChange("dog")}
          style={{
            backgroundImage: `url("https://img.freepik.com/premium-photo/close-up-portrait-dog-against-clear-sky_1048944-21764405.jpg?w=740")`,
          }}
        >
          Dogs
        </div>
        <div
          className="category-card"
          onClick={() => handleCategoryChange("cat")}
          style={{
            backgroundImage: `url("https://img.freepik.com/premium-photo/cat-with-yellow-background-that-sayscat_670382-24884.jpg")`,
          }}
        >
          Cats
        </div>
        <div
          className="category-card"
          onClick={() => handleCategoryChange("all")}
          style={{
            backgroundImage: `url(https://www.shutterstock.com/image-photo/portrait-cat-dog-front-bright-600nw-1927527212.jpg)`,
          }}
        >
          Dog & Cat
        </div>
      </div>

      {/* Product List */}
      <ProductList selectedCategory={filteredProducts} />
    </div>
  );
}

export default Home;
