import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Thunks for async actions
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) return [];
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      return response.data.cart || [];
    } catch (error) {
      console.error("Error fetching cart:", error);
      return rejectWithValue(error.response?.data || "Error fetching cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product, { getState, rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("Please log in to add items to your cart.");
        return rejectWithValue("User not logged in");
      }
      const { cart } = getState().cart;
      const existProdInd = cart.findIndex((item) => item.id === product.id);
      if (existProdInd >= 0) {
        toast("This product is already in your cart.");
        return cart;
      }
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      await axios.patch(`http://localhost:3000/users/${userId}`, { cart: updatedCart });
      toast.success("Added to cart");
      return updatedCart;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return rejectWithValue(error.response?.data || "Error adding to cart");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (product, { getState, rejectWithValue }) => {
    try {
      console.log("Product:", product);
      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("Please log in to manage your cart.");
        return rejectWithValue("User not logged in");
      }
      const { cart } = getState().cart;
      const updatedCart = cart.filter((item) => item.id !== product.id);
      await axios.patch(`http://localhost:3000/users/${userId}`, { cart: updatedCart });
      toast.success("Product removed from cart!");
      return updatedCart;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return rejectWithValue(error.response?.data || "Error removing from cart");
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (product, { getState, rejectWithValue }) => {
    try {

      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("Please log in to manage your cart.");
        return rejectWithValue("User not logged in");
      }

      const { cart } = getState().cart;
      console.log("Product:", product);
      console.log("Cart:", cart);
      const productIndex = cart.findIndex((item) => item.id === product.id);

      if (productIndex === -1) {
        toast.error("Product not found in cart.");
        return rejectWithValue("Product not found");
      }

      const cartItem = cart[productIndex];
      const response = await axios.get(`http://localhost:3000/product/${product.id}`);
      const fetchedProduct = response.data;

      if (cartItem.quantity + 1 > fetchedProduct.stock) {
        toast.error("Insufficient stock.");
        return rejectWithValue("Insufficient stock");
      }

      const updatedCart = cart.map((item, index) =>
        index === productIndex ? { ...item, quantity: item.quantity + 1 } : item
      );

      await axios.patch(`http://localhost:3000/users/${userId}`, { cart: updatedCart });
      toast.success("Quantity updated.");
      return updatedCart;
    } catch (error) {
      console.error("Error increasing quantity:", error);
      return rejectWithValue(error.response?.data || "Error increasing quantity");
    }
  }
);


export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (product, { getState, rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("Please log in to manage your cart.");
        return rejectWithValue("User not logged in");
      }

      
      const { cart } = getState().cart;
      const productIndex = cart.findIndex((item) => item.id === product.id);

      if (productIndex === -1) {
        toast.error("Product not found in cart.");
        return rejectWithValue("Product not found");
      }

      const cartItem = cart[productIndex];
      if (cartItem.quantity <= 1) {
        toast.error("Cannot decrease quantity below 1.");
        return rejectWithValue("Minimum quantity reached");
      }

      const updatedCart = cart.map((item, index) =>
        index === productIndex ? { ...item, quantity: item.quantity - 1 } : item
      );

      await axios.patch(`http://localhost:3000/users/${userId}`, { cart: updatedCart });
      toast.success("Quantity updated.");
      return updatedCart;
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      return rejectWithValue(error.response?.data || "Error decreasing quantity");
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
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Error fetching cart");
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Error adding to cart");
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Error removing from cart");
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(increaseQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Error increasing quantity");
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(decreaseQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Error decreasing quantity");
      });
  },
});

export const { setLogin, setSearch, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
