import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const Footer = () => {
  const [cookies] = useCookies();
  return (
    <footer className="text-center text-lg-start bg-light text-muted mt-5">
      <section className="pt-2">
        <div className="container text-center text-md-start mt-5">
          {/* Grid row */}
          <div className="row mt-3">
            {/* Grid column */}
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              {/* Content */}
              <h6 className="text-uppercase fw-bold mb-4">
                <i className="fas fa-gem me-3" />
                Shop DZ
              </h6>
              <p>
                Shop DZ first e-shop in algeria with best offers and payment
                strategies
              </p>
            </div>
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              {/* Links */}
              <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
              {cookies.token === undefined ? (
                <>
                  <p>
                    <Link to="/register" className="text-reset">
                      Become Seller
                    </Link>
                  </p>
                  <p>
                    <Link to="/login" className="text-reset">
                      Login to Seller Account
                    </Link>
                  </p>
                </>
              ) : (
                <p>
                  <Link to="/login" className="text-reset">
                    Go to Dashboard
                  </Link>
                </p>
              )}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              {/* Links */}
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <i className="fas fa-home me-3" /> Oran, Or 3100, DZ
              </p>
              <p>
                <i className="fas fa-envelope me-3" />
                service.dz.shop@gmail.com
              </p>
            </div>
            {/* Grid column */}
          </div>
          {/* Grid row */}
        </div>
      </section>
      {/* Section: Links  */}
      {/* Copyright */}
      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © 2023 Copyright:
        <a className="text-reset fw-bold" href="http://localhost:300/">
          ShopDZ.com
        </a>
      </div>
      {/* Copyright */}
    </footer>
  );
};

export default Footer;
