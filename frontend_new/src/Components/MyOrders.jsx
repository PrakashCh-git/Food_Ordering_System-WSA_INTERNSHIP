import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../utils/api";

const MyOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate("/users/login"); return; }
    API.get("/v1/eats/orders/me/myOrders")
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) return <div className="loader"></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center mt-5">
          <p>No orders yet.</p>
          <Link to="/" className="btn" style={{ backgroundColor: "#078347", color: "white" }}>Order Now</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead style={{ backgroundColor: "#078347", color: "white" }}>
              <tr>
                <th>Order ID</th>
                <th>Restaurant</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><small>{order._id}</small></td>
                  <td>{order.restaurant?.name || "—"}</td>
                  <td>
                    {order.orderItems.map((item) => (
                      <div key={item.fooditem}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>₹{order.finalTotal}</td>
                  <td>
                    <span style={{ color: order.orderStatus === "Delivered" ? "#078347" : "#be521f", fontWeight: "bold" }}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
