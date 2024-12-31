import { configureStore } from "@reduxjs/toolkit";
import userReducer from './User/UserSlice'
import adminReducer from './Admin/AdminSlice'

export default configureStore({
    reducer:{
        cart : userReducer,
        admin : adminReducer
    },
})
