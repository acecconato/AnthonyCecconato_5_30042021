import CartService from './services/CartService.js';

let cartItems = [];

function renderHTMLCartItem(item) {
    return `
        <article class="mt-5 mb-3 row cart-product" id="${item.identifier}">
            <div class="col-12 col-md-3">
                <img src="${item.imageUrl}" class="img-thumbnail cart-image" alt="">
            </div>
    
            <div class="mt-3 mt-md-0 col-12 col-md-8 d-flex flex-column justify-content-between">
                <h3 class="h5 d-flex justify-content-between align-items-center">
                    ${item.name}
                    <a href="#" class="cart-trash btn btn-orinoco"><i class="bi bi-trash"></i></a>
                </h3>
    
                <p class="cart-description">${item.description}</p>
    
                <div>
                    <p class="cart-customization">${item.option_key}: ${item.selectedOption}</p>
                    <p class="cart-quantity">Quantité: ${item.quantity}</p>
                </div>
            </div>
        </article>
   `;
}

function renderHTMLSummary(summary) {
    return `
        <li class="list-group-item d-flex justify-content-between">Articles <span>${summary.nbItems}</span></li>
        <li class="list-group-item d-flex justify-content-between">Livraison <span>${summary.delivery}</span></li>
        <li class="list-group-item d-flex justify-content-between">Total TTC <span>${summary.totalTTC} €</span></li>
        <li class="list-group-item d-flex justify-content-between">Total HT<span>${summary.totalWT} €</span></li>
        <li class="list-group-item d-flex justify-content-between">TVA<span>${summary.vat}</span></li>
        <li class="list-group-item d-flex justify-content-between">Code promo <span>${summary.promoCode}</span></li>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const cartService = new CartService();

    let cartListElement = document.getElementById('cart-list');
    let summaryGroupElement = document.getElementById('summary-group');

    for (const [_, item] of Object.entries(cartService.getAll())) {
        cartItems.push(renderHTMLCartItem(item));
    }

    if (cartItems.length > 0) {
        cartListElement.innerHTML += cartItems.join('');
    } else {
        cartListElement.innerHTML = `<p class="alert alert-warning">Vous n'avez pas d'articles dans votre panier</p>`;
        document.getElementById('cart-checkout').remove();
    }

    summaryGroupElement.innerHTML = renderHTMLSummary(cartService.getSummary());

});
