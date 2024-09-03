import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  products: [],
  filterProducts: [],
  searchText:'',
  loading: false,
  error: false,

};

// Async thunk to fetch all products
export const getAllProducts = createAsyncThunk('products/getAll', async () => {
  const res = await axios.get('/api/products');
  return res.data;
});

// Product slice
export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      // Immer will handle the mutation
      const existingItem = state.products.find(item => item._id === action.payload._id);
      if (existingItem) {
          existingItem.quantity += 1;
      } else {
          state.products.push({ ...action.payload, quantity: 1 });
      }
    },
    //searching functionality from the products
    searching :(state,action) => {
      state.searchText = action.payload
     state.searchText !==''? state.filterProducts = [...state.products].filter((curelem)=>(
          curelem.title.toLowerCase().includes(state.searchText)
      )):state.filterProducts = [...state.products]
     
  },
  },
  //extra reducer are used to fetch getallProducts method
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filterProducts = action.payload;
      })
      .addCase(getAllProducts.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

// Action creators are generated for each case reducer function
export const { addProduct,searching } = productSlice.actions;

export default productSlice.reducer;
