import {Tooltip, Toast, Popover} from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  // Init cart counter
  if (localStorage.getItem('cart')) {
    const cartCount = Object.keys(JSON.parse(localStorage.getItem('cart'))).length;
    document.getElementById('cart-count').innerText = cartCount.toString();
  }
});
