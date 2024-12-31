import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const fetchOrders = createAsyncThunk(
    "admin/fetchOrders",
    async (_, { rejectWithValue }) => {
        try{
            const userId = localStorage.getItem("id")
            if(!userId) return
            const response = await axios.get('http://localhost:3000/Orders')
            return response.data
        }catch(error){
            console.error("Error fetching Order:", error);
            return rejectWithValue(error.response?.data || "Error fetching Orders")
        }
    }
);
export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async (_, { rejectWithValue }) => {
        try{
            const userId = localStorage.getItem("id")
            if(!userId) return
            const response = await axios.get('http://localhost:3000/users')
            return response.data
        }catch(error){
            console.error("Error fetching Order:", error);
            return rejectWithValue(error.response?.data || "Error fetching Orders")
        }
    }
);
export const fetchProducts = createAsyncThunk(
    "admin/fetchProducts",
    async (_, { rejectWithValue }) => {
        try{
            const userId = localStorage.getItem("id")
            if(!userId) return
            const response = await axios.get('http://localhost:3000/product')
            return response.data
        }catch(error){
            console.error("Error fetching Order:", error);
            return rejectWithValue(error.response?.data || "Error fetching products")
        }
    }
);

export const addProduct = createAsyncThunk('admin/addProduct', async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/product', productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding product');
    }
  });
  
  export const editProduct = createAsyncThunk('admin/editProduct', async ({ id, updatedProduct }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:3000/product/${id}`, updatedProduct);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error editing product');
    }
  });
  
  export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/product/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting product');
    }
  });
  
  export const blockUser = createAsyncThunk('admin/blockUser', async ({ userId, isBlocked }, { rejectWithValue }) => {
    try {

      const updatedStatus = { blocked: !isBlocked };
      await axios.patch(`http://localhost:3000/users/${userId}`, updatedStatus);
      return { userId, isBlocked: !isBlocked };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error blocking/unblocking user');
    }
  });
  
  export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting user');
    }
  });

export const  adminSlice = createSlice({
    name:'admin',
    initialState:{
        orders:[],
        users:[],
        products:[],
        totalUsers:0,
        totalProducts:0,
        totalOrders:0,
        totalRevenue:0,
        selectedCategory: 'all',

        recentOrders:[],
    status: "idle",
    error: null
    },
    reducers:{
        updatedCategory: (state,action) => {
            state.selectedCategory = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrders.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchOrders.fulfilled, (state,action) => {
            state.status = "succeeded";
            state.orders = action.payload
            state.totalOrders = action.payload.length
            state.recentOrders = action.payload.slice(-5)
            state.totalRevenue = action.payload.reduce(
                (total, order) => total + (order.totalPrice || 0),
                0
            ); 
        })
        .addCase(fetchOrders.rejected, (state,action) => {
            state.status = "failed";
            state.error = action.payload
        })
        .addCase(fetchUsers.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchUsers.fulfilled, (state,action) => {
            state.status = "succeeded";
            state.users = action.payload
            state.totalUsers = action.payload.length
        })
        .addCase(fetchUsers.rejected, (state,action) => {
            state.status = "failed";
            state.error = action.payload
        })
        .addCase(fetchProducts.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchProducts.fulfilled, (state,action) => {
            state.status = "succeeded";
            state.products = action.payload
            state.totalProducts = action.payload.length
        })
        .addCase(fetchProducts.rejected, (state,action) => {
            state.status = "failed";
            state.error = action.payload
        })
        .addCase(addProduct.fulfilled, (state, action) => {
            state.products.push(action.payload);
            toast.success('Product added successfully');
          })
          .addCase(addProduct.rejected, (state, action) => {
            toast.error(action.payload);
          })
          // Edit Product
          .addCase(editProduct.fulfilled, (state, action) => {
            const index = state.products.findIndex((product) => product.id === action.payload.id);
            if (index !== -1) {
              state.products[index] = action.payload;
            }
            toast.success('Product updated successfully');
          })
          .addCase(editProduct.rejected, (state, action) => {
            toast.error(action.payload);
          })
          // Delete Product
          .addCase(deleteProduct.fulfilled, (state, action) => {
            state.products = state.products.filter((product) => product.id !== action.payload);
            toast.success('Product deleted successfully');
          })
          .addCase(deleteProduct.rejected, (state, action) => {
            toast.error(action.payload);
          })
          // Block/Unblock User
          .addCase(blockUser.fulfilled, (state, action) => {
            const { userId, isBlocked } = action.payload;
            const user = state.users.find((user) => user.id === userId);
            if (user) {
              user.blocked = isBlocked;
            }
            toast.success(isBlocked ? 'User blocked successfully' : 'User unblocked successfully');
          })
          .addCase(blockUser.rejected, (state, action) => {
            toast.error(action.payload);
          })
          // Delete User
          .addCase(deleteUser.fulfilled, (state, action) => {
            state.users = state.users.filter((user) => user.id !== action.payload);
            toast.success('User deleted successfully');
          })
          .addCase(deleteUser.rejected, (state, action) => {
            toast.error(action.payload);
          });
    }
})
export const { updatedCategory } = adminSlice.actions;
export default adminSlice.reducer;