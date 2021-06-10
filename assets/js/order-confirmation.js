import {getTotalTTCFromProductList, formatPriceToEur} from "./services/CartService";

function renderHTMLProductsDetails(products) {
    let productsToDisplay = [];

    products.forEach((product) => {
        productsToDisplay.push(`
            <div class="row mt-3 mb-4 justify-content-center align-items-center top-details">
                <div class="col-4 text-center">
                    <img class="img-thumbnail" src="${product.imageUrl}" alt="">
                </div>
                <div class="col-8">
                    <h3 class="h6">${product.name}</h3>
                    <p class="overflow-auto text-nowrap">Réf : ${product._id}</p>
                    <p>${formatPriceToEur(product.price / 100)}</p>
                </div>
            </div>
        `);
    });

    return productsToDisplay.join('');
}

function renderHTMLOrderDetails(order) {
    document.getElementById('products-details').innerHTML += `
        <article class="row mt-5">
            <div class="col-12 px-3">
                <h2 class="h6">Commande n° ${order.orderId}</h2>
            </div>
            
            <div class="col-12 col-lg-6 py-4 px-3">
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">Total TTC <span>${getTotalTTCFromProductList(order.products)}</span></li>
                    <li class="list-group-item d-flex justify-content-between">
                        Nombre d'articles <span>${order.products.length}</span>
                    </li>
                </ul>
                
                <div class="bg-white border rounded py-3 px-2">
                    ` + renderHTMLProductsDetails(order.products) + `
                </div>
            </div>
        </article>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const orders = JSON.parse(localStorage.getItem('order-confirmation'));

    document.getElementById('nb-order').textContent = orders.length;

    orders.forEach((order) => {
        order.totalTTC = getTotalTTCFromProductList(order.products);
        renderHTMLOrderDetails(order);
    });
});
