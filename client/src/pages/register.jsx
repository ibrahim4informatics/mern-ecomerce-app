import { React, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import styles from "../styles/login.module.css";
import { useCookies } from "react-cookie";
import axios from "axios";

const Register = () => {
  const [credentials, setCredentials] = useState({});
  const [cookies] = useCookies();
  const nav = useNavigate();
  const clickHundler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://ecommerce-nmgj.onrender.com/api/seller/register",
        credentials,
        { headers: { Authorization: cookies.token } }
      );
      alert("user created login now!");
      nav("/login");
    } catch (err) {
      const res = err.response.data;
      toast.error(res.message);
    }
  };
  return cookies.token === undefined ? (
    <div className="container-fluid full-height d-flex flex-column justify-content-center align-items-center">
      <ToastContainer
        position="top-center"
        theme="colored"
        hideProgressBar
        autoClose={2000}
      />
      <form method="POST" className={`${styles.form}`}>
        <h1 className=" h3 mb-3 text-primary">Seller Login</h1>
        <div className="mb-3">
          <label htmlFor="nameInput" className="form-label">
            Full Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="nameInput"
            placeholder="your full name..."
            name="name"
            onChange={(e) =>
              setCredentials({ ...credentials, name: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">
            Email address:
          </label>
          <input
            type="email"
            className="form-control"
            id="emailInput"
            placeholder="name@example.com"
            name="email"
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneInput" className="form-label">
            Phone Number:
          </label>
          <input
            type="tel"
            className="form-control"
            id="phoneInput"
            placeholder="your phone here..."
            name="phone"
            onChange={(e) =>
              setCredentials({ ...credentials, phone: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            placeholder="password"
            name="password"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPasswordInput" className="form-label">
            Confirm Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPasswordInput"
            placeholder="password"
            name="confirm_password"
            onChange={(e) =>
              setCredentials({ ...credentials, confirm: e.target.value })
            }
          />
        </div>
        <div className="container-fluid d-flex flex-column mt-3">
          <button
            className="btn btn-sm btn-primary w-50 text-white align-self-center"
            type="submit"
            onClick={clickHundler}
          >
            Register
          </button>
          <Link className={`mt-3 text-black-50 ${styles.link}`} to="/login">
            You are already seller? login here
          </Link>
          <Link className={`mt-1 text-danger ${styles.link}`} to="/">
            return and brows our products
          </Link>
        </div>
      </form>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default Register;
