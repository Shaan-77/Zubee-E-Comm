import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from "axios";


//  Async thunk to fetch products by Collection and optional Filter

export const fetchProductsByFilters = createAsyncThunk("products/fetchByFilters", async({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,}

)=> {
    const query = new URLSearchParams()
    if(collection) query.append("collection" , collection)
    if(size) query.append("size" , size)
    if(color) query.append("color" , color)
    if(gender) query.append("gender" , gender)
    if(minPrice) query.append("minPrice" , minPrice)
    if(maxPrice) query.append("maxPrice" , maxPrice)
    if(sortBy) query.append("sortBy" , sortBy)
    if(search) query.append("search" , search)
    if(category) query.append("category" , category)
    if(material) query.append("material" , material)
    if(brand) query.append("brand" , brand)
    if(limit) query.append("limit" , limit)

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
    
    );
    return response.data; // Return the fetched products
}
);

// Asyn thunk to fecth a single product by ID
export const fetchProductDetails = createAsyncThunk("products/fetchProductDetails", async (productId) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`);
    // console.log(response.data);
    
    return response.data; // Return the fetched product
    
    
});

// Async thunk to update a product by ID
export const updateProduct = createAsyncThunk("products/updateProduct", async ({ productId, productData }) => {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`, productData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Include the token in the request headers
        },
    });
    return response.data; // Return the updated product
}) 


// Async thunk to update a product by ID
export const fetchSimilarProducts = createAsyncThunk("products/fetchSimilarProducts", async (productId) => {
   try {        
     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${productId.id}`);
     return response.data; // Return the fetched similar products
   } catch (error) {
    console.log(error);    
   }
});



export const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        selectedProduct: null,
        similarProducts: [],
        loading: false,
        error: null,
        filters : {
            collection: "",
            size: "",
            color: "",
            category:"",
            gender : "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            material: "",
            brand: "",
           
        },
    },
    
    reducers: {
        setFilters : (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },
        ClearFilters: (state) => {
            state.filters = {
                collection: "",
                size: "",
                color: "",
                category: "",
                gender: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
                material: "",
                brand: "",
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsByFilters.pending, (state) => {
                state.loading = true;
                state.error =  null;
            })
            .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
                state.loading = false;                
                state.products = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchProductsByFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error =  null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error =  null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const updateProduct = action.payload;
                const index = state.products.findIndex(product => product._id === updateProduct._id);   
                if(index !== -1) {
                    state.products[index] = updateProduct; // Update the product in the products array
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchSimilarProducts.pending, (state) => {
                state.loading = true;
                state.error =  null;
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.similarProducts = action.payload;
            })
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { setFilters, ClearFilters } = productsSlice.actions;
export default productsSlice.reducer
