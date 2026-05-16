import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", isVeg: false, lat: "", lng: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRestaurants = () => {
    setLoading(true);
    API.get("/v1/eats/stores")
      .then(({ data }) => setRestaurants(data.restaurants))
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRestaurants(); }, []);

  const deleteRestaurant = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await API.delete(`/v1/eats/stores/${id}`);
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/v1/eats/stores", {
        name: form.name,
        address: form.address,
        isVeg: form.isVeg,
        location: { type: "Point", coordinates: [parseFloat(form.lng) || 0, parseFloat(form.lat) || 0] },
        images: [{ public_id: "default", url: "/images/images.png" }],
      });
      setSuccess("Restaurant added successfully!");
      setForm({ name: "", address: "", isVeg: false, lat: "", lng: "" });
      setShowForm(false);
      fetchRestaurants();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add restaurant");
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Admin Dashboard</h3>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h2 style={{ color: "#078347" }}>{restaurants.length}</h2>
            <p className="mb-0">Total Restaurants</p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Restaurants</h5>
        <button className="btn" style={{ backgroundColor: "#078347", color: "white" }} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Restaurant"}
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <form onSubmit={submitHandler} className="card p-4 mb-4 shadow-sm" autoComplete="off">
          <h6 className="mb-3">New Restaurant</h6>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row">
            <div className="col-md-6 form-group">
              <label>Name</label>
              <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="col-md-6 form-group">
              <label>Address</label>
              <input type="text" className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="col-md-3 form-group">
              <label>Latitude</label>
              <input type="number" className="form-control" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="e.g. 28.6139" />
            </div>
            <div className="col-md-3 form-group">
              <label>Longitude</label>
              <input type="number" className="form-control" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="e.g. 77.2090" />
            </div>
            <div className="col-md-3 form-group d-flex align-items-end pb-2">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="isVeg" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} />
                <label className="form-check-label" htmlFor="isVeg">Pure Veg</label>
              </div>
            </div>
          </div>
          <button type="submit" className="btn" style={{ backgroundColor: "#078347", color: "white" }}>Add Restaurant</button>
        </form>
      )}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead style={{ backgroundColor: "#078347", color: "white" }}>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Veg</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length === 0 ? (
              <tr><td colSpan="5" className="text-center">No restaurants found</td></tr>
            ) : restaurants.map((r) => (
              <tr key={r._id}>
                <td>{r.name}</td>
                <td>{r.address}</td>
                <td>{r.ratings?.toFixed(1)}</td>
                <td>{r.isVeg ? "✅" : "❌"}</td>
                <td>
                  <Link to={`/admin/restaurants/${r._id}/fooditems`} className="btn btn-sm mr-2" style={{ backgroundColor: "#078347", color: "white" }}>
                    Manage Items
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteRestaurant(r._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
