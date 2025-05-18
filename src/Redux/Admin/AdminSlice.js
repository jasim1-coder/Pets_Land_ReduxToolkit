import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../../config/axiosConfig"
import { useDispatch } from "react-redux";



// const dispatch = useDispatch()

export const fetchOrders = createAsyncThunk(
    "admin/fetchOrders",
    async (_, { rejectWithValue }) => {
        try{
            const userId = localStorage.getItem("Id")
            if(!userId) return rejectWithValue("User ID not found");
            const response = await api.get('/Admin/all-orders')
            return response.data.data || []
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
            const userId = localStorage.getItem("Id")
            if(!userId) return rejectWithValue("User ID not found");
            const response = await api.get('/Admin/Get-All-Users')
            return response.data.data || []
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

            const response = await api.get('/Products/GetAllProducts')
            return response.data.data || []
        }catch(error){
            console.error("Error fetching Order:", error);
            return rejectWithValue(error.response?.data || "Error fetching products")
        }
    }
);



export const fetchProductsByQuery = createAsyncThunk(
  "products/fetchByQuery",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/Products/search?query=${query}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error searching:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



export const fetchProductsPurchased = createAsyncThunk(
  "admin/fetchProductsPurchased",
  async (_, { rejectWithValue }) => {
      try{
          const userId = localStorage.getItem("Id")
          if(!userId) return rejectWithValue("User ID not found");
          const response = await api.get('/Admin/total-products-purchased')
          return response.data
      }catch(error){
          console.error("Error fetching Order:", error);
          return rejectWithValue(error.response?.data || "Error fetching Total Product purchased")
      }
  }
);
export const fetchTotalRevenue = createAsyncThunk(
  "admin/fetchTotalRevenue",
  async (_, { rejectWithValue }) => {
      try{
          const userId = localStorage.getItem("Id")
          if(!userId) return rejectWithValue("User ID not found");
          const response = await api.get('/Admin/total-revenue')
          return response.data
      }catch(error){
          console.error("Error fetching Order:", error);
          return rejectWithValue(error.response?.data || "Error fetching Total Revenue")
      }
  }
);

export const addProduct = createAsyncThunk(
  "admin/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("Id");
      if (!userId) return rejectWithValue("User ID not found");

      const formData = new FormData();
      formData.append("Name", productData.name);
      formData.append("Description", productData.description);
      formData.append("categoryId", Number(productData.categoryId));
      formData.append("RP", productData.rp);
      formData.append("MRP", productData.mrp);
      formData.append("Stock", productData.stock);
      formData.append("Ingredients", productData.ingredients);
      formData.append("Seller", productData.seller);

      if (productData.image) {
        console.log(productData.image)
        formData.append("Image", productData.image);
            // dispatch(fetchProducts())
        
      } else {
        return rejectWithValue("Invalid image file");
      }

      const response = await api.post("/Products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // If required
        },
      });
// dispatch(fetchProducts())
      return response.data;

    } catch (error) {
      console.error("Error adding product:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to add product");
    }
  }
);




  
export const editProduct = createAsyncThunk(
  "admin/editProduct",
  async ({ id, updatedProduct }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      //  Only append fields that are updated (Partial Update)
      if (updatedProduct.name) formData.append("Name", updatedProduct.name);
      if (updatedProduct.description) formData.append("Description", updatedProduct.description);
      if (updatedProduct.categoryId) formData.append("categoryId", Number(updatedProduct.categoryId));
      if (updatedProduct.rp) formData.append("RP", Number(updatedProduct.rp));
      if (updatedProduct.mrp) formData.append("MRP", Number(updatedProduct.mrp));
      if (updatedProduct.stock) formData.append("Stock", Number(updatedProduct.stock));

      if (updatedProduct.ingredients) {
        if (Array.isArray(updatedProduct.ingredients)) {
          formData.append("Ingredients", updatedProduct.ingredients.join(","));
        } else {
          formData.append("Ingredients", updatedProduct.ingredients);
        }
      }

      if (updatedProduct.seller) formData.append("Seller", updatedProduct.seller);

      //  Only append new image if provided
      if (updatedProduct.image) {
        formData.append("Image", updatedProduct.image);
      }

      const response = await api.put(`/Admin/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, //  If required
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error editing product");
    }
  }
);


  
  export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/Admin/DeleteProduct/${productId}`);
      if (response.data.statusCode === 200) {
        return productId; 
          }
          else {
            return rejectWithValue(response.data.message || "Failed to delete product");
          }
        }
        catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting product');
    }
  });
  
  export const blockUser = createAsyncThunk(
    'admin/blockUser',
    async ({ userId }, { rejectWithValue }) => {
      try {
        const response = await api.put(`/Admin/Block-Or-Unblock-User?Id=${userId}`);
        
        // Ensure you extract only the success message, not the entire object
        return response.data.message; 
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error blocking/unblocking user');
      }
    }
  );
  
  export const updateOrderStatus = createAsyncThunk(
    "orders/updateStatus",
    async ({ orderId, newStatus }, { rejectWithValue }) => {
      try {
        const response = await api.put(`Admin/update-order-status?orderId=${orderId}&newStatus=${newStatus}`)
        dispatch(fetchOrders())
        dispatch(fetchFilteredOrders())
        return response.data; // Assuming backend returns updated order details
      } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
    }
  );

  // export const fetchFilteredOrders = createAsyncThunk(
  //   "orders/fetchFilteredOrders",
  //   async ({ userId, status, startDate, endDate }, { rejectWithValue }) => {
  //     try {
  //       const response = await api.get(`/Admin/filter-orders`, {
  //         params: { userId, status, startDate, endDate },
  //       });
  
  //       if (response.status !== 200) {
  //         throw new Error(response.data.message || "Failed to fetch orders");
  //       }
  
  //       return response.data.data; // Returns the order list
  //     } catch (error) {
  //       return rejectWithValue(error.response?.data?.message || error.message);
  //     }
  //   }
  // );


 export const fetchFilteredOrders = createAsyncThunk(
    "orders/fetchFilteredOrders",
    async ({ userId, status, startDate, endDate }, { rejectWithValue }) => {
      try {
        const params = {
          ...(userId !== null && { userId }),
          ...(status !== null && { status: Number(status) }), 
          ...(startDate && { startDate: new Date(startDate).toISOString().split("T")[0] }), // YYYY-MM-DD
          ...(endDate && { endDate: new Date(endDate).toISOString().split("T")[0] }), 
      };
        // dispatch(fetchFilteredOrders(params));
        
        
  
        console.log("Request Params:", params); // Debugging log
  
        const response = await api.get(`/Admin/filter-orders`, { params });
        console.log("API Response:", response.data); // 🔹 Log response

        if (response.status !== 200) {
          throw new Error(response.data.message || "Failed to fetch orders");
        }
  
        return response.data.data || []; // Returns the order list
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  
  
  export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting user');
    }
  });


  export const getProductsByCategory = createAsyncThunk(
    "products/getByCategory",
    async (categoryId, { rejectWithValue }) => {
      try {
        const response = await api.get(`/Products/GetProductByCategory?CategoryId=${categoryId}`);
  
        if (response.data.statusCode === 200) {
          return response.data.data; // Assuming the response contains the list of products
        }
  
        return rejectWithValue(response.data.message || "No items in such category");
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch products"
        );
      }
    }
  );

export const  adminSlice = createSlice({
    name:'admin',
    initialState:{
        orders:[],
        fiterdorders:[],
        users:[],
        products:[],
        filterdproducts:[],
        totalUsers:0,
        totalProducts:0,
        totalOrders:0,
        totalRevenue:0,
        totalProductPurchased:0,
        selectedCategory: 'all',

        recentOrders:[],
        searchResult:[],
    statusRevenue: "idle",
    usersStatus: "idle",
    ordersStatus: "idle",
    productsStatus: "idle",
    loading: false,

    error: null
    },
    reducers:{
        updatedCategory: (state,action) => {
            state.selectedCategory = action.payload
        },
        clearSearchResults: (state) => {
          state.searchResult = []; // Clear search results
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrders.pending, (state) => {
            state.ordersStatus = "loading";
        })
        .addCase(fetchOrders.fulfilled, (state,action) => {
            state.ordersStatus = "succeeded";
            state.orders = action.payload
            state.totalOrders = action.payload.length
            state.recentOrders = action.payload.slice(-5)
            // state.totalRevenue = action.payload.reduce(
            //     (total, order) => total + (order.totalPrice || 0),
            //     0
            // ); 
        })
        .addCase(fetchOrders.rejected, (state,action) => {
            state.ordersStatus = "failed";
            state.error = action.payload
        })
        .addCase(fetchUsers.pending, (state) => {
            state.usersStatus = "loading";
        })
        .addCase(fetchUsers.fulfilled, (state,action) => {
            state.usersStatus = "succeeded";
            state.users = action.payload
            state.totalUsers = action.payload.length
        })
        .addCase(fetchUsers.rejected, (state,action) => {
            state.usersStatus = "failed";
            state.error = action.payload
        })
        .addCase(fetchProducts.pending, (state) => {
            state.productsStatus = "loading";
        })
        .addCase(fetchProducts.fulfilled, (state,action) => {
            state.productsStatus = "succeeded";
            state.products = action.payload
            state.totalProducts = action.payload.length
        })
        .addCase(fetchProducts.rejected, (state,action) => {
            state.productsStatus = "failed";
            state.error = action.payload
        })
        .addCase(getProductsByCategory.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getProductsByCategory.fulfilled, (state, action) => {
          state.loading = false;
          state.filterdproducts = action.payload;
        })
        .addCase(getProductsByCategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
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
          })
        .addCase(fetchProductsPurchased.pending, (state) => {
          state.status = "loading";
      })
      .addCase(fetchProductsPurchased.fulfilled, (state,action) => {
          state.status = "succeeded";
          // state.products = action.payload
          state.totalProductPurchased = action.payload.data
      })
      .addCase(fetchProductsPurchased.rejected, (state,action) => {
          state.status = "failed";
          state.error = action.payload
      })
        .addCase(fetchTotalRevenue.pending, (state) => {
          state.statusRevenue = "loading";
      })
      .addCase(fetchTotalRevenue.fulfilled, (state,action) => {
          state.statusRevenue = "succeeded";

          // state.products = action.payload
          state.totalRevenue = action.payload.data
      })
      .addCase(fetchTotalRevenue.rejected, (state,action) => {
          state.statusRevenue = "failed";
          state.error = action.payload
      }).addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific order's status in state
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFilteredOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.fiterdorders = action.payload;
      })
      .addCase(fetchFilteredOrders.rejected, (state, action) => {
        state.loading = false;
        state.fiterdorders = [];
        state.error = action.payload;
      })
      .addCase(fetchProductsByQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = action.payload; // Store fetched products
      })
      .addCase(fetchProductsByQuery.rejected, (state, action) => {
        state.loading = false;
        state.searchResult = [];
        state.error = action.payload;})
    
      ;
    }
})
export const { updatedCategory,clearSearchResults  } = adminSlice.actions;
export default adminSlice.reducer;