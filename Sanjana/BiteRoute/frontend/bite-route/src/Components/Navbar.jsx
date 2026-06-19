import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCartCount } from "../pages/cartService";  // ✅ cart service

function Navbar() {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth"));

  const [cartCount, setCartCount] = useState(0);

  // ✅ Update cart count whenever page loads or cart updates
  useEffect(() => {
    setCartCount(getCartCount());

    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    // ✅ custom event (we will trigger this after add/remove cart)
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  // ✅ Get username from auth storage
  const getUserName = () => {
    if (!auth) return "";

    if (auth.role === "user") return auth?.user?.user?.name || "User";
    if (auth.role === "hotel") return auth?.user?.owner?.username || "Hotel Owner";
    if (auth.role === "admin") return "Admin";

    return "";
  };

  const roleLabel =
    auth?.role === "user"
      ? "User"
      : auth?.role === "hotel"
      ? "Hotel Owner"
      : auth?.role === "admin"
      ? "Admin"
      : "";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-3">
      {/* ✅ LOGO */}
      <Link className="navbar-brand fw-bold" to="/home">
        🍴 BiteRoute
      </Link>

      {/* ✅ Mobile Toggle */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* ✅ NAV LINKS */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

          {/* ✅ Home (always show when login exists) */}
          {auth && (
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Home
              </Link>
            </li>
          )}

          {/* ✅ USER CART ICON */}
          {auth?.role === "user" && (
            <li className="nav-item position-relative">
              <Link className="nav-link" to="/cart">
                🛒 Cart
                {cartCount > 0 && (
                  <span
                    className="badge bg-danger ms-2"
                    style={{
                      fontSize: "12px",
                      padding: "5px 8px",
                      borderRadius: "50px",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          )}

          {/* ✅ Hotel Dashboard */}
          {auth?.role === "hotel" && (
            <li className="nav-item">
              <Link className="nav-link" to="/hoteldashboard">
                Hotel Dashboard
              </Link>
            </li>
          )}

          {/* ✅ Admin Dashboard */}
          {auth?.role === "admin" && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin-dashboard">
                Admin Dashboard
              </Link>
            </li>
          )}

          {/* ✅ Username + Role */}
          {auth && (
            <li className="nav-item">
              <span className="nav-link text-white">
                👤 {getUserName()}{" "}
                <span className="badge bg-secondary ms-2">
                  {roleLabel}
                </span>
              </span>
            </li>
          )}

          {/* ✅ Not logged in */}
          {!auth && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/common-register">
                  Register
                </Link>
              </li>
            </>
          )}

          {/* ✅ Logout */}
          {auth && (
            <li className="nav-item">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
