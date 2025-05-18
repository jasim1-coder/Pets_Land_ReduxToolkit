import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../config/axiosConfig"; // Axios instance

// 1️⃣ Create Order
export const createOrder = createAsyncThunk(
    "order/createOrder",
    async ({ totalPrice, addressId }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/Order/CreateOrder?price=${totalPrice}`, { addressId });
        toast.success(response.data?.message || "Order created successfully.");
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create order.");
        return rejectWithValue(error.response?.data?.message || "Failed to create order.");
      }
    }
  );

  export const fetchOrders = createAsyncThunk(
    "order/fetchOrders",
    async (_, { rejectWithValue }) => {
        try{
            const userId = localStorage.getItem("Id")
            if(!userId) return rejectWithValue("User ID not found");
            const response = await api.get('/Order/Get-order-details')
            return response.data.data || []
        }catch(error){
            console.error("Error fetching Order:", error);
            return rejectWithValue(error.response?.data || "Error fetching Orders")
        }
    }
);



// 2️⃣ Make Razorpay Payment
export const makeRazorPayment = createAsyncThunk(
  "order/makeRazorPayment",
  async ({ orderId, paymentId, signature }, { rejectWithValue }) => {
    try {
      const response = await api.post("/Order/MakeRazorPayment", {
        orderId,
        paymentId,
        signature,
      });

      toast.success(response.data?.message || "Payment successful.");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed.");
      return rejectWithValue(error.response?.data?.message || "Payment failed.");
    }
  }
);

// 3️⃣ Fetch Order Details
export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/Order/GetOrderDetails?orderId=${orderId}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order details.");
    }
  }
);

// Slice Definition
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderData: null,
    paymentStatus: null,
    userOrder:[],
    orderDetails: null,
    loading: false,
    error: null,
    userOrderStatus:"idle"
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.pending, (state) => {
      state.userOrderStatus = "loading";
  })
  .addCase(fetchOrders.fulfilled, (state,action) => {
      state.userOrderStatus = "succeeded";
      state.userOrder = action.payload
  })
  .addCase(fetchOrders.rejected, (state,action) => {
      state.userOrderStatus = "failed";
      state.error = action.payload
  })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Make Razor Payment
      .addCase(makeRazorPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(makeRazorPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload;
      })
      .addCase(makeRazorPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
