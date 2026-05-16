import React, { useEffect } from "react";
import { sortByRatings, sortByReviews, toggleVegOnly } from "../redux/slices/restaurantSlice";
import { getRestaurants } from "../redux/action/restaurantAction";
import Restaurant from "./Restaurant";
import Loader from "./layout/Loader";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import CountRestaurant from "./CountRestaurant";
import { useParams } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const { loading: restaurantsLoading, error: restaurantsError, restaurants, showVegOnly } =
    useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(getRestaurants(keyword));
  }, [dispatch, keyword]);

  return (
    <>
      <CountRestaurant />

      {restaurantsLoading ? (
        <Loader />
      ) : restaurantsError ? (
        <Message variant="danger">{restaurantsError}</Message>
      ) : (
        <section>
          <div className="sort">
            <button className="sort_veg p-3" onClick={() => dispatch(toggleVegOnly())}>
              {showVegOnly ? "Show All" : "Pure Veg"}
            </button>
            <button className="sort_rev p-3" onClick={() => dispatch(sortByReviews())}>
              Sort By Reviews
            </button>
            <button className="sort_rate p-3" onClick={() => dispatch(sortByRatings())}>
              Sort By Ratings
            </button>
          </div>

          <div className="row mt-4">
            {restaurants?.length > 0 ? (
              restaurants.map((restaurant) =>
                !showVegOnly || restaurant.isVeg ? (
                  <Restaurant key={restaurant._id} restaurant={restaurant} />
                ) : null
              )
            ) : (
              <Message variant="info">No restaurants Found.</Message>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
