import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import styles from "../styles/home.module.css";
import { useCookies } from "react-cookie";
import Product from "../components/Product";

const Home = () => {
  const [products, getProduct] = useState([]);
  const [cookies] = useCookies();
  useEffect(() => {
    axios
      .get("https://ecommerce-nmgj.onrender.com/api/products")
      .then((res) => {
        const allProducts = res.data.allProducts;
        const recentProduct = allProducts.slice(-7);
        getProduct(recentProduct);
      })
      .catch((err) => err);
  }, []);
  return (
    <>
      <Layout>
        <section
          className={`${styles.hero} pt-5  bg-dark text-light text-center`}
        >
          <h1 className="h3 text-primary p-2 mt-5 mb-2">SHOP-DZ</h1>
          <p className="text-white-50 mt-3">
            the best shop in algeria with the fastest delivry time and cheaper
            prices
          </p>
          <img src="/wave.svg" className={`${styles.wave}`} alt="" />
        </section>
        <div className="spacer mt-5"></div>
        <div className={`p-5 mt-3 container ${styles.productsSection}`}>
          <h3 className="text-secondary h1 text-center">Products</h3>
          <div className={`container mt-3`}>
            <p className="text-dark h6">Recent</p>
            <div className="mt-5 pt-2 pb-2 row me-auto align-items-center justify-content-evenly w-100">
              {products.length === 0 ? (
                <div
                  className="spinner-border d-flex align-items-center justify-content-center"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                products.map((product) => (
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
          </div>
        </div>
        <div className={`pt-4 mb-5 my-2 bg-primary ${styles.about}`}>
          <p className="h3 text-center text-white-50  ">About Us</p>
          <div className="mt-3">
            <p className="text-light mt-2">
              we are just a plateform where people can post their products even
              you can become seller easly by opening an account and provide your
              products in our website to reach people online people can see your
              contact info that you provide such us phone number and email
            </p>
          </div>
          <div className="mt-3 p-4 w-100 d-flex align-items-center justify-content-evenly">
            {cookies.token === undefined ? (
              <Link to="/register" className="btn btn-dark">
                Become Seller
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-dark">
                Dashboard
              </Link>
            )}
            <Link to="/register" className="btn btn-light">
              All Products
            </Link>
          </div>
          <img src="/wave2.svg" alt="" />
        </div>
        <div className="spacer "></div>
        <div style={{ width: "100%", height: "40px" }}></div>
      </Layout>
    </>
  );
};

export default Home;
