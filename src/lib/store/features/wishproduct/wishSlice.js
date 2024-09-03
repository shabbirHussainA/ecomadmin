import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  wishProduct:[],
  loading: false,
  error: false,
};

// Product slice
export const wishSlice = createSlice({
  name: 'wish',
  initialState,
  reducers: {
    //this adds single product at a time
    addWish: (state, action) => {
      const existingItem = state.wishProduct.find(item => item.productId === action.payload.productId);
      if (existingItem) {
          existingItem.quantity += 1;
      } else {
          state.wishProduct.push({ productId: action.payload.productId, quantity: 1 });
      }
      
  },
  removeWish: (state, action) =>{
      const existingItem = state.wishProduct.find(item => item.productId === action.payload.productId);
      if(existingItem) existingItem.quantity -= 1;
  },
  clearWish:(state,action) =>{
    state.items = ([]);
  },
  //this is used to add multiple products at once 
  addFetchedWish: (state, action) => {
    // Ensure the payload is an array
    const fetchedItems = Array.isArray(action.payload) ? action.payload : [action.payload];
  
    // Create a map of existing items for efficient lookup
    const existingItemsMap = new Map(state.wishProduct.map(item => [item._id, item]));
  
    // Process fetched items
    fetchedItems.forEach(fetchedItem => {
      const existingItem = existingItemsMap.get(fetchedItem._id);
  
      if (!existingItem) {
        // If the item doesn't exist in the cart, add it
        state.wishProduct.push({ ...fetchedItem, quantity: fetchedItem.quantity || 1 });
      } else {
        // If the item already exists, update it only if necessary
        if (fetchedItem.quantity !== undefined && fetchedItem.quantity !== existingItem.quantity) {
          existingItem.quantity = fetchedItem.quantity;
        }
        // Update other properties if needed
        Object.keys(fetchedItem).forEach(key => {
          if (key !== 'quantity' && fetchedItem[key] !== existingItem[key]) {
            existingItem[key] = fetchedItem[key];
          }
        });
      }
    });
  }
  }
});

// Action creators are generated for each case reducer function
export const { addWish,addFetchedWish,removeWish,clearWish } = wishSlice.actions;

export default wishSlice.reducer;
