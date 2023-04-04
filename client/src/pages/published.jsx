import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import TableRow from "../components/TableRow";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
const Published = () => {
  const [sellerInfo, getSellerInfo] = useState(null);
  const [selected, setSelected] = useState("own");
  const [cookies] = useCookies();
  const nav = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/seller/products", {
        headers: { Authorization: `bearer ${cookies.token}` },
      })
      .then((res) => getSellerInfo(res.data))
      .catch((err) => {
        if (err.response.status === 401) {
          nav("/");
        } else {
          alert("error ocured");
          nav("/");
        }
      });
  }, [sellerInfo]);
  return sellerInfo === null ? (
    <div
      style={{ height: "100vh" }}
      className="container-fluid d-flex align-items-center justify-content-center"
    >
      <div
        className="spinner-border d-flex align-items-center justify-content-center"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <DashboardLayout>
      <p className="h5 text-dark m-2">published products</p>
      <div className="container-fluid d-flex flex-column">
        {sellerInfo.user.isAdmin === true ? (
          <>
            <select
              className="form-select"
              style={{ width: "25%", minWidth: "200px" }}
              aria-label="Default select example"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option onClick={(e) => setSelected(e.target.value)} value="own">
                Own Products
              </option>
              <option value="other">Other's Products</option>
            </select>

            <table className="table w-100 text-center table-hover table-responsive table-secondary table-striped mt-3">
              <thead>
                <tr>
                  <th scope="col">n</th>
                  <th scope="col">image</th>
                  <th scope="col">title</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {selected === "own" ? (
                  sellerInfo.ownProduct.map((product, index) => (
                    <TableRow
                      editable={true}
                      title={product.title}
                      id={product.id}
                      length={index + 1}
                      image={product.image}
                      token={cookies.token}
                    />
                  ))
                ) : sellerInfo.othersProducts.length === 0 ? (
                  <td colSpan="4" className="mt-2 text-black-50">
                    empty
                  </td>
                ) : (
                  sellerInfo.othersProducts.map((product, index) => {
                    if (product.isApprouved) {
                      return (
                        <TableRow
                          editable={false}
                          title={product.title}
                          id={product.id}
                          length={index + 1}
                          image={product.image}
                          token={cookies.token}
                        />
                      );
                    }
                  })
                )}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <select
              className="form-select"
              style={{ width: "25%", minWidth: "200px" }}
              aria-label="Default select example"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option
                onClick={(e) => setSelected(e.target.value)}
                value="approuved"
              >
                Approuved Products
              </option>
              <option value="pending">Pending Products</option>
            </select>

            <table className="table w-100 text-center table-hover table-responsive table-secondary table-striped mt-3">
              <thead>
                <tr>
                  <th scope="col">n</th>
                  <th scope="col">image</th>
                  <th scope="col">title</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {selected === "pending" ? (
                  sellerInfo.pending_products.length === 0 ? (
                    <td colSpan="4" className="mt-2 text-black-50">
                      empty
                    </td>
                  ) : (
                    sellerInfo.pending_products.map((product, index) => (
                      <TableRow
                        editable={true}
                        title={product.title}
                        id={product.id}
                        length={index + 1}
                        image={product.image}
                        token={cookies.token}
                      />
                    ))
                  )
                ) : sellerInfo.approved_products.length === 0 ? (
                  <td colSpan="4" className="mt-2 text-black-50">
                    empty
                  </td>
                ) : (
                  sellerInfo.approved_products.map((product, index) => (
                    <TableRow
                      editable={true}
                      title={product.title}
                      id={product.id}
                      length={index + 1}
                      image={product.image}
                      token={cookies.token}
                    />
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Published;
