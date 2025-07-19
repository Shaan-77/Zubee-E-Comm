import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from "axios";

// Retrieve user info and token from localStorage

const userFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem('userInfo')) : null;

// check for an existing  guest Id in the localStorage or generate a new one

const initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state for the auth slice
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

// Async thunk for user login

export const loginUser = createAsyncThunk("auth/loginUser", async (userData,{rejectWithValue}) =>{
    try {
        
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData)

        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem('userToken', response.data.token);
        return response.data.user; // Return user data on successful login

    } catch (error) {
        return rejectWithValue(error.response.data);
        
    }
})


// Async thunk for user Registration

export const registerUser  = createAsyncThunk("auth/registerUser", async (userData,{rejectWithValue}) =>{
    try {
        
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData)

        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem('userToken', response.data.token);
        return response.data.user; // Return user data on successful login

    } catch (error) {
        return rejectWithValue(error.response.data);
        
    }
})


// Slice

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        logout : (state) =>{
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`; // Reset guestId on logout
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId); // Update guestId in localStorage

        },
        generateNewGuestId : (state) => {
            state.guestId = `guest_${new Date().getTime()}`; // Generate a new guestId
            localStorage.setItem("guestId", state.guestId); // Update guestId in localStorage
        }
    },
    extraReducers : (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Set user data on successful login
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set error message on failed login
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Set user data on successful registration
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set error message on failed registration
            });
    }
})
export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;

