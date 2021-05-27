import config from './config/config.js';
import {loadObjectsFromApi} from "./services/api";

let products = [];

function renderHTMLProduct(product, type) {
    return `
        <article data-id="${product._id}" class="col-8 col-md-6 col-xl-3 d-flex flex-column justify-content-between mx-auto mx-lg-0">
            <img src="${product.imageUrl}" alt="">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${product.price}€</p>

            <div class="product-action">
                <a href="//${config.basePath}/pages/product.html?id=${product._id}&type=${type}" 
                class="btn btn-orinoco btn-buy" 
                aria-label="Acheter">
                    <i class="bi bi-cart-plus-fill"></i>
                </a>
            </div>
        </article>
    `;
}

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

        let productListItemsElement = document.getElementById('product-list-items');

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
                    productListItemsElement.innerHTML = `<p class="alert alert-warning">Aucun produit trouvé</p>`
                }
            }, 300)
        } catch (e) {
            console.error(e);
            productListItemsElement.innerHTML = `<p class="alert alert-danger">Une erreur est survenue lors de la récupération des produits</p>`
        }
    })
})
