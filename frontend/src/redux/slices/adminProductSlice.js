import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`

// async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchProducts", async () => {
    
        const response = await axios.get(`${API_URL}/api/admin/products`, {
            headers: {
                Authorization: USER_TOKEN  // Include the token in the request headers
            }
        });
        return response.data; // Return the fetched products
});

// async thunk to create a new product
export const createProduct = createAsyncThunk("adminProducts/createProduct", async (productData) => {
    
        const response = await axios.post(`${API_URL}/api/admin/products`, productData, {
            headers: {
                Authorization: USER_TOKEN // Include the token in the request headers
            }
        });
        return response.data; // Return the created product
    
});

// async thunk to update a product by ID
export const updateProduct = createAsyncThunk("adminProducts/updateProduct", async ({ id , productData }) => {
    
        const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData, {
            headers: {
                Authorization: USER_TOKEN // Include the token in the request headers
            }
        });
        return response.data; // Return the updated product
    
});


// async thunk to delete a product 
export const deleteProduct = createAsyncThunk("adminProducts/deleteProduct", async (id) => {
    
         await axios.delete(`${API_URL}/api/products/${id}`, {
            headers: {
                Authorization: USER_TOKEN // Include the token in the request headers
            }
        });
        return { _id: id };; // Return the deleted product ID
    
});

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;                
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("Fetched Products: ", action.payload);
                
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(product => product._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload; // Update the product in the array
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Deleted Product ID: ", action.payload._id);
                console.log("Current Products: ", state.products);
                
                state.products = state.products.filter(product => product._id !== action.payload._id); // Remove the deleted product from the array

            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export default adminProductSlice.reducer;