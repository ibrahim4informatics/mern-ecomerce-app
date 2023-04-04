import React from "react";
import { Link } from "react-router-dom";

const Product = ({ title, desc, image, price, id }) => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
      <div
        style={{ maxWidth: "420px", height: "300px" }}
        className="card w-100 px-3 pt-3 bg-secondary-subtle mx-auto my-2"
      >
        <img
          src={`${image}`}
          style={{ width: "300px", height: "150px", aspectRatio: "16:9" }}
          className="card-img-top w-100"
          alt="product"
        />
        <div className="card-body">
          <h5 className="card-title text-capitalize">{title}</h5>
          <p className="card-text">
            {desc.length >= 50 ? `${desc.slice(0, 10)}...` : desc}
          </p>
          <div className="w-100 d-flex align-items-center justify-content-between">
            <p className="text-primary h6 ml-3">{price}da</p>
            <Link to={`/products/${id}`} className="text-black-50 mr-3 h6">
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
