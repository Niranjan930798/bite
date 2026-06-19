// ✅ CART SERVICE (localStorage based)

const CART_KEY = "cart";

// ✅ Get cart items
export const getCartItems = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

// ✅ Save cart items
export const saveCartItems = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));

  // ✅ Update navbar count instantly
  window.dispatchEvent(new Event("cartUpdated"));
};

// ✅ Add item to cart
export const addToCart = (item) => {
  const cart = getCartItems();

  const existingItem = cart.find(
    (x) =>
      x.hotel_name === item.hotel_name &&
      x.food_name === item.food_name
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1,
    });
  }

  saveCartItems(cart);
};

// ✅ Remove item from cart
export const removeFromCart = (index) => {
  const cart = getCartItems();
  cart.splice(index, 1);
  saveCartItems(cart);
};

// ✅ Increase qty
export const increaseQty = (index) => {
  const cart = getCartItems();
  cart[index].quantity += 1;
  saveCartItems(cart);
};

// ✅ Decrease qty
export const decreaseQty = (index) => {
  const cart = getCartItems();

  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  saveCartItems(cart);
};

// ✅ Clear full cart
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
};

// ✅ Count items (total quantity)
export const getCartCount = () => {
  const cart = getCartItems();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// ✅ Total Price
export const getCartTotal = () => {
  const cart = getCartItems();
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};
