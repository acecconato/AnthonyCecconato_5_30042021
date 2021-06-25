import {Tooltip, Toast, Popover} from 'bootstrap';

import config from './config/config';
import { loadObjectByIdAndType } from './services/api';
import CartService, { formatPriceToEur } from './services/CartService';
import { renderAddToCartNotification } from './helpers/notifications';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

/**
 * Handle form submission
 * @param {object} e Event
 * @param {object} product Product item
 */
function handleSubmit(e, product) {
  e.preventDefault();

  product.selectedOption = document.getElementById('options').value;
  product.quantity = document.getElementById('quantity').value;

  try {
    CartService.addToCart(product);
    renderAddToCartNotification();
  } catch (err) {
    console.error(err);
    document.querySelector('#single-product > .container').innerHTML = "<p class='alert alert-danger'>Impossible d'ajouter le produit au panier</p>";
  }
}

/**
 * Render HTML product options
 * @param product
 * @return {string}
 */
function renderHTMLProductOptions(product) {
  const options = [];

  product.options.forEach((option) => {
    options.push(`<option value="${option}">${option}</option>`);
  });

  return `
        <option hidden value="">Veuillez sélectionner une option</option>
        ${options}
    `;
}

/**
 * Render HTML single product
 * @param product
 */
function renderHTMLSingleProduct(product) {
  document.querySelector('#single-product > .container').innerHTML = `
        <section class="row">
            <div class="col-12 col-md-6 position-relative overflow-hidden">
                <img class="product-image img-thumbnail" src="${product.imageUrl}" alt="">
                <p class="product-price">${formatPriceToEur(product.price / 100)}</p>
            </div>
            <div class="col-12 col-md-6">
                <h1 class="mt-3">${product.name}</h1>
                <p class="product-description">
                    ${product.description}
                </p>

                <form id="add-to-cart" method="post" action="//${config.basePath}/pages/cart.html">
                    <fieldset class="mb-4 position-relative">
                        <legend>Personnalisation du produit</legend>

                        <label class="mt-2 form-label d-block" for="options">Options du produit</label>
                        <div class="input-group mb-3">
                            <select id="options" class="form-select" aria-label="Selectionner l'option" required>
                          
                                ${renderHTMLProductOptions(product)}
                                
                            </select>
                        </div>

                        <div class="row mb-3 align-items-center">
                            <label class="col-3 form-label" for="quantity">Quantité</label>
                            <div class="col-3">
                                <input type="number" class="form-control" name="quantity" id="quantity" value="1" required>
                            </div>
                        </div>
                    </fieldset>
    
                    <input type="hidden" name="type" id="type" value="${product.type}">

                    <button type="submit" class="btn btn-orinoco">Ajouter au panier</button>
                </form>
            </div>
        </section>
    `;

  // Form submission
  document.getElementById('add-to-cart').addEventListener('submit', (e) => {
    handleSubmit(e, product);
  });
}

/**
 * Get customization options by type
 * @param type
 * @return {Promise<string>}
 */
async function getCustomizationOptionsByType(type) {
  for (const [key, value] of Object.entries(config.types_options)) {
    if (type === key) {
      return value;
    }
  }

  return Promise.reject(`Type ${type} not found!`);
}

document.addEventListener('DOMContentLoaded', async () => {
  const idProduct = urlParams.get('id');
  const type = urlParams.get('type');

  try {
    const product = await loadObjectByIdAndType(idProduct, type);
    product.option_key = await getCustomizationOptionsByType(type);
    product.type = type;

    document.title = `${product.name} - Vendu par Orinoco`;
    document.querySelector('meta[name="description"]').setAttribute('content', product.description);

    product.options = [];
    product[product.option_key].forEach((option) => {
      product.options.push(option);
    });

    renderHTMLSingleProduct(product);
  } catch (e) {
    console.error(e);
    document.querySelector('#single-product > .container').innerHTML = '<p class="alert alert-danger">Une erreur est survenue lors du chargement du produit !</p>';
  }
});
