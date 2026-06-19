import { useState } from "react";
import type from "../data/type";
import SearchForm from "../Components/SearchForm";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function Home() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  const handleCardClick = (type) => {
    setSelectedType(type);
  };

  // ✅ RECEIVE RESULTS AND PASS THEM
  const handleSearch = ({ type, food, location, results }) => {
    navigate("/results", {
      state: {
        type,
        food,
        location,
        results, // 🔥 THIS WAS MISSING
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="home-bg">
        <div className="container py-5">
          <h1 className="text-center fw-bold mb-4">
            Explore Food Types 🍽️
          </h1>

          <p className="text-center mb-5 text-muted">
            Choose your favorite type and discover nearby food
          </p>

          {!selectedType && (
            <div className="row g-4">
              {type.map((item) => (
                <div
                  key={item.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <div
                    className="menu-card"
                    onClick={() => handleCardClick(item.name)}
                  >
                    <img src={item.image} alt={item.name} />
                    <div className="menu-content bg-success">
                      <h5>{item.name}</h5>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedType && (
            <SearchForm
              type={selectedType}
              onSearch={handleSearch}
            />
          )}
        </div>
      </div>
    </>
  );
}
