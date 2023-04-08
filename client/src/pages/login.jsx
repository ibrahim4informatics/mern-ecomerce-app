import { React, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/login.module.css";
import axios from "axios";
import { useCookies } from "react-cookie";

function Login() {
  const [credentials, setCredentials] = useState({});
  const [cookies, setCookie] = useCookies();
  const clickHundler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://ecommerce-nmgj.onrender.com/api/seller/login",
        credentials,
        { headers: { Authorization: cookies.token } }
      );
      // console.log(res.data);
      const token = res.data.token;
      setCookie("token", token, { maxAge: 60 * 60 * 24, sameSite: true });
    } catch (err) {
      console.log(err);
      const message = err.response.data.message;
      toast.error(message);
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
          <label htmlFor="emailInput" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="emailInput"
            placeholder="name@example.com"
            name="email"
            onChange={(e) => {
              setCredentials({ ...credentials, email: e.target.value });
            }}
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
            onChange={(e) => {
              setCredentials({ ...credentials, password: e.target.value });
            }}
          />
        </div>
        <div className="container-fluid d-flex flex-column mt-3">
          <button
            className="btn btn-sm btn-primary w-50 text-white align-self-center"
            type="submit"
            onClick={clickHundler}
          >
            Login
          </button>
          <Link className={`mt-3 text-black-50 ${styles.link}`} to="/register">
            want to be a seller? register here
          </Link>
          <Link className={`mt-1 text-black-50 ${styles.link}`} to="/register">
            forgot password? reset here
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
}

export default Login;
