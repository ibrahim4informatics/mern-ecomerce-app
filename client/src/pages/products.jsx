import axios from "axios";
import { React, useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import Product from "../components/Product";

const Products = () => {
  const [allProducts, getAllProducts] = useState([]);
  //   const [searchProducts, getSearch] = useState([]);
  const keyword = useRef();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/products")
      .then((res) => getAllProducts(res.data.allProducts))
      .catch((err) => "");
  }, []);

  const searchHundler = (e) => {
    e.preventDefault();
    axios
      .get(
        `http://localhost:3001/api/products/search?keyword=${keyword.current.value}`
      )
      .then((res) => {
        getAllProducts(res.data.searchedProduct);
      })
      .catch((err) => getAllProducts(["not"]));
  };
  return (
    <Layout>
      {/* <div className="spacer"></div> */}
      <div className="p-5 m-5 d-flex flex-column">
        <h1 className="text-primary fw-bolder fs-4">Products</h1>
        <form className="align-self-start w-100 justify-self-center mt-3">
          <input
            type="search"
            className="form-control"
            placeholder="Search Products"
            aria-label="Search Products"
            aria-describedby="searchBtn"
            onChange={searchHundler}
            ref={keyword}
          />
        </form>
      </div>
      <div className="mt-5 mx-auto pt-2 pb-2 row me-auto align-items-center justify-content-evenly w-100">
        {allProducts.length === 0 ? (
          <div
            className="spinner-border d-flex align-items-center justify-content-center"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : allProducts[0] === "not" ? (
          <div className="text-center text-black-50 h4">Not Found</div>
        ) : (
          allProducts.map((product) => (
            <Product
              key={product.id}
              id={product.id}
              title={product.title}
              desc={product.description}
              price={product.price}
              image={product.image}
            />
          ))
        )}
      </div>
    </Layout>
  );
};

export default Products;
