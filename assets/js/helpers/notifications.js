import config from "../config/config";
import {Toast} from "bootstrap";

export function renderAddToCartNotification() {
    document.getElementById('toast-container').innerHTML = `
        <div id="toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
                Article ajouté dans le panier
                <div class="mt-2 pt-2 border-top">
                    <a href="//${config.basePath}/pages/cart.html" type="button" class="btn btn-primary btn-sm">Procéder au paiement</a>
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Continuer</button>
                </div>
            </div>
        </div>
    `
    new Toast(document.querySelector('#toast')).show();
}
