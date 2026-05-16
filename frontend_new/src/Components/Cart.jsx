import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, deleteCartItem, processPayment } from "../redux/action/cartActions";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurant, loading } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) { navigate("/users/login"); return; }
    dispatch(getCart());
  }, [isAuthenticated]);

  const itemsTotal = items.reduce((sum, i) => sum + i.foodItem.price * i.quantity, 0);
  const deliveryCharge = 55;
  const total = itemsTotal + deliveryCharge;

  const handleCheckout = () => {
    dispatch(processPayment(items));
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Cart {restaurant && <small className="text-muted" style={{ fontSize: "1rem" }}>from {restaurant.name}</small>}</h2>

      {items.length === 0 ? (
        <div className="text-center mt-5">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn" style={{ backgroundColor: "#078347", color: "white" }}>Browse Restaurants</Link>
        </div>
      ) : (
        <div className="row">
          {/* Cart Items */}
          <div className="col-md-8">
            {items.map((item) => (
              <div key={item.foodItem._id} className="cart-item d-flex align-items-center justify-content-between border-bottom pb-3">
                <div className="d-flex align-items-center">
                  <img src={item.foodItem.images?.[0]?.url} alt={item.foodItem.name} id="food_image" className="mr-3 rounded" style={{ width: "60px", height: "60px", objectFit: "cover" }} />
                  <div>
                    <p className="mb-0 font-weight-bold">{item.foodItem.name}</p>
                    <p className="mb-0 text-muted">₹{item.foodItem.price}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="stockCounter d-inline">
                    <button className="btn minus" onClick={() => item.quantity > 1
                      ? dispatch(updateCartItem(user._id, item.foodItem._id, item.quantity - 1))
                      : dispatch(deleteCartItem(user._id, item.foodItem._id))
                    }>-</button>
                    <input type="number" className="form-control d-inline" value={item.quantity} readOnly />
                    <button className="btn plus" onClick={() => dispatch(updateCartItem(user._id, item.foodItem._id, item.quantity + 1))}>+</button>
                  </div>

                  <p className="mb-0 ml-3" id="card_item_price">₹{item.foodItem.price * item.quantity}</p>

                  <button id="delete_cart_item" className="ml-3" onClick={() => dispatch(deleteCartItem(user._id, item.foodItem._id))}>
                    <i className="fa fa-trash"></i> ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="col-md-4">
            <div id="order_summary">
              <h4>Order Summary</h4>
              <hr />
              <p>Subtotal: <span className="order-summary-values">₹{itemsTotal}</span></p>
              <p>Delivery: <span className="order-summary-values">₹{deliveryCharge}</span></p>
              <hr />
              <p><strong>Total: <span className="order-summary-values">₹{total}</span></strong></p>
              <button id="checkout_btn" className="btn btn-block" onClick={handleCheckout} disabled={loading}>
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
