import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../config/axiosConfig";

// Fetch user addresses
export const fetchUserAddresses = createAsyncThunk(
  "address/fetchUserAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("Id");

      if (!userId) {
        return rejectWithValue("User not logged in.");
      }

      const response = await api.get(`/Address/GetAllAddress`);
      // console.log(response.data)

      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
    }
  }
);



// Add an address
export const addUserAddress = createAsyncThunk(
  "address/addUserAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("Id");

      if (!userId) {
        return rejectWithValue("User not logged in.");
      }

      const requestBody = { ...addressData, userId };
      const response = await api.post("/Address/AddAddress", requestBody);

      toast.success("Address added successfully");
      return response.data; // Assuming API returns the added address
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Delete an address
export const deleteUserAddress = createAsyncThunk(
  "address/deleteUserAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      if (!addressId) {
        return rejectWithValue("Address ID is required");
      }

      await api.delete(`/Address/DeleteAddress`, {
        params: { addressId },
      });

      toast.success("Address deleted successfully");
      return addressId; // Return deleted address ID for state update
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);


// Initial state
const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

// Address slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        console.log("Fetched Addresses:", action.payload); // Check API response

        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add address
      .addCase(addUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = [...state.addresses, action.payload]; // Add new address
      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete address
      .addCase(deleteUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (address) => address.id !== action.payload
        ); // Remove from state
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
