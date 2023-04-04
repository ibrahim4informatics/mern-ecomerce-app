import React from "react";

const DashboardNav = ({ name }) => {
  return (
    <nav className="bg-dark p-2 ">
      <div className="d-flex align-items-center justify-content-between container">
        <h1 className="h4 text-primary mx-3">Dashboad</h1>
        <p className="h6 text-light mx-3">{name}</p>
      </div>
    </nav>
  );
};

export default DashboardNav;
