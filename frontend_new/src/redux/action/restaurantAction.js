import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"

export const getRestaurants = createAsyncThunk(
  "restaurants/getRestaurants",
  async (keyword = "", { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/v1/eats/stores?keyword=${keyword}`)
      console.log("Fetched restaurants", data)
      return {
        restaurants: data.restaurants,
        count: data.count,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)
