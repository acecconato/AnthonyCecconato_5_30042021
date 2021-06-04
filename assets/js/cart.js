import CartService from './services/CartService.js';

let cartService = new CartService();
let cartItems = [];

/**
 * Render the HTML products stored in the cart
 * @param {string} identifier
 * @param {object} item
 * @returns {string}
 */
function renderHTMLCartItem(identifier, item) {
    return `
        <article class="mt-5 mb-3 row cart-product" id="${identifier}">
            <div class="col-12 col-md-3 d-flex align-items-center">
                <img src="${item.imageUrl}" class="img-thumbnail cart-image" alt="">
            </div>
    
            <div class="mt-3 mt-md-0 col-12 col-md-8 d-flex flex-column justify-content-between">
                <h3 class="h5 d-flex justify-content-between align-items-center">
                    ${item.name}
                    <a href="#" data-delete="${identifier}" class="cart-trash btn btn-orinoco"><i class="bi bi-trash"></i></a>
                </h3>
    
                <p class="cart-price">${item.displayPrice}</p>
    
                <p class="cart-description">${item.description}</p>
    
                <div>
                    <p class="cart-customization">${item.option_key} : ${item.selectedOption}</p>
                    <p class="cart-quantity d-inline">
                        Quantité : <span class="qty">${item.quantity}</span>
                        <div class="d-inline cart-update-quantity" data-product-id="${identifier}">
                            <a class="btn btn-outline-primary" data-action="increase"><i class="bi bi-caret-up-fill"></i></a>
                            <a class="btn btn-outline-danger" data-action="decrease"><i class="bi bi-caret-down-fill"></i></a>
                        </div>
                    </p>
                </div>
            </div>
        </article>
   `;
}

/**
 * Render the HTML summary (right sidebar)
 * @param {object} summary
 * @returns {string}
 */
function renderHTMLSummary(summary) {
    document.getElementById('summary-group').innerHTML = `
        <li class="list-group-item d-flex justify-content-between">Articles <span>${summary.nbItems}</span></li>
        <li class="list-group-item d-flex justify-content-between">Livraison <span>${summary.delivery}</span></li>
        <li class="list-group-item d-flex justify-content-between">Total TTC <span>${summary.totalTTC}</span></li>
        <li class="list-group-item d-flex justify-content-between">Total HT<span>${summary.totalWT}</span></li>
        <li class="list-group-item d-flex justify-content-between">TVA<span>${summary.vat}</span></li>
    `;
}

/**
 * Render a HTML message when there is no products in the cart
 * @return void
 */
function renderHTMLNoProductInCart() {
    document.getElementById('cart-list').innerHTML = `<p class="alert alert-warning">Vous n'avez pas d'articles dans votre panier</p>`;
    document.getElementById('cart-checkout').remove();
}

/**
 * Handle user click on an update quantity button
 * @param action
 * @param target
 */
function processUpdateQuantity(action, target) {
    // Deactivate update buttons
    toggleChildButtons(target.parentElement);

    const identifier = target.parentElement.getAttribute('data-product-id');

    if (action === 'increase' && cartService.getItemByIdentifier(identifier).quantity < 99) {
        cartService.updateQuantity(identifier, 1);
    }

    if (action === 'decrease' && cartService.getItemByIdentifier(identifier).quantity > 1) {
        cartService.updateQuantity(identifier, -1);
    }

    // Update quantity field if the quantity
    document.getElementById(identifier).querySelector('span.qty').textContent = cartService.getItemByIdentifier(identifier).quantity;

    // Regenerate the summary
    renderHTMLSummary(cartService.getSummary());

    // Reactivate buttons
    toggleChildButtons(target.parentElement);
}

/**
 * Enable / Disable .btn child elements from a target
 * @param target
 */
function toggleChildButtons(target) {
    Array.from(target.getElementsByClassName('btn')).forEach(element => {
        if (element.classList.contains('disabled')) {
            element.classList.remove('disabled')
        } else {
            element.classList.add('disabled');
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.needs-validation');

    form.querySelectorAll('input').forEach((field) => {

        // When the user write in an input
        field.addEventListener('input', function (e) {
            let val = e.target.value;

            if (val != '42') {
                field.setCustomValidity('invalid');
            } else {
                e.target.setCustomValidity('');
            }

        });
    })

    // On form submit
    form.addEventListener('submit', function (event) {

        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
    }, false)




    const cartService = new CartService();

    let cartListElement = document.getElementById('cart-list');

    // List products in cart
    for (const [identifier, item] of Object.entries(cartService.getAll())) {
        cartItems.push(renderHTMLCartItem(identifier, item));
    }

    if (cartItems.length > 0) {
        cartListElement.innerHTML += cartItems.join('');
    } else {
        renderHTMLNoProductInCart();
    }

    renderHTMLSummary(cartService.getSummary());

    // Handle remove product from cart
    Array.from(document.getElementsByClassName('cart-trash')).forEach(
        (trashButton) => {
            trashButton.addEventListener('click', (e) => {
                e.stopPropagation();

                const identifier = e.currentTarget.getAttribute('data-delete')

                document.getElementById(identifier).remove();
                cartService.removeFromCart(identifier);

                if (cartService.count() < 1) {
                    renderHTMLNoProductInCart();
                }

                renderHTMLSummary(cartService.getSummary());
            })
        }
    )

    // Handle quantity update click
    Array.from(document.querySelectorAll('.cart-update-quantity > .btn')).forEach(updateQtyButton => {
        updateQtyButton.addEventListener('click', (e) => {
            e.stopPropagation();

            const dataAction = e.currentTarget.getAttribute('data-action');

            if (dataAction) {
                processUpdateQuantity(dataAction, e.currentTarget);
            }
        })
    })
});
