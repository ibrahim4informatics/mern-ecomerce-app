import React from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axios from "axios";

const tableRow = ({ image, title, length, id, token, editable }) => {
  const hundleBan = async () => {
    const confirm = window.confirm(`are you sure to ban product: ${title}`);
    if (confirm) {
      axios
        .put(
          `https://ecommerce-nmgj.onrender.com/api/seller/product/ban/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert("Error Ocured");
        });
    }
  };
  const deleteHundler = () => {
    const confirm = window.confirm(`sure to delte product : ${title}`);
    console.log(confirm);
    if (confirm) {
      axios
        .delete(
          `https://ecommerce-nmgj.onrender.com/api/seller/product/delete/${id}`,
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        )
        .then((res) => alert("produc deleted"))
        .catch((err) => alert(err.response.data.message));
    } else {
      return <Navigate to="/dashboard/published" />;
    }
  };
  return (
    <tr>
      <th scope="row">{length}</th>
      <td>
        <img
          style={{ aspectRatio: "16 / 9", width: "100px" }}
          src={`${image}`}
          alt="missing"
        />
      </td>
      <td>{title}</td>
      <td style={{ width: "10%" }}>
        <div className="d-flex align-items-center justify-content-between ">
          {editable === true ? (
            <Link
              to={`/dashboard/edit/${id}`}
              className="btn btn-sm btn-primary"
            >
              <i className="fa fa-pen"></i>
            </Link>
          ) : (
            <button onClick={hundleBan} className="btn btn-sm btn-warning">
              <i className="fa fa-ban"></i>
            </button>
          )}
          <button onClick={deleteHundler} className="btn btn-sm btn-danger">
            <i className="fa fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default tableRow;
