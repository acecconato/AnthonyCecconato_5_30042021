import config from './config/config.js';

let products = [];

async function loadObjectsFromApi(type) {
    const response = await fetch(
        config.apiUrl + '/' + type,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }
    ).catch((e) => {
        console.error(e);
    });

    return response.json();
}

function prepareProduct(product) {
    products.push(`
        <article data-id="${product._id}" class="col-8 col-md-6 col-xl-3 d-flex flex-column justify-content-between mx-auto mx-lg-0">
            <img src="${product.imageUrl}" alt="">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${product.price}€</p>

            <div class="product-action">
                <a href="#" class="btn btn-orinoco btn-buy" aria-label="Acheter">
                    <i class="bi bi-cart-plus-fill"></i>
                </a>
                <a href="#" class="btn btn-orinoco btn-view" aria-label="Voir le produit">
                    <i class="bi bi-eye"></i>
                </a>
            </div>
        </article>
    `);
}

function toggleLoading(element) {
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
        toggleLoading(productListItemsElement);

        /* Get products from the API filtered by the desired type */
        const type = e.target.getAttribute('data-type');

        try {
            const objects = await loadObjectsFromApi(type);

            objects.forEach((product) => {
                prepareProduct(product);
            });

            /* Timeout is only for demo purposes */
            setTimeout(() => {
                /* Display loaded products, or a message */
                if (products.length > 0) {
                    productListItemsElement.innerHTML = products.join('');
                } else {
                    productListItemsElement.innerHTML = `<p class="alert alert-warning">Aucun produit trouvé</p>`
                }
            }, 1500)
        } catch (e) {
            productListItemsElement.innerHTML = `<p class="alert alert-danger">Une erreur est survenue lors de la récupération des produits</p>`
        }
    })
})
