import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createOrder } from "../redux/action/cartActions";
import { clearCart } from "../redux/slices/cartSlice";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if (!session_id) return;

    dispatch(createOrder(session_id))
      .then((order) => { setOrder(order); dispatch(clearCart()); })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return (
    <div className="wrapper">
      <div className="alert alert-danger">{error}</div>
      <Link to="/">Go Home</Link>
    </div>
  );

  return (
    <div className="text-center mt-5">
      <div style={{ fontSize: "4rem", color: "#078347" }}>✓</div>
      <h2 className="mt-3" style={{ color: "#078347" }}>Payment Successful!</h2>
      {order && (
        <div className="mt-3">
          <p>Order ID: <strong>{order._id}</strong></p>
          <p>Total: <strong>₹{order.finalTotal}</strong></p>
          <p>Status: <strong>{order.orderStatus}</strong></p>
        </div>
      )}
      <Link to="/eats/orders/me/myOrders" className="btn mt-3 mr-2" style={{ backgroundColor: "#078347", color: "white" }}>View Orders</Link>
      <Link to="/" className="btn mt-3" style={{ backgroundColor: "#be521f", color: "white" }}>Continue Shopping</Link>
    </div>
  );
};

export default PaymentSuccess;
