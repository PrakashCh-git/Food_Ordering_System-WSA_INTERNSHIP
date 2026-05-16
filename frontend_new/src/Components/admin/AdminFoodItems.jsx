import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";

const AdminFoodItems = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [foodItems, setFoodItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", price: "", description: "", stock: "", imageUrl: "" });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      API.get(`/v1/eats/stores/${restaurantId}`),
      API.get(`/v1/eats/items/${restaurantId}`),
    ])
      .then(([restRes, itemsRes]) => {
        setRestaurant(restRes.data.data);
        setFoodItems(itemsRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [restaurantId]);

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this food item?")) return;
    try {
      await API.delete(`/v1/eats/item/${id}`);
      setFoodItems((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/v1/eats/item", {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        stock: Number(form.stock),
        imageUrl: form.imageUrl || "/images/images.png",
        restaurant: restaurantId,
      });
      setSuccess("Food item added!");
      setForm({ name: "", price: "", description: "", stock: "", imageUrl: "" });
      setShowForm(false);
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add food item");
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-4">
        <button className="btn mr-3" style={{ backgroundColor: "#078347", color: "white" }} onClick={() => navigate("/admin")}>
          ← Back
        </button>
        <h4 className="mb-0">Food Items — {restaurant?.name}</h4>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">{foodItems.length} items</span>
        <button className="btn" style={{ backgroundColor: "#078347", color: "white" }} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Food Item"}
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <form onSubmit={submitHandler} className="card p-4 mb-4 shadow-sm" autoComplete="off">
          <h6 className="mb-3">New Food Item</h6>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row">
            <div className="col-md-6 form-group">
              <label>Name</label>
              <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="col-md-3 form-group">
              <label>Price (₹)</label>
              <input type="number" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="col-md-3 form-group">
              <label>Stock</label>
              <input type="number" className="form-control" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
            <div className="col-md-12 form-group">
              <label>Description</label>
              <input type="text" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="col-md-12 form-group">
              <label>Image URL (optional)</label>
              <input type="text" className="form-control" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <button type="submit" className="btn" style={{ backgroundColor: "#078347", color: "white" }}>Add Food Item</button>
        </form>
      )}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead style={{ backgroundColor: "#078347", color: "white" }}>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No food items found</td></tr>
            ) : foodItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <img src={item.images?.[0]?.url} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                </td>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>{item.stock}</td>
                <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.description}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteItem(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFoodItems;
