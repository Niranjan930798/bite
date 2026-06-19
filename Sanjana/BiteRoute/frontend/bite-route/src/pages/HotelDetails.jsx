import { useState } from "react";
import "./Login.css";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

export default function HotelDetails() {
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [foodTypes, setFoodTypes] = useState([]);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const foodOptions = [
    "South Indian",
    "Punjabi",
    "Maharashtrian",
    "Gujarati",
    "Chinese",
    "Italian",
    "Street Food",
  ];

  const handleFoodTypeChange = (type) => {
    if (foodTypes.includes(type)) {
      setFoodTypes(foodTypes.filter((item) => item !== type));
    } else {
      setFoodTypes([...foodTypes, type]);
    }
  };

  const handleSubmit = async () => {
    
    setError("");
    setSuccess("");

    if (
      !hotelName ||
      !location ||
      foodTypes.length === 0 ||
      !openTime ||
      !closeTime
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/hotels/details/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  hotel_name: hotelName,
  location,
  food_type: foodTypes.join(","), // ✅ MATCH MODEL
  open_time: openTime,
  close_time: closeTime,
  description,
}),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Hotel details saved successfully 🏨");
        setHotelName("");
        setLocation("");
        setFoodTypes([]);
        setOpenTime("");
        setCloseTime("");
        setDescription("");
        setTimeout(() => {
          navigate("/hoteldashboard");
        }, 800);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Server not responding");
    }
  };

  return (
    <>
      <Navbar />

      <div className="register-page">
        <div className="register-box">

          <h3 className="fw-bold mb-2">Hotel Details 🏨</h3>
          <p className="text-muted mb-4">
            Add complete information about your hotel
          </p>

          {error && <p className="text-danger small">{error}</p>}
          {success && <p className="text-success small">{success}</p>}

          {/* HOTEL NAME */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Hotel Name"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
          />

          {/* LOCATION */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Location (City / Area)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* FOOD TYPES */}
          <div className="mb-3 text-start">
            <label className="fw-medium mb-2">
              Food Types Available
            </label>

            <div className="row">
              {foodOptions.map((type, index) => (
                <div className="col-6 mb-2" key={index}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={foodTypes.includes(type)}
                      onChange={() => handleFoodTypeChange(type)}
                    />
                    <label className="form-check-label">
                      {type}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPEN TIME */}
          <div className="row align-items-center mb-3">
            <div className="col-5 text-start">
              <label className="fw-medium">Opening Time</label>
            </div>
            <div className="col-7">
              <input
                type="time"
                className="form-control"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
            </div>
          </div>

          {/* CLOSE TIME */}
          <div className="row align-items-center mb-3">
            <div className="col-5 text-start">
              <label className="fw-medium">Closing Time</label>
            </div>
            <div className="col-7">
              <input
                type="time"
                className="form-control"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <textarea
            className="form-control mb-4"
            placeholder="Hotel Description (optional)"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          {/* SUBMIT */}
          <button
            className="btn btn-success w-100"
            onClick={handleSubmit}
          >
            Save Hotel Details
          </button>

        </div>
      </div>
    </>
  );
}
