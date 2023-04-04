import React from "react";
import DashboardNav from "./DashboardNav";
import SellerSideBar from "./SellerSideBar";
import Footer from "./Footer";

const DashboardLayout = ({ children, name, isAdmin }) => {
  return (
    <>
      <DashboardNav name={name} />
      <SellerSideBar isAdmin={isAdmin} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default DashboardLayout;
