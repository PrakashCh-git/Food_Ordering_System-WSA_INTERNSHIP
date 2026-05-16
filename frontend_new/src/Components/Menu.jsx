import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Fooditem from "./Fooditem";
import { getMenus } from "../redux/action/menuActions";

const Menu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { menus, loading, error } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(getMenus(id));
  }, [dispatch, id]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Menu</h4>
        <Link
          to={`/eats/stores/${id}/reviews`}
          className="btn"
          style={{ backgroundColor: "#078347", color: "white" }}
        >
          ★ Reviews
        </Link>
      </div>
      {loading ? (
        <p>Loading menus...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : Array.isArray(menus) && menus.length > 0 ? (
        menus.map((menu) => (
          <div key={menu._id} className="mb-4">
            <div className="d-flex align-items-center">
              <h2 className="mr-2">{menu.category}</h2>
            </div>
            <hr />
            {Array.isArray(menu.items) && menu.items.length > 0 ? (
              <div className="row">
                {menu.items.map((fooditem) => (
                  <Fooditem key={fooditem._id} fooditem={fooditem} restaurant={id} />
                ))}
              </div>
            ) : (
              <p>No items available</p>
            )}
          </div>
        ))
      ) : (
        <p>No menus Available</p>
      )}
    </div>
  );
};

export default Menu;
