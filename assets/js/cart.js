import CartService from './services/CartService.js';
import Validator from "./services/Validator";

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
    _toggleChildButtons(target.parentElement);

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
    _toggleChildButtons(target.parentElement);
}

/**
 * Enable / Disable .btn child elements from a target
 *
 * When the user click on increase or decrease button from the cart page, we need to disable the buttons
 * to prevent spam until the process is terminated
 * @param target
 * @private
 */
function _toggleChildButtons(target) {
    Array.from(target.getElementsByClassName('btn')).forEach(element => {
        if (element.classList.contains('disabled')) {
            element.classList.remove('disabled')
        } else {
            element.classList.add('disabled');
        }
    })
}

/**
 * Create and display a new error on the specified field
 * @param fieldNode
 * @param message
 * @private
 */
function _setError(fieldNode, message) {

    const feedbackId = fieldNode.id + '-feedback';
    const feedbackElt = document.getElementById(feedbackId);

    if (!feedbackElt) {
        let errFeedbackElt = document.createElement('div');
        errFeedbackElt.classList.add('invalid-feedback');
        errFeedbackElt.id = fieldNode.id + '-feedback';
        errFeedbackElt.textContent = message;

        fieldNode.parentNode.append(errFeedbackElt);
    }

    if (feedbackElt && message !== feedbackElt.textContent) {
        feedbackElt.textContent = message;
    }

    fieldNode.setCustomValidity(message);
}

function formProcess(form) {
    form.classList.add('was-validated');
    // Todo process form submit
}

/**
 * Validate a form field
 * @param fieldNode
 * @param value
 * @private
 */
function _validateInput(fieldNode, value) {

    let err = false;

    if (value.length < 1) {

        err = true;
        _setError(fieldNode, "Ne doit pas être vide");

    } else {

        switch (fieldNode.id) {
            case 'email':
                if (value.length > 20) {
                    err = true;
                    _setError(fieldNode, "Ne peut exceder 20 caractères");

                } else if (!Validator.isValidEmail(value)) {
                    err = true;
                    _setError(fieldNode, "Format invalide");
                }

                break;

            case 'firstname':
            case 'lastname':
                if (value.length > 15) {
                    err = true;
                    _setError(fieldNode, "Ne peut exceder 15 caractères");

                } else if (!Validator.isValidName(value)) {
                    err = true;
                    _setError(fieldNode, "Contient des caractères invalides");
                }

                break;

            case 'address':
                if (value.length < 5) {
                    err = true;
                    _setError(fieldNode, "L'adresse est trop courte");

                } else if (value.length > 50) {
                    err = true;
                    _setError(fieldNode, "Ne peut exceder 50 caractères");

                } else {
                    if (!Validator.isValidAddress(value)) {
                        err = true;
                        _setError(fieldNode, "Contient des caractères invalides.");
                    }
                }

                break;

            case 'city':
                if (value.length > 30) {
                    err = true;
                    _setError(fieldNode, "Ne peut exceder 30 caractères");
                } else if (!Validator.isValidCity(value)) {
                    err = true;
                    _setError(fieldNode, "Contient des caractères invalides");
                }

                break;

            default:
                break;
        }

    }

    if (!err) {
        fieldNode.setCustomValidity('');
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.needs-validation');
    const inputs = form.querySelectorAll('input');

    inputs.forEach((field) => {
        // When the user write in an input, validate the entry
        field.addEventListener('input', (e) => {
            const value = e.target.value.trim();

            form.classList.add('was-validated');
            _validateInput(e.target, value);

            let submitBtnElt = document.getElementById('submit');
            submitBtnElt.disabled = !form.checkValidity();
        });
    })

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.stopPropagation();
        e.preventDefault();

        formProcess(form);
    })

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
