import config from "./config/config.js";

// TODO move to single file
const TYPES = {
    teddies: 'colors',
    cameras: 'lenses',
    furniture: 'varnish'
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Todo move to a single file with only API functions
async function loadObjectByIdAndType(id, type) {
    const response = await fetch(
        config.apiUrl + '/' + type + '/' + id,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }
    ).catch((e) => {
        console.error(e);
    });

    return response.json();
}

function renderHTMLSingleProduct(product) {
    document.querySelector('#single-product > .container').innerHTML = `
        <section class="row">
            <div class="col-12 col-md-6 position-relative overflow-hidden">
                <img class="product-image img-thumbnail" src="${product.imageUrl}" alt="">
                <p class="product-price">${product.price} €</p>
            </div>
            <div class="col-12 col-md-6">
                <h1 class="mt-3">${product.name}</h1>
                <p class="product-description">
                    ${product.description}
                </p>

                <form method="post" action="">
                    <fieldset class="mb-4 position-relative">
                        <legend>Personnalisation du produit</legend>

                        <label class="mt-2 form-label d-block" for="options">Options du produit</label>
                        <div class="input-group mb-3">
                            <select id="options" class="form-select" aria-label="Selectionner l'option">
                                <option>Chargement en cours...</option>
                            </select>
                        </div>

                        <div class="row mb-3 align-items-center">
                            <label class="col-3 form-label" for="quantity">Quantité</label>
                            <div class="col-2">
                                <input type="number" class="form-control" name="quantity" id="quantity" value="1">
                            </div>
                        </div>
                    </fieldset>

                    <button type="submit" class="btn btn-orinoco">Ajouter au panier</button>
                </form>
            </div>
        </section>
    `;
}

function renderHTMLProductOptions(product) {
    let options = [];

    product[product.options].forEach((option) => {
        options.push(`<option value="${option}">${option}</option>`)
    });

    document.getElementById('options').innerHTML = `
        <option selected>Veuillez sélectionner une option</option>
        ${options}
    `;
}

async function getCustomizationOptionsByType(type) {
    for (const [key, value] of Object.entries(TYPES)) {
        if (type === key) {
            return value;
        }
    }

    return Promise.reject('Type ' + type + ' not found!');
}

document.addEventListener('DOMContentLoaded', async () => {
    const idProduct = urlParams.get('id');
    const type = urlParams.get('type');

    try {
        let product = await loadObjectByIdAndType(idProduct, type);
        product.options = await getCustomizationOptionsByType(type);

        renderHTMLSingleProduct(product);
        renderHTMLProductOptions(product)
    } catch (e) {
        console.error(e)
        document.querySelector('#single-product > .container').innerHTML = `<p class="alert alert-danger">Une erreur est survenue lors du chargement du produit !</p>`
    }
});
