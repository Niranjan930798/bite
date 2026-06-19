import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import CommonLogin from "./pages/CommonLogin";
import CommonRegister from "./pages/CommonRegister";

import Hdashboard from "./pages/Hdashboard";
import HotelDetails from "./pages/HotelDetails";
import AddFoodMenu from "./pages/AddFoodMenu";

import AdminDashboard from "./pages/AdminDashboard";
import FoodResults from "./pages/FoodResult";
import Cart from "./pages/cart";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Auth pages */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<CommonLogin />} />
        <Route path="/common-register" element={<CommonRegister />} />

        {/* User */}
        <Route path="/home" element={<Home />} />
        <Route path="/results" element={<FoodResults />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/checkout" element={<Checkout/>} />



        {/* Hotel Owner */}
        <Route path="/hoteldashboard" element={<Hdashboard />} />
        <Route path="/hotel-details" element={<HotelDetails />} />
        <Route path="/add-food" element={<AddFoodMenu />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
