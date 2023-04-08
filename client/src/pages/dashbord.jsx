import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import styles from "../styles/dashboard.module.css";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [cookies] = useCookies();
  const [info, setInfo] = useState(null);

  const nav = useNavigate();

  useEffect(() => {
    axios
      .get("https://ecommerce-nmgj.onrender.com/api/seller/products", {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then((res) => {
        const user = res.data.user;
        if (user.isAdmin) {
          const published = [];
          const pending = [];
          res.data.ownProduct.forEach((product) => {
            if (product.isApprouved !== true) {
              pending.push(product);
            } else {
              published.push(product);
            }
          });
          setInfo({ user, published, pending });
        } else {
          setInfo({
            user,
            published: res.data.approved_products,
            pending: res.data.pending_products,
          });
        }
      })
      .catch((err) => {
        if (err.response.status) {
          nav("/");
        }
      });
  }, []);

  return info === null ? (
    <div
      className="container w-100 d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div
        className="spinner-border d-flex align-items-center justify-content-center"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <DashboardLayout isAdmin={info.user.isAdmin} name={info.user.name}>
      <div className={`container my-3 h-100 ${styles.dsctn}`}>
        {console.log(info)}
        <h1 className="text-black-50 h4 fw-bolder">Dashboard</h1>
        <div className=" row align-items-center justify-content-between text-light p-2">
          <div className={` col-md-6 p-4 bg-primary ${styles.dashItem}`}>
            <p className="h5">Contact-Info</p>
            <div className="mt-2">
              <p className="h6">
                Phone:
                <span className="text-black fw-bolder"> {info.user.phone}</span>
              </p>
            </div>
            <div className="mt-2">
              <p className="h6">
                Email:
                <span className="text-black fw-bolder"> {info.user.email}</span>
              </p>
            </div>
            <div className="mt-2">
              <p className="h6">
                name:
                <span className="text-black fw-bolder"> {info.user.name}</span>
              </p>
            </div>
            <div className="mt-2">
              <p className="h6">
                Rol:
                <span className="text-black fw-bolder">
                  {" "}
                  {info.user.isAdmin === true ? "Admin" : "Seller"}
                </span>
              </p>
            </div>
          </div>

          <div className={`col-md-6 p-4 bg-success ${styles.dashItem}`}>
            <p className="h5">Published-Products</p>
            <div className="mt-2 h-100 d-flex align-items-center justify-content-evenly flex-column">
              <p className="h6 text-white-50">
                here are the aprouved products that you publish
              </p>
              <p className="h6 text-light">
                You 've {info.published.length} Published Products
              </p>
            </div>
          </div>

          <div className={` col-md-6 p-4 bg-danger ${styles.dashItem}`}>
            <p className="h5">Pending-Products</p>
            <div className="mt-2 h-100 d-flex align-items-center justify-content-evenly flex-column">
              <p className="h6 text-white-50">
                here are the pending products that you publish
              </p>
              <p className="h6 text-light">
                You 've {info.pending.length === 0 ? "no" : info.pending.length}{" "}
                Pending Products
              </p>
            </div>
          </div>
        </div>
        {info.user.isAdmin === true ? (
          <>
            <p className="my-3 h6 text-black-50">Admin Tools</p>
            <div className="row  my-3 p-2 align-items-center justify-content-start">
              <div className={` mx-3 col p-4 bg-secondary ${styles.dashItem}`}>
                <Link to="/ban" className="h5 text-light">
                  Ban-Products
                </Link>
                <div className="mt-2 h-100 d-flex align-items-center justify-content-evenly  flex-column">
                  <p className="h6 text-white-50">
                    here are the ban products (will be pending product) that you
                    publish
                  </p>
                </div>
              </div>

              <div className={` col mx-3 p-4 bg-dark ${styles.dashItem}`}>
                <Link to="/dashboard/delete" className="h5 text-light">
                  Delete-Products
                </Link>
                <div className="mt-2 h-100 d-flex align-items-center justify-content-evenly  flex-column">
                  <p className="h6 text-white-50">
                    here you can delete products
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
