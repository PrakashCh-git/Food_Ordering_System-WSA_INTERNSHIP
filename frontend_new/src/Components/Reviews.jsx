import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../utils/api";

const StarRating = ({ value, onChange, readOnly = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "inline-flex", gap: "4px", cursor: readOnly ? "default" : "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ fontSize: "1.6rem", color: (hovered || value) >= star ? "#f8ce0b" : "#ccc" }}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => !readOnly && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const Reviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [reviews, setReviews] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReviews = () => {
    API.get(`/v1/eats/stores/${id}/reviews`)
      .then(({ data }) => setReviews(data.reviews))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    API.get(`/v1/eats/stores/${id}`)
      .then(({ data }) => setRestaurant(data.data))
      .catch(() => {});
    fetchReviews();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/users/login"); return; }
    if (rating === 0) { setError("Please select a rating"); return; }
    setError("");
    setSubmitting(true);
    try {
      await API.post(`/v1/eats/stores/${id}/reviews`, { rating, comment });
      setSuccess("Review submitted successfully!");
      setRating(0);
      setComment("");
      fetchReviews();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteHandler = async (reviewId) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await API.delete(`/v1/eats/stores/${id}/reviews/${reviewId}`);
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) return <div className="loader"></div>;

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button className="btn mr-3" style={{ backgroundColor: "#078347", color: "white" }} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div>
          <h3 className="mb-0">{restaurant?.name}</h3>
          <div className="d-flex align-items-center mt-1">
            <StarRating value={Math.round(avgRating)} readOnly />
            <span className="ml-2 text-muted">{avgRating} out of 5 ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Submit Review Form */}
        <div className="col-md-4 mb-4">
          <div className="shadow-sm p-4 rounded">
            <h5 className="mb-3">{isAuthenticated ? "Write a Review" : "Login to Review"}</h5>

            {!isAuthenticated ? (
              <button className="btn btn-block" style={{ backgroundColor: "#078347", color: "white" }} onClick={() => navigate("/users/login")}>
                Login to Write a Review
              </button>
            ) : (
              <form onSubmit={submitHandler}>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                {success && <div className="alert alert-success py-2">{success}</div>}

                <div className="form-group">
                  <label>Your Rating</label>
                  <div><StarRating value={rating} onChange={setRating} /></div>
                </div>

                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-block" style={{ backgroundColor: "#078347", color: "white" }} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="col-md-8">
          <h5 className="mb-3">All Reviews</h5>
          {reviews.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p style={{ fontSize: "3rem" }}>💬</p>
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="card mb-3 p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-center mb-1">
                      <div className="avatar mr-2" style={{ width: "36px", height: "36px", backgroundColor: "#078347", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
                        {review.name?.charAt(0).toUpperCase()}
                      </div>
                      <strong>{review.name}</strong>
                    </div>
                    <StarRating value={review.rating} readOnly />
                  </div>
                  {user && review.user && review.user.toString() === user._id && (
                    <button
                      className="btn btn-sm"
                      style={{ color: "red", border: "none", background: "none" }}
                      onClick={() => deleteHandler(review._id)}
                    >
                      ✕ Delete
                    </button>
                  )}
                </div>
                <p className="mt-2 mb-0">{review.Comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
