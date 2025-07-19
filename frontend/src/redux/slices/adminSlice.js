import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// fetch all users (admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {    
   
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}` // Include the token in the request headers
            }
        });
        return response.data; // Return the fetched users
   
});

// Add the create user action
export const addUser = createAsyncThunk("admin/addUser", async (userData, {rejectWithValue}) => {  
    try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, userData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}` // Include the token in the request headers
        }
    });
    return response.data.user; // Return the created user
    } catch (error) {
        return rejectWithValue(error.response.data);
        
    }
}); 

// Update user details
export const updateUser = createAsyncThunk("admin/updateUser", async ({ id, name , email, role }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {name , email, role}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}` // Include the token in the request headers
            }
        });
        return response.data.user; // Return the updated user
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


// Delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}` // Include the token in the request headers
            }
        });
        console.log("Deleted user response:", response.data);
        // return response.data; // Return the deleted user ID
         return userId; // ✅ Return just the ID instead of message
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                // console.log("Updated user:", action.payload);
                
                const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser; // Update the user in the list
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {                
                // Remove the user from the list
                // console.log(state.users);
                // console.log(action.payload);            
                
                state.users = state.users.filter(user => user._id !== action.payload);
                
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});


export default adminSlice.reducer;
