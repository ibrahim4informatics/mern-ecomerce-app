import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Pending = () => {
  const [info, getInfo] = useState(null);
  const nav = useNavigate();
  const [cookies] = useCookies();
  const deleteHundler = (id, title) => {
    const confirm = window.confirm(`sure to delte product : ${title}`);
    if (confirm) {
      axios
        .delete(`http://localhost:3001/api/seller/product/delete/${id}`, {
          headers: {
            Authorization: `bearer ${cookies.token}`,
          },
        })
        .then((res) => alert("produc deleted"))
        .catch((err) => alert(err.response.data.message));
    } else {
      return <Navigate to="/dashboard/published" />;
    }
  };

  const approuveHundler = (id, title, token) => {
    const confirm = window.confirm(`sure to aprouve product ${title}`);
    if (confirm) {
      axios
        .put(
          `http://localhost:3001/api/seller/product/approuve/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          toast.success("Product Approuved");
        })
        .catch((err) => {
          toast.error("Error Ocured");
        });
    }
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/seller/pending", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        getInfo(res.data);
      })
      .catch((err) => {
        alert("not authorized");

        nav("/");
      });
  }, [info]);
  return info === null ? (
    <div
      style={{ width: "100%", height: "100vh" }}
      className="d-flex align-items-center justify-content-center"
    >
      <div
        className="spinner-border d-flex align-items-center justify-content-center"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <DashboardLayout isAdmin={info.user.isAdmin}>
      <ToastContainer />
      <p className="text-primary h6 mt-3 ms-2">Pending</p>
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
          {info.pending.map((product, index) => {
            {
              return (
                <tr key={product.id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img
                      style={{ aspectRatio: "16 / 9", width: "100px" }}
                      src={`${product.image}`}
                      alt="missing"
                    />
                  </td>
                  <td>{product.title}</td>
                  <td style={{ width: "10%" }}>
                    <div className="d-flex align-items-center justify-content-between ">
                      <button
                        onClick={(id, title) => {
                          id = product.id;
                          title = product.title;
                          deleteHundler(id, title);
                        }}
                        className="btn btn-danger"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                      <button
                        onClick={(id, title) => {
                          id = product.id;
                          title = product.title;
                          approuveHundler(id, title, cookies.token);
                        }}
                        className="btn btn-success"
                      >
                        <i className="fa fa-check"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default Pending;
