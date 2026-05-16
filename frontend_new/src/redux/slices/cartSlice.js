import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], restaurant: null, loading: false, error: null },
  reducers: {
    cartRequest: (state) => { state.loading = true; },
    cartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload?.items || [];
      state.restaurant = action.payload?.restaurant || null;
    },
    cartFail: (state, action) => { state.loading = false; state.error = action.payload; },
    clearCart: (state) => { state.loading = false; state.items = []; state.restaurant = null; },
  },
});

export const { cartRequest, cartSuccess, cartFail, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
