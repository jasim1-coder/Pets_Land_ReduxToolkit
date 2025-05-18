import { configureStore } from "@reduxjs/toolkit";
import userReducer from './User/UserSlice'
import adminReducer from './Admin/AdminSlice'
import addressReducer from './Address/AddressSlice'
import orderReducer from './Order/OrderSlice'
import wishlistReducer from "./Wishlist/WishListSlice";

export default configureStore({
    reducer:{
        cart : userReducer,
        admin : adminReducer,
        address : addressReducer,
        order : orderReducer,
        wishlist : wishlistReducer

    },
})
