export default class CartService {

    constructor() {
        this.cart = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : {};
    }

    /**
     * Add an item to the cart
     * @param {object} item
     */
    addToCart(item) {

        item.identifier = this.generateIdentifierFromString(item._id + '-' + item.selectedOption);

        if (this.cart.hasOwnProperty(item.identifier)) {

            this.updateQuantity(item.identifier, item.quantity);

        } else {

            this.cart[item.identifier] = {
                _id: item._id,
                name: item.name,
                description: item.description,
                imageUrl: item.imageUrl,
                option_key: item.option_key,
                price: item.price,
                displayPrice: this.formatPriceToEur(item.price / 100),
                quantity: item.quantity,
                selectedOption: item.selectedOption
            };

            this.updateCartCount();
        }

        this.persistCart();
    }

    /**
     * Remove an item from the cart
     * @param {string} identifier
     */
    removeFromCart(identifier) {
        delete this.cart[identifier];

        this.updateCartCount();
        this.persistCart();
    }

    /**
     * Return the cart
     * @return {object|{}}
     */
    getAll() {
        return this.cart;
    }

    /**
     *
     * @param {string} identifier
     * @return {Object|null}
     */
    getItemByIdentifier(identifier) {
        return this.cart[identifier] ?? null;
    }

    /**
     * Return the number of cart's item
     * @return {number}
     */
    count() {
        return Object.keys(this.cart).length;
    }

    /**
     * Read the cart to return a summary
     * @return {{delivery: string, totalTTC: string, vat: string, totalWT: string, nbItems: number}}
     */
    getSummary() {
        const prices = Object.values(this.cart).map(item => item.price * item.quantity);

        return {
            nbItems: Object.keys(this.cart).length,
            delivery: 'Gratuite',
            totalTTC: this.formatPriceToEur(prices.reduce((a, b) => a + b, 0) / 100),
            totalWT: this.formatPriceToEur(prices.reduce((a, b) => a + b, 0) / 100 * 0.80),
            vat: '20%'
        };
    }

    /**
     * Format a number to the EUROS price format
     * @param {number} price
     * @return {string}
     */
    formatPriceToEur(price) {
        return new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(price);
    }

    /**
     * Clear the cart
     * @return {void}
     */
    clearCart() {
        this.cart = {};
        localStorage.removeItem('cart');

        document.getElementById('cart-count').innerText = '0';

        this.persistCart();
    }

    /**
     * Update a product's quantity in the cart based on his identifier
     * @param {string} identifier
     * @param {number} quantity
     */
    updateQuantity(identifier, quantity) {
        this.cart[identifier].quantity = parseInt(this.cart[identifier].quantity) + parseInt(quantity);

        if (!this.cart[identifier].quantity) {
            this.removeFromCart(identifier);
        }

        this.persistCart();
    }

    /**
     * Generate a unique id based on the product _id and the selected option.
     * @param {string} str
     * @returns {string}
     */
    generateIdentifierFromString(str) {
        return str.toLowerCase().replace(/\s/g, '');
    }

    /**
     * Update the cart-count element (Actually inside the top menu)
     * @return {void}
     */
    updateCartCount() {
        document.getElementById('cart-count').innerText = Object.keys(this.cart).length.toString();
    }

    /**
     * Persist the cart to the localStorage
     * @return {void}
     */
    persistCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}
