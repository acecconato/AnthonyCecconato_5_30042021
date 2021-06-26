/**
 * Format a number to the EUROS price format
 * @param {number} price
 * @return {string}
 */
export function formatPriceToEur(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

class CartService {
  constructor() {
    this.cart = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : {};
  }

  /**
   * Add an item to the cart
   * @param {object} item
   * @throws Error
   */
  addToCart(item) {
    if (typeof item !== 'object') {
      throw new Error(`Object expected, ${typeof item} received`);
    }

    if (!item._id || !item.selectedOption) {
      throw new Error('Invalid item');
    }

    item.identifier = this.generateIdentifierFromString(`${item._id}-${item.selectedOption}`);

    if (this.cart[item.identifier]) {
      this.updateQuantity(item.identifier, parseInt(item.quantity));
    } else {
      this.cart[item.identifier] = {
        _id: item._id,
        type: item.type,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        option_key: item.option_key,
        price: item.price,
        displayPrice: formatPriceToEur(item.price / 100),
        quantity: item.quantity,
        selectedOption: item.selectedOption,
      };

      this.updateCartCount();
    }

    let err;
    err = this.persistCart().catch((err) => err);

    if (err) {
      throw new Error(err);
    }
  }

  /**
   * Remove an item from the cart
   * @param {string} identifier
   */
  removeFromCart(identifier) {
    if (this.cart[identifier]) {
      delete this.cart[identifier];
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    this.updateCartCount();
  }

  /**
   * Return the cart
   * @return {object|{}}
   */
  getAll() {
    return this.cart;
  }

  /**
   * Get an item from the cart by his identifier
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
   * Read the cart object then returns a summary
   * @return {{delivery: string, totalTTC: string, vat: string, totalWT: string, nbItems: number}}
   */
  getSummary() {
    const prices = Object.values(this.cart)
      .map((item) => item.price * item.quantity);

    return {
      nbItems: Object.keys(this.cart).length,
      delivery: 'Gratuite',
      totalTTC: formatPriceToEur(prices.reduce((a, b) => a + b, 0) / 100),
      totalWT: formatPriceToEur((prices.reduce((a, b) => a + b, 0) / 100) * 0.80),
      vat: '20%',
    };
  }

  /**
   * Clear the cart
   * @return {void}
   */
  clearCart() {
    this.cart = {};
    localStorage.removeItem('cart');

    document.getElementById('cart-count').innerText = '0';

    let err;
    err = this.persistCart().catch((err) => err);

    if (err) {
      throw new Error(err);
    }
  }

  /**
   * Update a product's quantity in the cart based on his identifier
   * @param {string} identifier
   * @param {number} quantity
   */
  updateQuantity(identifier, quantity) {

    if (!this.cart[identifier] || !this.cart[identifier].length < 1) {
      throw new Error(`Can't load the cart item with the ${identifier} identifier`);
    }

    this.cart[identifier].quantity = parseInt(this.cart[identifier].quantity) + quantity;

    let err;
    err = this.persistCart().catch((err) => err);

    if (err) {
      throw new Error(err);
    }
  }

  /**
   * Generate a unique id based on the product _id and the selected option.
   * @param {string} str
   * @returns {string}
   */
  generateIdentifierFromString(str) {
    return str.toLowerCase()
      .replace(/\s/g, '');
  }

  /**
   * Update the cart-count element (Actually inside the top menu)
   * @return {void}
   */
  updateCartCount() {
    document.getElementById('cart-count').textContent = Object.keys(this.cart)
      .length
      .toString();
  }

  /**
   * Sort products by type and quantity
   * e.g {
   *       "teddies": [
   *           "5be9c8541c9d440000665243",
   *           "5be9c8541c9d440000665243",
   *           "5beaa8bf1c9d440000a57d94",
   *           "5beaa8bf1c9d440000a57d94"
   *       ],
   *       "cameras": [
   *           "5be1ed3f1c9d44000030b061",
   *           "5be1ed3f1c9d44000030b061"
   *       ]
   *   }
   * @return {Object}
   */
  getProductsSortedByType() {
    const sortedProducts = {};

    Object.values(this.cart)
      .forEach((item) => {
        if (sortedProducts[item.type]) {
          for (let i = 0; i < item.quantity; i++) {
            sortedProducts[item.type].push(item._id);
          }
        } else {
          sortedProducts[item.type] = [];

          for (let i = 0; i < item.quantity; i += 1) {
            sortedProducts[item.type].push(item._id);
          }
        }
      });

    return sortedProducts;
  }

  /**
   * Persist the cart in the localStorage
   * @returns {Promise<void>}
   * @throws {ReferenceError}
   */
  async persistCart() {

    if (!this.cart) {
      throw new ReferenceError('Cart object doesn\'t exists');
    }

    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
}

/**
 * Returns total price from a product list
 * @param {array} products
 */
export function getTotalTTCFromProductList(products) {
  let totalTTC = 0;
  products.forEach((product) => {
    totalTTC += product.price;
  });

  return formatPriceToEur(totalTTC / 100);
}

export default new CartService();
