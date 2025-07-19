import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk("adminOders/fetchAllOrders", async (_, {rejectWithValue})=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Include the token in the request headers
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


// update order delivery status
export const updateOrderStatus = createAsyncThunk("adminOders/updateOrderStatus", async ({id, status}, {rejectWithValue})=>{
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`, {status}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Include the token in the request headers
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


// delete an order 
export const deleteOrder = createAsyncThunk("adminOders/deleteOrder", async (id, {rejectWithValue})=>{
    try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,  {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Include the token in the request headers
            },
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

const adminOrderSlice = createSlice({
    name : "adminOrders",
    initialState : {
        orders: [],
        totalOrders : 0,
        totalSales:0,
        loading: false,
        error: null,
    },
    reducers : {},
    extraReducers: (builder) =>{
        builder
        .addCase(fetchAllOrders.pending, (state) =>{
            // state.loading(true);
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllOrders.fulfilled, (state,action) =>{
            // state.loading(false);
            state.loading = false;
            console.log("Fetched orders:", action.payload);
            
            state.orders = action.payload;
            state.totalOrders = action.payload.length;
            console.log(state.orders);
            

            // calculate total sales
            const totalSales = action.payload.reduce((acc, order)=>{
                return acc + order.totalPrice;
            },0)
            state.totalSales = totalSales
        })
        .addCase(fetchAllOrders.rejected, (state,action) =>{
            // state.loading(false);
            state.loading = false;
            state.error = action.payload.message;
        })
        .addCase(updateOrderStatus.fulfilled, (state,action) =>{
            // const updatedOrder = action.payload;
             const updatedOrder = action.payload.order;
            console.log("Updated order:", updatedOrder);
            
            const orderIndex = state.orders.findIndex(
                (order) => order._id === updatedOrder._id
            );
            if(orderIndex !== -1){
                state.orders[orderIndex] = updatedOrder;
            }
        })
        .addCase(deleteOrder.fulfilled, (state, action)=>{
            state.orders = state.orders.filter(
                (order) => order._id !== action.payload 
            )
        })
    } 
})

export default adminOrderSlice.reducer