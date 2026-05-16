import API from "../../utils/api";
import { cartRequest, cartSuccess, cartFail, clearCart } from "../slices/cartSlice";

export const getCart = () => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await API.get("/v1/eats/cart/get-cart");
    dispatch(cartSuccess(data.data));
  } catch {
    dispatch(cartFail(null)); // no cart is not an error
  }
};

export const addToCart = (userId, foodItemId, restaurantId, quantity = 1) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await API.post("/v1/eats/cart/add-to-cart", { userId, foodItemId, restaurantId, quantity });
    dispatch(cartSuccess(data.cart));
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || error.message));
  }
};

export const updateCartItem = (userId, foodItemId, quantity) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await API.post("/v1/eats/cart/update-cart-item", { userId, foodItemId, quantity });
    dispatch(cartSuccess(data.cart));
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || error.message));
  }
};

export const deleteCartItem = (userId, foodItemId) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await API.delete("/v1/eats/cart/delete-cart-item", { data: { userId, foodItemId } });
    if (data.message === "Cart deleted") dispatch(clearCart());
    else dispatch(cartSuccess(data.cart));
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || error.message));
  }
};

export const processPayment = (items) => async (dispatch) => {
  try {
    const { data } = await API.post("/v1/payment/process", { items });
    window.location.href = data.url;
  } catch (error) {
    alert(error.response?.data?.message || "Payment failed");
  }
};

export const createOrder = (session_id) => async () => {
  const { data } = await API.post("/v1/eats/orders/new", { session_id });
  return data.order;
};
