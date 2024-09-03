//this is the redux store
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import productReducer from './features/product/productSlice'
import wishReducer from './features/wishproduct/wishSlice'

/**
 * Creates and configures the Redux store with the specified reducers.
 *
 * @returns {object} The configured Redux store.
 */
export const makeStore = () => { // the store will be re initiated every time the route is changed but it will not change the initial state within it
  return configureStore({
    reducer: {
      cart: cartReducer,
      product: productReducer,
      wish: wishReducer
    },
  });
}