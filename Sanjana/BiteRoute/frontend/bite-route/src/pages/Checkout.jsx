import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // ✅ same cart key logic
  const getCartKey = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth && auth.role === "user" && auth.user?.user?.id) {
      return `cart_user_${auth.user.user.id}`;
    }
    return "cart_guest";
  };

  useEffect(() => {
    const cartKey = getCartKey();
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (cart.length === 0) {
      navigate("/cart");
    } else {
      setCartItems(cart);
    }
  }, [navigate]);

  // ✅ calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const GST_RATE = 0.05; // 5% GST
  const gstAmount = subtotal * GST_RATE;
  const totalAmount = subtotal + gstAmount;

  const placeOrder = () => {
    alert("✅ Order placed successfully!\n(Payment integration coming next)");
    
    // clear cart after order
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);

   
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h3 className="fw-bold text-center mb-4">🧾 Checkout</h3>

        {/* ORDER SUMMARY */}
        <div className="card shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-3">Order Summary</h5>

          {cartItems.map((item) => (
            <div
              key={item.food_id}
              className="d-flex justify-content-between mb-2"
            >
              <div>
                <p className="mb-0 fw-medium">🏨{item.hotel_name} </p>
                <small className="text-muted">
                   {item.food_name}× {item.qty}
                </small>
              </div>

              <p className="fw-bold">
                ₹ {item.price * item.qty}
              </p>
            </div>
          ))}

          <hr />

          <div className="d-flex justify-content-between">
            <p>Subtotal</p>
            <p>₹ {subtotal.toFixed(2)}</p>
          </div>

          <div className="d-flex justify-content-between">
            <p>GST (5%)</p>
            <p>₹ {gstAmount.toFixed(2)}</p>
          </div>

          <div className="d-flex justify-content-between fw-bold fs-5">
            <p>Total</p>
            <p>₹ {totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* PAYMENT OPTIONS */}
        <div className="card shadow-sm p-4">
          <h5 className="fw-bold mb-3">Payment Method</h5>

          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              checked
              readOnly
            />
            <label className="form-check-label">
              Cash on Delivery (Pay Later)
            </label>
          </div>

          <button
            className="btn btn-success w-100 mt-3"
            onClick={placeOrder}
          >
            Place Order ✅
          </button>
        </div>
      </div>
    </>
  );
}
