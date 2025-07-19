import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; 
import productReducer from './slices/productsSlice'; // Assuming you have a productsSlice for product-related state
import cartReducer from './slices/cartSlice'; // Assuming you have a cartSlice for cart-related state
import checkoutReducer from './slices/checkoutSlice'; // Assuming you have a checkoutSlice for checkout-related state
import orderReducer from './slices/orderSlice'; // Assuming you have an orderSlice for order-related state
import adminReducer from './slices/adminSlice'; // Assuming you have an adminSlice for admin-related state  
import adminProductReducer from './slices/adminProductSlice'; // Assuming you have an adminProductSlice for admin product-related state 
import adminOrdersReducer from './slices/adminOrderSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    products : productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    order: orderReducer,
    admin: adminReducer, 
    adminProducts: adminProductReducer, 
    adminOrders : adminOrdersReducer,
  },
});

export default store;
