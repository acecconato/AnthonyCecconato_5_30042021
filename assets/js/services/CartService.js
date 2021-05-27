export default class CartService {

    constructor() {
        this.cart = {};
        this.__init();
    }

    __init() {
        this.cart = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : {};
    }

    addToCart(item) {

        item.identifier = this.generateIdentifierFromString(item._id + item.selectedOption);

        if (this.cart.hasOwnProperty(item.identifier)) {

            this.updateQuantity(item);

        } else {

            this.cart[item.identifier] = item;
            this.updateCartCount();
        }

        this.persistCart();
    }

    removeFromCart(identifier) {
        delete this.cart[identifier];

        this.updateCartCount();
        this.persistCart();
    }

    getAll() {
        return this.cart;
    }

    getSummary() {
        const prices = Object.values(this.cart).map(item => item.price);

        return {
            nbItems: Object.keys(this.cart).length,
            delivery: 'Gratuite',
            totalTTC: prices.reduce((a, b) => a + b, 0),
            totalWT: prices.reduce((a, b) => a + b, 0) * 0.80,
            vat: '20%',
            promoCode: 'Aucun'
        };
    }

    clearCart() {
        this.cart = {};
        localStorage.removeItem('cart');

        document.getElementById('cart-count').innerText = '0';

        this.persistCart();
    }

    updateQuantity(item) {
        this.cart[item.identifier].quantity = parseInt(this.cart[item.identifier].quantity) + parseInt(item.quantity);
    }

    generateIdentifierFromString(str) {
        return str.toLowerCase().replace(/\s/g, '');
    }

    updateCartCount() {
        document.getElementById('cart-count').innerText = Object.keys(this.cart).length.toString();
    }

    persistCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}
