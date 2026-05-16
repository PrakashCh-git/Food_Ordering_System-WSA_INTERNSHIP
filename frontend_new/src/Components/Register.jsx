import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../redux/action/userActions";
import { clearErrors } from "../redux/slices/userSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("/images/images.png");
  const [avatar, setAvatar] = useState("/images/images.png");

  useEffect(() => {
    dispatch(clearErrors());
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (avatar !== "/images/images.png") payload.avatar = avatar;
    dispatch(register(payload));
  };

  return (
    <div className="wrapper">
      <form onSubmit={submitHandler} className="shadow-lg" autoComplete="off">
        <h1 className="mb-3">Register</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label htmlFor="name_field">Name</label>
          <input
            type="text"
            id="name_field"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email_field">Email</label>
          <input
            type="email"
            id="email_field"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={onChange}
            autoComplete="new-email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone_field">Phone Number</label>
          <input
            type="text"
            id="phone_field"
            name="phoneNumber"
            className="form-control"
            value={formData.phoneNumber}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password_field">Password</label>
          <input
            type="password"
            id="password_field"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={onChange}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password_confirm_field">Confirm Password</label>
          <input
            type="password"
            id="password_confirm_field"
            name="passwordConfirm"
            className="form-control"
            value={formData.passwordConfirm}
            onChange={onChange}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="form-group">
          <label>Avatar</label>
          <div className="d-flex align-items-center">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="rounded-circle mr-3"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <input
              type="file"
              accept="image/*"
              className="form-control-file"
              onChange={onAvatarChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-block py-3" disabled={loading}>
          {loading ? "Registering..." : "REGISTER"}
        </button>

        <Link to="/users/login" className="float-right mt-3">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
};

export default Register;
