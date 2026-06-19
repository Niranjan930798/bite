import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./Login.css";

export default function FoodResults() {
  const locationData = useLocation();
  const navigate = useNavigate();

  const { type, food, location } = locationData.state || {};

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");

  // ✅ SAME CART KEY LOGIC AS CartPage
  const getCartKey = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth && auth.role === "user" && auth.user?.user?.id) {
      return `cart_user_${auth.user.user.id}`;
    }
    return "cart_guest";
  };

  useEffect(() => {
    if (!type || !food || !location) {
      navigate("/home");
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/user/search-food/?type=${encodeURIComponent(
            type
          )}&food=${encodeURIComponent(food)}&location=${encodeURIComponent(
            location
          )}`
        );

        const data = await res.json();
        if (res.ok) setResults(data);
        else setResults([]);
      } catch {
        setResults([]);
      }
      setLoading(false);
    };

    fetchResults();
  }, [type, food, location, navigate]);

  // ✅ FIXED ADD TO CART
  const addToCart = (item) => {
    const cartKey = getCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    // ✅ USE food_id (NOT id)
    const existingItem = cart.find(
      (c) => c.food_id === item.food_id
    );

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        food_id: item.food_id,
        food_name: item.food_name,
        price: item.price,
        qty: 1,
        hotel_name: item.hotel_name,
        location: item.location,
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));

    setPopupMsg("✅ Added to cart successfully!");
    setTimeout(() => setPopupMsg(""), 2000);
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h3 className="fw-bold text-center mb-3">
          Results for "{food}" 🍴
        </h3>

        <p className="text-center text-muted mb-4">
          Type: <b>{type}</b> | Location: <b>{location}</b>
        </p>

        {popupMsg && (
          <div className="alert alert-success text-center">
            {popupMsg}
          </div>
        )}

        {loading && (
          <p className="text-center text-muted">
            🔍 Searching nearby hotels...
          </p>
        )}

        {!loading && results.length === 0 && (
          <p className="text-center text-muted">
            ❌ No hotels found near you for this food.
          </p>
        )}

        <div className="row g-4">
          {results.map((item) => (
            <div key={item.food_id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100 p-3">
                <h5 className="fw-bold mb-1">{item.food_name}</h5>
                <p className="text-muted mb-1">🏨 {item.hotel_name}</p>
                <p className="text-muted mb-1">📍 {item.location}</p>
                <p className="fw-bold text-success mb-3">
                  ₹ {item.price}
                </p>

                <button
                  className="btn btn-dark w-100"
                  onClick={() => addToCart(item)}
                >
                  ➕ Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
