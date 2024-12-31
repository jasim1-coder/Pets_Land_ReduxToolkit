import React, { useState, useEffect} from "react";
import ProductList from "../Products_list/Products_list";
import "./Home.css";
import {  useSelector } from "react-redux";

const bannerImages = [
  "https://img.freepik.com/premium-photo/dogs-cats-peeking-clear-solid-blue-top-line-petshop-banner-happy-smile-funny-generative-ai-image-weber_31965-211700.jpg?w=900",
  "https://img.freepik.com/premium-photo/dogs-cats-peeking-clear-solid-blue-top-line-petshop-banner-happy-smile-funny-generative-ai-weber_31965-181292.jpg?w=900",
  "https://img.freepik.com/premium-photo/dogs-cats-peeking-clear-solid-blue-top-line-petshop-banner-happy-smile-funny-generative-ai-image-weber_31965-192247.jpg?w=900",
  "https://img.freepik.com/free-vector/hand-drawn-pet-shop-template-design_23-2150339791.jpg?t=st=1732008931~exp=1732012531~hmac=26994d48c7bb1d9c932bbe48e0ef3a46cf012373ff0b6decc7e85946920d3c47&w=1380",
];

function Home() {

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [userSelected,setUserSelected] = useState("all")
  const {products} = useSelector((state) => state.admin) 



  const filteredProducts = userSelected === "all" ? products : products.filter((item) => item.category === userSelected);
  const updateCategory = (category) => {
    setUserSelected(category)
  }


  useEffect(() => {

    // Change banner 
    const interval = setInterval(() => {setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);}, 4000);
    return () => clearInterval(interval); 
  }, []);



  return (
    <div className="home">
     {/* Slideshow Banner */}
      <div className="banner">
        <img src={bannerImages[currentBannerIndex]} alt={`Banner ${currentBannerIndex + 1}`} className="banner-image" />
      </div>
      <div className="categories">
        <div
          className="category-card" onClick={() => updateCategory("dog")} style={{ backgroundImage: `url("https://img.freepik.com/premium-photo/close-up-portrait-dog-against-clear-sky_1048944-21764405.jpg?w=740")`
          }} >Dogs</div>
        <div className="category-card" onClick={() => updateCategory("cat")} style={{ backgroundImage: `url("https://img.freepik.com/premium-photo/cat-with-yellow-background-that-sayscat_670382-24884.jpg")`
          }} >Cats</div>
          <div className="category-card" onClick={() => updateCategory("all")} style={{backgroundImage: `url(https://www.shutterstock.com/image-photo/portrait-cat-dog-front-bright-600nw-1927527212.jpg)`}}>Dog & Cat</div>
      </div>

      <ProductList selectedCategory={userSelected || "all"} />

    </div>
  );
}

export default Home;
