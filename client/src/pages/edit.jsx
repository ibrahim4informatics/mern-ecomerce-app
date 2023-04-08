import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";

import axios from "axios";

const Edit = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [cookies] = useCookies();
  const [productInfo, setProductInfo] = useState(null);
  const clickHundler = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://ecommerce-nmgj.onrender.com/api/seller/product/edit/${id}`,
        productInfo,
        {
          headers: { Authorization: `bearer ${cookies.token}` },
        }
      )
      .then((res) => {
        toast.success("Product Editted");
        setTimeout(() => nav("/dashboard"), 3000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error Ocured");
      });
  };
  useEffect(() => {
    axios
      .get(`https://ecommerce-nmgj.onrender.com/api/products/${id}`)
      .then((res) => {
        setProductInfo(res.data.product);
      })
      .catch((err) => alert("Unkown Error"));
  }, []);
  return productInfo === null ? (
    <p>loading</p>
  ) : (
    <DashboardLayout>
      <h1 className="h4 mt-3 ms-3 text-capitalize text-dark">Edit product</h1>
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
              value={productInfo.title}
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
              value={productInfo.price}
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
              maxLength="3500"
              value={productInfo.description}
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
            <label htmlFor="productPrice" className="form-label">
              Product Stock
            </label>
            <input
              min="0"
              type="number"
              step="1"
              className="form-control"
              id="productPrice"
              placeholder="your price go here"
              value={productInfo.stock}
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
              Change Image
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
              Save
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Edit;
