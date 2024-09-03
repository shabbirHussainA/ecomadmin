// STODO underestand Map 
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    loading: false,
    error: false,
};
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
/**
 * Adds an item to the cart. If the item already exists in the cart, its quantity is incremented by 1.
 * If the item does not exist, it is added to the cart with a quantity of 1.
 *
 * @param {Object} state - The current state of the cart.
 * @param {Object} action - The action object containing the payload.
 * @param {Object} action.payload - The payload of the action.
 * @param {string} action.payload.productId - The ID of the product to add to the cart.
 */
addCart: (state, action) => {
    const existingItem = state.items.find(item => item.productId === action.payload.productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.items.push({ productId: action.payload.productId, quantity: 1 });
    }
},
removeCart: (state, action) =>{
    const existingItem = state.items.find(item => item.productId === action.payload.productId);
    if(existingItem) existingItem.quantity -= 1;
},
clearCart:(state,action) =>{
  state.items = ([]);
},
        
/**
 * Adds fetched cart items to the state.
 *
 * This function ensures that the payload is an array of items and processes each item
 * to either add it to the cart or update the existing item in the cart.
 *
 * @param {Object} state - The current state of the cart.
 * @param {Object} action - The action object containing the payload.
 * @param {Array|Object} action.payload - The fetched cart items, either as an array or a single item.
 */
addFetchedCart: (state, action) => {
    // Ensure the payload is an array by converting action.payload into an array
    const fetchedItems = Array.isArray(action.payload) ? action.payload : [action.payload];
  
    // Create a map of existing items for efficient lookup with key value pair
    const existingItemsMap = new Map(state.items.map(item => [item._id, item]));
  
    // Process fetched items
    fetchedItems.forEach(fetchedItem => {
      const existingItem = existingItemsMap.get(fetchedItem._id);
  
      if (!existingItem) {
        // If the item doesn't exist in the cart, add it
        state.items.push({ ...fetchedItem, quantity: fetchedItem.quantity || 1 });
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
          
    },
});

// Action creators are generated for each case reducer function
export const { addCart,addFetchedCart,removeCart,clearCart } = cartSlice.actions;

export default cartSlice.reducer;
