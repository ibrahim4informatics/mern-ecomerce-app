import { React, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, NavLink } from "react-router-dom";
import styles from "../styles/navbar.module.css";

const Navbar = () => {
  const [cookies] = useCookies();
  const [isShow, setIsShow] = useState(false);
  const showHundler = () => {
    if (isShow) setIsShow(false);
    else setIsShow(true);
  };
  return (
    <nav className={`${styles.navbar} bg-dark`}>
      <button onClick={showHundler} className={`${styles.button}`}>
        <i className="fa-solid fa-bars"></i>
      </button>
      <Link className={`text-primary ${styles.brand} h2`} to="/">
        SHOPDZ
      </Link>
      <ul className={isShow === true ? `${styles.showNavbar}` : ""}>
        <li>
          <NavLink to="/" className={`${styles.navLink}`}>
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={`${styles.navLink}`}>
            Products
          </NavLink>
        </li>
        {cookies.token === undefined ? (
          <>
            <li>
              <NavLink to="/register" className={`${styles.navLink}`}>
                Become Seller
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={`${styles.navLink}`}>
                Login
              </NavLink>
            </li>
          </>
        ) : (
          <NavLink to="/dashboard" className={`${styles.navLink}`}>
            Dashboard
          </NavLink>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
