import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { updateProfile, updatePassword } from "../redux/action/userActions";
import { clearErrors, updateReset } from "../redux/slices/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, isAuthenticated, isUpdated } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/images.png");
  const [avatar, setAvatar] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { navigate("/users/login"); return; }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || "/images/images.png");
    }
    if (isUpdated) {
      alert("Updated successfully!");
      dispatch(updateReset());
    }
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
  }, [isAuthenticated, user, isUpdated, error, navigate, dispatch]);

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

  const profileSubmitHandler = (e) => {
    e.preventDefault();
    const formData = { name, email };
    if (avatar) formData.avatar = avatar;
    dispatch(updateProfile(formData));
  };

  const passwordSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(updatePassword({ oldPassword, newPassword, newPasswordConfirm }));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Profile</h2>

      <div className="row">
        {/* Profile Info */}
        <div className="col-md-4 text-center mb-4">
          <img
            src={avatarPreview}
            alt={user?.name}
            className="rounded-circle"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
          <h4 className="mt-3">{user?.name}</h4>
          <p className="text-muted">{user?.email}</p>
          <p className="text-muted">{user?.phoneNumber}</p>
          <p className="text-muted">Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</p>
          <Link to="/eats/orders/me/myOrders" className="btn btn-block" style={{ backgroundColor: "#078347", color: "white" }}>
            My Orders
          </Link>
        </div>

        {/* Update Forms */}
        <div className="col-md-8">
          {/* Update Profile */}
          <form onSubmit={profileSubmitHandler} className="shadow-sm p-4 mb-4 rounded" autoComplete="off">
            <h5 className="mb-3">Update Profile</h5>

            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Avatar</label>
              <div className="d-flex align-items-center">
                <img src={avatarPreview} alt="preview" className="rounded-circle mr-3" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                <input type="file" accept="image/*" className="form-control-file" onChange={onAvatarChange} />
              </div>
            </div>

            <button type="submit" className="btn btn-block py-2" style={{ backgroundColor: "#078347", color: "white" }} disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          {/* Update Password */}
          <form onSubmit={passwordSubmitHandler} className="shadow-sm p-4 rounded" autoComplete="off">
            <h5 className="mb-3">Change Password</h5>

            <div className="form-group">
              <label>Old Password</label>
              <input type="password" className="form-control" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" className="form-control" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-block py-2" style={{ backgroundColor: "#078347", color: "white" }} disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
