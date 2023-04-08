import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";

const SingleProductPage = () => {
  const [product, getProduct] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`https://ecommerce-nmgj.onrender.com/api/products/${id}`)
      .then((res) => getProduct(res.data.product))
      .catch((err) => "");
  }, [id]);

  return (
    <Layout>
      {product === null ? (
        <div
          className="spinner-border d-flex align-items-center justify-content-center"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div className="pt-5 mt-5 container">
          <h1 className="text-dark fw-bolder text-capitalize">
            {product.title}
          </h1>
          <div className="mt-4 p-5 w-100">
            <div className="d-flex align-items-center justify-content-center  mb-3">
              <img
                className="mt-5 mx-3 text-center"
                src={`${product.image}`}
                alt="product view"
                style={{ aspectRatio: "16:9", width: "350px" }}
              />
            </div>
            <div className="mx-2">
              <div className="mt-3">
                <h4 className="text-primary">Description</h4>
                <p className="text-secondary m-3">{product.description}</p>
              </div>
              <p className="h6">
                price : <span className="text-success">{product.price}</span>DA
              </p>
              <div className="mt-3 p-5">
                <p className="text-secondary h4">Contact Seller: </p>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">name</th>
                      <th scope="col">email</th>
                      <th scope="col">phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">{product.user.name}</th>
                      <td>{product.user.email}</td>
                      <td>{product.user.phone}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SingleProductPage;
