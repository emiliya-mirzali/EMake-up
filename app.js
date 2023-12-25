
let slideIndex = 1;
function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName('mySlides');
    const dots = document.getElementsByClassName('dot');
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    for (i = 0; dots.length > 0 && i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' active', '');
    }
    if (slides.length > 0) {
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].className += ' active';
    }
}

showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showPage(pageId) {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('basketPage').style.display = 'none';

    document.getElementById(pageId).style.display = 'block';
}
function updateTotal() {
    const totalDiv = document.getElementById('total');
    let currentTotal = 0;

    const productsInBasket = document.getElementById('fav-products').children;
    for (let i = 0; i < productsInBasket.length; i++) {
        const productText = productsInBasket[i].textContent;
        const productPrice = parseFloat(productText.split('- $')[1]);
        currentTotal += productPrice;
    }
    const totalIndicator = document.getElementById('total-indicator');
    totalIndicator.textContent = `$${currentTotal.toFixed(2)}`;
    totalDiv.innerHTML = `<b>Total: $${currentTotal.toFixed(2)}</b>`;
}

function removeProduct(productName) {
    const existingProduct = document.getElementById(productName);

    if (existingProduct) {
        existingProduct.remove();
        updateTotal();
    }
}

function addToBasket(productName, productPrice, addButton) {
    const basketDiv = document.getElementById('fav-products');

    const existingProduct = document.getElementById(productName);

    if (existingProduct) {
        existingProduct.remove();
        addButton.textContent = '+';
    } else {
        const productInBasket = document.createElement('div');
        productInBasket.classList.add('basket-product');
        productInBasket.id = productName;

        const productText = document.createElement('p');
        productText.textContent = `${productName} - $${productPrice}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.id = 'remove';
        removeButton.addEventListener('click', () => removeProduct(productName, productPrice, removeButton));

        productInBasket.appendChild(productText);
        productInBasket.appendChild(removeButton);
        basketDiv.appendChild(productInBasket);

        addButton.textContent = '-';
    }
    updateTotal();
}

const fetchData = async () => {
    const url = 'https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline';

    try {
        const response = await fetch(url);
        const result = await response.json();

        const apiResponseDiv = document.getElementById('apiResponse');

        result.forEach((product) => {
            const productDiv = document.createElement('div');
            productDiv.id = 'product';
            const addButton = document.createElement('button');
            addButton.textContent = '+';
            addButton.id = 'add';
            addButton.addEventListener('click', () => addToBasket(product.name, product.price, addButton));
            productDiv.appendChild(addButton);

            if (product.image_link) {
                const productImage = document.createElement('img');
                productImage.id = 'prod-img';
                productImage.src = product.image_link;
                productDiv.appendChild(productImage);
            }

            const productName = document.createElement('p');
            productName.id = 'name-prod';
            productName.textContent = product.name;
            productDiv.appendChild(productName);

            if (product.price) {
                const productPrice = document.createElement('p');
                productPrice.id = 'price';
                productPrice.textContent = `Price: $${product.price}`;
                productDiv.appendChild(productPrice);
            }

            if (product.rating) {
                const productRating = document.createElement('p');
                productRating.id = 'rating';
                productRating.textContent = `Rating: ${product.rating}★`;
                productDiv.appendChild(productRating);
            } else {
                const productRating = document.createElement('p');
                productRating.id = 'rating';
                productRating.textContent = 'Rating: indefinite';
                productDiv.appendChild(productRating);
            }

            if (product.product_link) {
                const moreButton = document.createElement('button');
                moreButton.id = 'more';
                moreButton.textContent = 'Go to site';
                moreButton.addEventListener('click', () => {
                    window.open(product.product_link, '_blank');
                    addToBasket(product.name, product.price);
                });
                productDiv.appendChild(moreButton);
            }

            if (product.description) {
                const descriptionButton = document.createElement('button');
                descriptionButton.id = 'description-btn';
                descriptionButton.textContent = 'Description ▼';
                productDiv.appendChild(descriptionButton);

                const descriptionText = document.createElement('p');
                descriptionText.id = 'description-text';
                descriptionText.textContent = product.description;
                descriptionText.style.display = 'none';

                descriptionButton.addEventListener('click', () => {
                    if (descriptionText.style.display === 'none') {
                        descriptionText.style.display = 'block';
                    } else {
                        descriptionText.style.display = 'none';
                    }
                });

                productDiv.appendChild(descriptionText);
            }

            apiResponseDiv.appendChild(productDiv);
        });
    } catch (error) {
        console.error(error);
    }
};

fetchData();
