import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import "./Login.css";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [hotels, setHotels] = useState([]);
  const [activeTab, setActiveTab] = useState(""); // pending | approved | rejected | total
  const [message, setMessage] = useState("");

  const auth = JSON.parse(localStorage.getItem("auth"));

  // 🔐 Protect route
  if (!auth || auth.role !== "admin") {
    window.location.href = "/login";
    return null;
  }

  // ✅ Fetch counts
  const fetchCounts = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/admin/dashboard-counts/"
      );
      const data = await res.json();
      setCounts(data);
    } catch (err) {
      console.log("Counts fetch error");
    }
  };

  // ✅ Fetch list based on card click
  const fetchHotels = async (tab) => {
    setMessage("");
    setHotels([]);
    setActiveTab(tab);

    let url = "";

    if (tab === "pending") url = "http://127.0.0.1:8000/api/admin/pending-hotels/";
    if (tab === "approved") url = "http://127.0.0.1:8000/api/admin/approved-hotels/";
    if (tab === "rejected") url = "http://127.0.0.1:8000/api/admin/rejected-hotels/";
    if (tab === "total") url = "http://127.0.0.1:8000/api/admin/all-hotels/"; // optional if you want later

    try {
      const res = await fetch(url);
      const data = await res.json();
      setHotels(data);
    } catch (err) {
      console.log("Hotel fetch error");
    }
  };

  // ✅ Approve
  const approveHotel = async (id) => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/admin/approve-hotel/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hotel_id: id }),
        }
      );
      const data = await res.json();
      setMessage(data.message);

      fetchCounts();
      fetchHotels("pending");
    } catch (err) {
      setMessage("Server error ❌");
    }
  };

  // ✅ Reject
  const rejectHotel = async (id) => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/admin/reject-hotel/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hotel_id: id }),
        }
      );
      const data = await res.json();
      setMessage(data.message);

      fetchCounts();
      fetchHotels("pending");
    } catch (err) {
      setMessage("Server error ❌");
    }
  };

  // ✅ Delete
  const deleteHotel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/admin/delete-hotel/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hotel_id: id }),
        }
      );
      const data = await res.json();
      setMessage(data.message);

      fetchCounts();
      fetchHotels("approved");
    } catch (err) {
      setMessage("Server error ❌");
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h3 className="fw-bold text-center mb-4">Admin Dashboard 🛡️</h3>

        {/* ✅ COUNTS ONLY */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div
              className="card shadow-sm p-3 text-center admin-card"
              style={{ cursor: "pointer" }}
              onClick={() => fetchHotels("total")}
            >
              <h6 className="text-muted">Total Hotels</h6>
              <h3 className="fw-bold">{counts.total}</h3>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div
              className="card shadow-sm p-3 text-center admin-card"
              style={{ cursor: "pointer" }}
              onClick={() => fetchHotels("approved")}
            >
              <h6 className="text-muted">Approved</h6>
              <h3 className="fw-bold text-success">{counts.approved}</h3>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div
              className="card shadow-sm p-3 text-center admin-card"
              style={{ cursor: "pointer" }}
              onClick={() => fetchHotels("pending")}
            >
              <h6 className="text-muted">Pending</h6>
              <h3 className="fw-bold text-warning">{counts.pending}</h3>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div
              className="card shadow-sm p-3 text-center admin-card"
              style={{ cursor: "pointer" }}
              onClick={() => fetchHotels("rejected")}
            >
              <h6 className="text-muted">Rejected</h6>
              <h3 className="fw-bold text-danger">{counts.rejected}</h3>
            </div>
          </div>
        </div>

        {/* ✅ Message */}
        {message && (
          <p className="text-center fw-medium text-success">{message}</p>
        )}

        {/* ✅ HOTEL LIST AFTER CLICK */}
        {activeTab && (
          <>
            <h5 className="fw-bold text-center mb-4">
              {activeTab.toUpperCase()} Hotels
            </h5>

            {hotels.length === 0 ? (
              <p className="text-center text-muted">No hotels found</p>
            ) : (
              <div className="row">
                {hotels.map((hotel) => (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={hotel.id}>
                    <div className="card p-3 shadow-sm h-100">
                      <h5 className="fw-bold">{hotel.hotel_name}</h5>
                      <p className="text-muted small mb-1">📍 {hotel.location}</p>
                      <p className="text-muted small mb-2">
                        🍽️ {hotel.food_type}
                      </p>

                      {/* ✅ Pending actions */}
                      {activeTab === "pending" && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm w-50"
                            onClick={() => approveHotel(hotel.id)}
                          >
                            Approve ✅
                          </button>

                          <button
                            className="btn btn-danger btn-sm w-50"
                            onClick={() => rejectHotel(hotel.id)}
                          >
                            Reject ❌
                          </button>
                        </div>
                      )}

                      {/* ✅ Approved → Delete */}
                      {activeTab === "approved" && (
                        <button
                          className="btn btn-dark btn-sm w-100"
                          onClick={() => deleteHotel(hotel.id)}
                        >
                          Delete 🗑️
                        </button>
                      )}

                      {/* ✅ Rejected → Only view */}
                      {activeTab === "rejected" && (
                        <p className="text-danger fw-medium text-center mt-2">
                          ❌ Rejected
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
