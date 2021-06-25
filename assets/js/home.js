import {Tooltip, Toast, Popover} from 'bootstrap';

import config from './config/config';
import { loadObjectsFromApi } from './services/api';
import { formatPriceToEur } from './services/CartService';

let products = [];

/**
 * Render HTML product
 * @param product
 * @param type
 * @return {string}
 */
function renderHTMLProduct(product, type) {
  return `
        <article data-id="${product._id}" class="col-12 col-md-6 col-xl-3 d-flex flex-column justify-content-between mx-auto mx-lg-0">
            <img src="${product.imageUrl}" alt="">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${formatPriceToEur(product.price / 100)}</p>

            <div class="product-action">
                <a href="//${config.basePath}/pages/product.html?id=${product._id}&type=${type}" 
                class="btn btn-orinoco btn-buy" 
                aria-label="Acheter">
                    <i class="bi bi-eye"></i>
                    Voir le produit
                </a>
            </div>
        </article>
    `;
}

/**
 * Render HTML loading spinner
 * @param element
 */
function renderHTMLLoading(element) {
  element.innerHTML += `
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('home-load-products').addEventListener('click', async (e) => {
    if (!e.target.hasAttribute('data-type')) {
      return;
    }

    const productListItemsElement = document.getElementById('product-list-items');

    /* Reset products list */
    productListItemsElement.innerHTML = '';
    products = [];

    /* Toggle loading animation */
    renderHTMLLoading(productListItemsElement);

    /* Get products from the API filtered by the desired type */
    const type = e.target.getAttribute('data-type');

    try {
      const objects = await loadObjectsFromApi(type);

      objects.forEach((product) => {
        products.push(renderHTMLProduct(product, type));
      });

      /* Timeout is only for demo purposes */
      setTimeout(() => {
        /* Display loaded products, or a message */
        if (products.length > 0) {
          productListItemsElement.innerHTML = products.join('');
        } else {
          productListItemsElement.innerHTML = '<p class="alert alert-warning">Aucun produit trouvé</p>';
        }
      }, 300);
    } catch (err) {
      console.error(err);
      productListItemsElement.innerHTML = '<p class="alert alert-danger">Une erreur est survenue lors de la récupération des produits</p>';
    }
  });

  document.querySelector('.btn-orinoco[data-type]').click();
});
