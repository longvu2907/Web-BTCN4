import { AuthServerURL } from "./constants.js";

function setCartQuantity() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  $(".cart").text(cart.length > 99 ? "99+" : cart.length);
}

setCartQuantity();
