import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // ✅ FIXED

  // ✅ SAFELY get cart key
  const getCartKey = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth && auth.role === "user" && auth.user?.user?.id) {
      return `cart_user_${auth.user.user.id}`;
    }

    return "cart_guest";
  };

  const loadCart = () => {
    const cartKey = getCartKey();
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(cart);
  };

  const saveCart = (newCart) => {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    setCartItems(newCart);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const increaseQty = (food_id) => {
    const updatedCart = cartItems.map((item) =>
      item.food_id === food_id ? { ...item, qty: item.qty + 1 } : item
    );
    saveCart(updatedCart);
  };

  const decreaseQty = (food_id) => {
    const updatedCart = cartItems
      .map((item) =>
        item.food_id === food_id ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0);

    saveCart(updatedCart);
  };

  const removeItem = (food_id) => {
    const updatedCart = cartItems.filter(
      (item) => item.food_id !== food_id
    );
    saveCart(updatedCart);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h3 className="fw-bold text-center mb-4">🛒 Your Cart</h3>

        {cartItems.length === 0 ? (
          <p className="text-center text-muted">Cart is empty 😢</p>
        ) : (
          <>
            <div className="row g-4">
              {cartItems.map((item) => (
                <div key={item.food_id} className="col-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm p-3 h-100">
                    <h5 className="fw-bold">{item.food_name}</h5>
                    <p className="text-muted mb-1">🏨 {item.hotel_name}</p>
                    <p className="text-muted mb-1">📍 {item.location}</p>

                    <p className="fw-bold text-success mb-2">
                      ₹ {item.price} × {item.qty} = ₹{" "}
                      {item.price * item.qty}
                    </p>

                    <div className="d-flex align-items-center justify-content-between mt-2">
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => decreaseQty(item.food_id)}
                        >
                          −
                        </button>

                        <span className="fw-bold">{item.qty}</span>

                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => increaseQty(item.food_id)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeItem(item.food_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <h5 className="fw-bold">Total: ₹ {totalPrice}</h5>
              <button
                className="btn btn-success mt-2 px-4"
                onClick={() => navigate("/checkout")}
              >
                Checkout ✅
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
