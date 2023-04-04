import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const err = useRouteError();
  return (
    <div className="container full-height d-flex flex-column justify-content-center align-items-center">
      <h1 className="mt-2 mb-3 text-danger fw-bolder">Oops Error Occured!</h1>
      <p className="mt-3 fs-3 text-black-50">{err.statusText || err.message}</p>
      <Link to="/" className="text-primary">
        return to home
      </Link>
    </div>
  );
}

//
