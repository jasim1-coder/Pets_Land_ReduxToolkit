import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../config/axiosConfig";

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async (_, { rejectWithValue }) => {
      try {
        const userId = localStorage.getItem("Id");  // Get userId from local storage
        if (!userId) {
          return rejectWithValue("User ID is missing. Cannot fetch wishlist.");
        }
  
        const response = await api.get(`/WishList/GetWishList?UserId=${userId}`); // Pass userId
        return response.data.data || []; // Extract products from response
      } catch (error) {
        // toast.error(error.response.data.message);
        return rejectWithValue(error.response?.data?.message || "Error fetching wishlist");

      }
    }
  );
  
  export const toggleWishlist = createAsyncThunk(
    "wishlist/toggleWishlist",
    async (productId, { dispatch, rejectWithValue }) => {
      try {
        // Make API request to toggle wishlist
        const response = await api.post(`/WishList/AddOrRemoveFromWishList?ProductId=${productId}`);
  
        toast.success(response.data.message);
  
        // Refetch updated wishlist after toggling
        dispatch(fetchWishlist());
  
        return productId; // Return productId for frontend state update
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  );
  

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearWishlist(state) {
      state.wishlist = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.wishlist = [];
        state.error = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const productId = action.meta.arg; // Ensure productId is used
        state.wishlist = state.wishlist.filter((item) => item.id !== productId);
    
        // Refetch wishlist if last item is removed
        if (state.wishlist.length === 0) {
            return; // Forces UI re-render
        }
    });
    
      
        // if (existingIndex !== -1) {
        //   // If product exists, remove it (wishlist toggle)
        //   state.wishlist.splice(existingIndex, 1);
        // } else {
        //   // If product doesn't exist, refetch full list
        //   dispatch(fetchWishlist());
        // }
    
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
