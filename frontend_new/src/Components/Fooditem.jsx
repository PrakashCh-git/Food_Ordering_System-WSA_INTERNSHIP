import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCartItem, deleteCartItem } from "../redux/action/cartActions";

const Fooditem = ({ fooditem, restaurant }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  const cartItem = items.find((i) => i.foodItem._id === fooditem._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const addToCartHandler = () => {
    if (!user) { alert("Please login to add items to cart"); return; }
    dispatch(addToCart(user._id, fooditem._id, restaurant, 1));
  };

  const increaseQty = () => {
    if (quantity < fooditem.stock)
      dispatch(updateCartItem(user._id, fooditem._id, quantity + 1));
  };

  const decreaseQty = () => {
    if (quantity > 1) dispatch(updateCartItem(user._id, fooditem._id, quantity - 1));
    else dispatch(deleteCartItem(user._id, fooditem._id));
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto"
          src={fooditem.images?.[0]?.url || "/images/placeholder.png"}
          alt={fooditem.name}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{fooditem.name}</h5>
          <p className="fooditem_des">{fooditem.description}</p>
          <p className="card-text">
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
            {fooditem.price}
          </p>

          {quantity === 0 ? (
            <button
              type="button"
              id="cart_btn"
              className="btn btn-primary mt-2"
              disabled={fooditem.stock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          ) : (
            <div className="stockCounter d-flex align-items-center mt-2">
              <button className="btn btn-danger" onClick={decreaseQty}>-</button>
              <input
                type="number"
                className="form-control text-center mx-2"
                value={quantity}
                readOnly
                style={{ width: "60px" }}
              />
              <button className="btn btn-primary" onClick={increaseQty}>+</button>
            </div>
          )}

          <hr />
          <p>
            Status:{" "}
            <span className={fooditem.stock > 0 ? "greenColor" : "redColor"}>
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;
