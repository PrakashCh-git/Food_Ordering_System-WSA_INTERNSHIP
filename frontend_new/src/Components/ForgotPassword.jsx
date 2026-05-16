import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword } from "../redux/action/userActions";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <div className="wrapper">
      <form onSubmit={submitHandler} className="shadow-lg">
        <h1 className="mb-3">Forgot Password</h1>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div className="form-group">
          <label htmlFor="email_field">Enter your registered email</label>
          <input
            type="email"
            id="email_field"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-block py-3" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Email"}
        </button>

        <Link to="/users/login" className="float-right mt-3">
          Back to Login
        </Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
