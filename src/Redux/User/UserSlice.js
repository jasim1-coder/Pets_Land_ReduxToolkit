import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../config/axiosConfig";

// Fetch cart items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("Id");
      if (!userId) return [];
      const response = await api.get(`/Cart/GetCartItems`);
      return response.data.data || [];
    } catch (error) {
      console.log("Error fetching cart:", error);
      return rejectWithValue(error.response?.data?.message || "Error fetching cart");
    }
  }
);

export const clearAllCart = createAsyncThunk(
  "cart/clearCart",
  async (_,{dispatch,rejectWithValue}) => {
    try{
      const response = await api.delete('/Cart/RomeveAllItemsFromCart');
      toast.success(response.data.message)
      dispatch(fetchCart())
      return response.data
    }catch(error){
      toast.error(error.response.data.message)
      return rejectWithValue(error.response.data.message)
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/Cart/AddToCart?productId=${productId}`);
      toast.success(response.data.message);
      console.log("djfjsdofids")
      dispatch(fetchCart())

      return response.data.data || {};
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Remove product from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/Cart/DeleteProductFromCart?productId=${productId}`);
      toast.success(response.data.message);
      
      dispatch(fetchCart()); // Fetch updated cart

      return response.data.data || {};
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Increase quantity
export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/Cart/IncreaseQuantity?productId=${productId}`);
      toast.success(response.data?.message );
      
      dispatch(fetchCart()); // Refresh cart

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Failed to update quantity.");
    }
  }
);

// Decrease quantity
export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/Cart/DecreaseQuantity?productId=${productId}`);
      toast.success(response.data?.message);
      
      dispatch(fetchCart()); // Refresh cart

      return response.data;
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Failed to decrease quantity.");
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    login: false,
    search: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setLogin(state, action) {
      state.login = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    clearCart(state) {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload; // Ensure cart is updated correctly
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.cart = []
        state.error = action.payload;
      })
      .addCase(clearAllCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearAllCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = []; // Ensure cart is updated correctly
      })
      .addCase(clearAllCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // .addCase(addToCart.fulfilled, (state, action) => {
      //   state.cart = action.payload;
      // })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});



export const { setLogin, setSearch, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
