import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function CommonLogin() {
  const [role, setRole] = useState("user"); // user | hotel | admin
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!contact || !password) {
      setError("All fields are required");
      return;
    }

    // 🔁 Choose API based on role
    let apiUrl = "";

    if (role === "user") {
      apiUrl = "http://localhost:8000/api/users/login/";
    } else if (role === "hotel") {
      apiUrl = "http://localhost:8000/api/hotels/login/";
    } else if (role === "admin") {
      apiUrl = "http://localhost:8000/api/admin/login/";
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save login info
        localStorage.setItem(
          "auth",
          JSON.stringify({ role, user: data })
        );

        // Redirect based on role
        if (role === "user") navigate("/home");
        if (role === "hotel") navigate("/hoteldashboard");
        if (role === "admin") navigate("/admin-dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server not responding");
    }
  };

  return (
    <div className="user-login-page">
      <div className="user-login-box">

        <h3 className="mb-2">Login</h3>
        <p className="text-muted mb-3">
          Select role and login to BiteRoute
        </p>

        {error && <p className="text-danger small">{error}</p>}

        {/* 🔽 ROLE DROPDOWN */}
        <select
          className="form-control mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="hotel">Hotel Owner</option>
          <option value="admin">Admin</option>
        </select>

        {/* CONTACT */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Email or Phone Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          className="btn btn-success w-100"
          onClick={handleLogin}
        >
          Login
        </button>

        {/* REGISTER LINKS */}
        {role === "user" && (
          <p className="text-muted small mt-3">
            New user?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/common-register")}
            >
              Register
            </span>
          </p>
        )}

        {role === "hotel" && (
          <p className="text-muted small mt-3">
            New hotel owner?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/common-register")}
            >
              Register Hotel
            </span>
          </p>
        )}

        

      </div>
    </div>
  );
}

export default CommonLogin;
