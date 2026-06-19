import { useState } from "react";
import Navbar from "../Components/Navbar";
import "./Login.css";
import type from "../data/type"; // ✅ your array

export default function AddFoodMenu() {
  const [hotelName, setHotelName] = useState("");
  const [approved, setApproved] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  // ✅ NEW CATEGORY STATE
  const [category, setCategory] = useState("");

  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [foodDesc, setFoodDesc] = useState("");

  const [message, setMessage] = useState("");

  const auth = JSON.parse(localStorage.getItem("auth"));

  // 🔐 Protect route
  if (!auth || auth.role !== "hotel") {
    window.location.href = "/login";
    return null;
  }

  // ✅ CHECK HOTEL STATUS
  const checkHotelStatus = async () => {
    setMessage("");
    setApproved(null);
    setStatusMsg("");

    if (!hotelName.trim()) {
      setMessage("Please enter hotel name");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/hotels/check-status/?hotel_name=${hotelName}`
      );

      const data = await res.json();

      if (res.ok) {
        if (data.status === "approved") {
          setApproved(true);
          setStatusMsg("✅ Your hotel is Approved! Now you can add food menu.");
        } else if (data.status === "pending") {
          setApproved(false);
          setStatusMsg("⏳ Your hotel request is pending approval.");
        } else {
          setApproved(false);
          setStatusMsg("❌ Hotel not found. Register your hotel first.");
        }
      } else {
        setApproved(false);
        setStatusMsg(data.message || "Something went wrong");
      }
    } catch (err) {
      setMessage("Server not responding");
    }
  };

  // ✅ ADD FOOD
  const addFoodItem = async () => {
    setMessage("");

    if (!category || !foodName.trim() || !price.trim()) {
      setMessage("Please select category + enter food name and price");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/foods/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotel_name: hotelName,
          category: category, // ✅ send category
          food_name: foodName,
          price: price,
          description: foodDesc,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Food added successfully!");
        setFoodName("");
        setPrice("");
        setFoodDesc("");
        setCategory(""); // ✅ reset dropdown
      } else {
        setMessage(data.message || "Failed to add food");
      }
    } catch (err) {
      setMessage("Server not responding");
    }
  };

  // ✅ Add Another Food (clear only input)
  const addAnotherFood = () => {
    setFoodName("");
    setPrice("");
    setFoodDesc("");
    setCategory("");
    setMessage("");
  };

  return (
    <>
      <Navbar />

      <div className="register-page">
        <div className="register-box" style={{ width: "520px" }}>
          <h4 className="fw-bold text-center mb-3">Add Food Menu 🍽️</h4>

          {message && (
            <p className="text-center text-danger small fw-medium">
              {message}
            </p>
          )}

          {/* ✅ HOTEL NAME */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your Hotel Name"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
          />

          <button
            className="btn btn-success w-100 mb-3"
            onClick={checkHotelStatus}
            type="button"
          >
            Check Status
          </button>

          {/* ✅ STATUS MESSAGE */}
          {statusMsg && (
            <p className="text-center fw-medium">{statusMsg}</p>
          )}

          {/* ✅ APPROVED FORM */}
          {approved === true && (
            <>
              <hr />

              {/* ✅ CATEGORY DROPDOWN */}
              <select
                className="form-control mb-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Food Category</option>
                {type.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              {/* ✅ FOOD NAME */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Food Name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />

              {/* ✅ PRICE */}
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Price (₹)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              {/* ✅ DESCRIPTION */}
              <textarea
                className="form-control mb-3"
                placeholder="Food Description (optional)"
                rows="2"
                value={foodDesc}
                onChange={(e) => setFoodDesc(e.target.value)}
              ></textarea>

              <button
                className="btn btn-dark w-100"
                onClick={addFoodItem}
                type="button"
              >
                Add Food
              </button>

              <button
                className="btn btn-outline-success w-100 mt-3"
                onClick={addAnotherFood}
                type="button"
              >
                ➕ Add Another Food Item
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
