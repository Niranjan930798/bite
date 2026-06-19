import { useState } from "react";

export default function SearchForm({ type, onSearch }) {
  const [food, setFood] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!food.trim() || !location.trim()) {
      setError("Please enter food item and location");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://127.0.0.1:8000/api/user/search-food/?type=${encodeURIComponent(
          type
        )}&food=${encodeURIComponent(food)}&location=${encodeURIComponent(
          location
        )}`
      );

      const data = await res.json();

      // ✅ PASS RESULTS
      onSearch({
        type,
        food,
        location,
        results: data,
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Server not responding");
    }
  };

  return (
    <div className="card p-4 shadow-sm mt-4">
      <h5 className="fw-bold mb-3 text-center">{type} 🍛</h5>

      {error && <p className="text-danger small text-center">{error}</p>}

      <input
        type="text"
        className="form-control mb-3"
        placeholder={`Enter ${type} food item`}
        value={food}
        onChange={(e) => setFood(e.target.value)}
      />

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button className="btn btn-success w-100" onClick={handleSubmit}>
        {loading ? "Searching nearby hotels..." : "Search Hotels"}
      </button>
    </div>
  );
}
