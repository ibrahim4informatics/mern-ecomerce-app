import React from "react";
import { NavLink } from "react-router-dom";
import { Cookies, useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const SellerSideBar = ({ isAdmin }) => {
  const nav = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const logoutHundler = () => {
    removeCookie("token", { path: "/", domain: "localhost" });

    nav("/");
  };
  return (
    <div className="bg-primary-subtle d-flex align-items-center justify-content-evenly mt-0">
      <NavLink to="/dashboard/create" className="mx-2 mt-1 text-black-50 h6">
        Create
      </NavLink>
      <NavLink to="/dashboard/published" className="mx-2 mt-1 text-black-50 h6">
        Published
      </NavLink>
      {isAdmin === true ? (
        <NavLink to="/dashboard/pending" className="mx-2 mt-1 text-black-50 h6">
          Pending
        </NavLink>
      ) : null}
      <button
        onClick={logoutHundler}
        className="mx-2 mt-1  h6 btn btn-sm btn-danger"
      >
        Logout
      </button>
    </div>
  );
};

export default SellerSideBar;
