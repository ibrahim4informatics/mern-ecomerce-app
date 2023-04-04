import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Create = () => {
  const [productInfo, setProductInfo] = useState({});
  const nav = useNavigate();
  const [cookies] = useCookies();
  const formData = new FormData();
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/seller/products", {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then((res) => "")
      .catch((err) => {
        nav("/");
      });
  }, []);
  const clickHundler = (e) => {
    e.preventDefault();
    formData.append("title", productInfo.title);
    formData.append("price", productInfo.price);
    formData.append("description", productInfo.description);
    formData.append("stock", productInfo.stock);
    formData.append("image", productInfo.image);

    console.log(productInfo);
    axios
      .post("http://localhost:3001/api/seller/product/new", formData, {
        headers: { Authorization: `bearer ${cookies.token}` },
      })
      .then((res) => {
        const msg = res.data.message;
        toast.success(`${msg}, you'll be redirected after 5s`);
        setTimeout(() => {
          nav("/dashboard");
        }, 5000);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Unknown Error");
        }
      });
  };
  return (
    <DashboardLayout>
      <h1 className="h4 mt-3 ms-3 text-capitalize text-dark">
        Add New product
      </h1>
      <div className="container d-flex flex-column align-items-center">
        <ToastContainer hideProgressBar />
        <form className="w-100 container">
          <div className=" d-flex flex-column">
            <label htmlFor="productTitle" className="form-label">
              Product Title
            </label>
            <input
              type="text"
              maxLength="50"
              className="form-control"
              id="productTitle"
              placeholder="your product title go here"
              onChange={(e) => {
                setProductInfo({ ...productInfo, title: e.target.value });
              }}
            />
            <p
              className="text-black-50 me-2 mt-1"
              style={{ textAlign: "right" }}
            >
              {productInfo.title === undefined ? "0" : productInfo.title.length}
              /50
            </p>
          </div>
          <div className="mb-3 d-flex flex-column">
            <label htmlFor="productPrice" className="form-label">
              Product Price{" "}
              <span className="text-black-50 h6">
                (with DA: algerian dinar)
              </span>
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="form-control"
              id="productPrice"
              placeholder="your price go here"
              onChange={(e) => {
                setProductInfo({
                  ...productInfo,
                  price: e.target.value,
                });
              }}
            />
          </div>
          <div className="mb-1  d-flex flex-column">
            <label htmlFor="productDescription">Description:</label>

            <textarea
              className="form-control mt-2"
              placeholder="descript your product here"
              id="productDescription"
              defaultValue={""}
              maxLength="3500"
              onChange={(e) =>
                setProductInfo({ ...productInfo, description: e.target.value })
              }
            />

            <p
              className="text-black-50 me-2 mt-1"
              style={{ textAlign: "right" }}
            >
              {productInfo.description === undefined
                ? "0"
                : productInfo.description.length}
              /3500
            </p>
          </div>
          <div className="mb-3 d-flex flex-column">
            <label htmlFor="productStock" className="form-label">
              Product Stock
            </label>
            <input
              min="0"
              type="number"
              step="1"
              className="form-control"
              id="productStock"
              placeholder="your stock go here"
              onChange={(e) => {
                setProductInfo({
                  ...productInfo,
                  stock: e.target.value,
                });
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="productImage" className="form-label">
              Upload Image
            </label>
            <input
              className="form-control"
              type="file"
              id="productImage"
              onChange={(e) =>
                setProductInfo({ ...productInfo, image: e.target.files[0] })
              }
              accept="image/png, image/gif, image/jpeg"
            />
          </div>
          <div className="text-center container">
            <button
              onClick={clickHundler}
              className="btn btn-primary w-50 px-2"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Create;
