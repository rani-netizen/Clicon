const products = [
    {
        id: 1,
        name: "Xbox Series S - 512GB SSD Console with Wireless Controller",
        price: 442.12,
        oldPrice: 865.99,
        image: "images/Image.svg",
        brand: "Microsoft",
        sku: "XBOX001"
    },
    {
        id: 2,
        name: "Bose Sport Earbuds-Wireless Earphones",
        price: 2300,
        oldPrice: 2500,
        image: "images/drone.svg",
        brand: "Bose",
        sku: "BOSE002"
    },
    {
        id: 3,
        name: "Simple Mobile 4G LTE Prepaid Smartphone",
        price: 220,
        oldPrice: 280,
        image: "images/mob.svg",
        brand: "Simple Mobile",
        sku: "SM003"
    },
    {
        id: 4,
        name: "4K UHD LED Smart TV with Chromecast Built-in",
        price: 51.50,
        oldPrice: 866,
        image: "images/console.svg",
        brand: "Samsung",
        sku: "TV004"
    },
    {
        id: 5,
        name: "Sony DSC-HX8 High Zoom Point & Shoot Camera",
        price: 1200,
        oldPrice: 1500,
        image: "images/headphones copy.svg",
        brand: "Sony",
        sku: "SONY005"
    },
    {
        id: 6,
        name: "Dell Optiplex 7000x7480 All-in-One Computer Monitor",
        price: 299,
        oldPrice: 350,
        image: "images/mob2.svg",
        brand: "Dell",
        sku: "DELL006"
    },
    {
        id: 7,
        name: "Portable Washing Machine, 11lbs capacity Model",
        price: 70,
        oldPrice: 866.99,
        image: "images/drone2.svg",
        brand: "Portable",
        sku: "WASH007"
    },
    {
        id: 8,
        name: "2-Barrel Carburetor Carbin 2100 Engine Horsepower",
        price: 160,
        oldPrice: 200,
        image: "images/comp.svg",
        brand: "Carbin",
        sku: "CAR008"
    },
    {
        id: 9,
        name: "JBL FLIP 4 Waterproof Portable Bluetooth Speaker",
        price: 250,
        oldPrice: 369,
        image: "images/cam.svg",
        brand: "JBL",
        sku: "JBL009"
    }
];

let cart = JSON.parse(localStorage.getItem("cliconCart")) || [];

/* =====================================================
   CART STORAGE & COUNTER
===================================================== */
function saveCart() {
    localStorage.setItem("cliconCart", JSON.stringify(cart));
}

function updateCartCount() {
    const elements = document.querySelectorAll("#cartCount");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    elements.forEach(element => {
        element.textContent = totalItems;
    });
}

/* =====================================================
   REQ 4: ADD TO CART FUNCTIONALITY
===================================================== */
function addToCart(id, quantity = 1) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity
        });
    }

    saveCart();
    updateCartCount();

    if (document.getElementById("cartItems")) {
        renderCart();
    }
}

/* =====================================================
   REQ 5 & 6: CART RENDERING, QUANTITY CONTROL & TOTALS
===================================================== */
function renderCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-flatbed"></i>
                <h3>Your Cart is Empty</h3>
                <p>Add items from the store to view them here.</p>
            </div>
        `;
        updateCartTotals(0);
        return;
    }

    let subtotalSum = 0;

    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotalSum += itemSubtotal;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-product-info">
                <button class="remove-cart" onclick="removeFromCart(${item.id})" aria-label="Remove Product">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <p>${item.name}</p>
                </div>
            </div>

            <div class="cart-price">
                $${item.price.toFixed(2)}
            </div>

            <div class="cart-quantity">
                <button onclick="changeQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>

            <div class="cart-subtotal">
                $${itemSubtotal.toFixed(2)}
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    updateCartTotals(subtotalSum);
}

function changeQuantity(id, delta) {
    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    saveCart();
    updateCartCount();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartTotals(subtotal) {
    const discount = 0;
    const tax = 0;
    const grandTotal = subtotal - discount + tax;

    const subtotalEl = document.getElementById("subtotal");
    const discountEl = document.getElementById("discount");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `$${discount.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${grandTotal.toFixed(2)} USD`;
}

/* =====================================================
   BEST DEAL PRODUCTS GRID
===================================================== */
function displayProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    grid.innerHTML = "";

    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card";

        const isFeatured = (index === 0);
        if (isFeatured) {
            card.classList.add("featured");
        }

        let badges = "";
        if (index === 0) {
            badges = `
                <span class="discount-badge">32% OFF</span>
                <span class="hot-badge">HOT</span>
            `;
        } else if (index === 1) {
            badges = `<span class="sold-badge">SOLD OUT</span>`;
        } else if (index === 3) {
            badges = `<span class="discount-badge">19% OFF</span>`;
        }

        card.innerHTML = `
            ${badges}

            <div class="product-image-wrapper">
                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
                >
                ${
                    !isFeatured
                    ? `
                        <div class="hover-overlay">
                            <button class="action-btn wishlist-btn" title="Add to Wishlist">
                                <i class="fa-regular fa-heart"></i>
                            </button>
                            <button class="action-btn cart-btn" title="Add to Cart">
                                <i class="fa-solid fa-cart-shopping"></i>
                            </button>
                            <button class="action-btn view-btn" title="Quick View">
                                <i class="fa-regular fa-eye"></i>
                            </button>
                        </div>
                    `
                    : ""
                }
            </div>

            <div class="product-name">
                ${product.name}
            </div>

            ${
                isFeatured
                ? `
                    <div class="product-rating">
                        ★★★★★ <small>(52,677)</small>
                    </div>

                    <div class="product-description">
                        Games built using the Xbox Series X|S
                        development kit showcase unparalleled
                        load times, visuals.
                    </div>
                `
                : ""
            }

            <div class="price">
                ${
                    isFeatured
                    ? `<span class="old-price">$${product.oldPrice}</span>`
                    : ""
                }
                $${product.price}
            </div>

            ${
                isFeatured
                ? `
                    <div class="card-buttons">
                        <button class="wishlist">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                        <button class="add-cart">
                            <i class="fa-solid fa-cart-shopping"></i>
                            ADD TO CART
                        </button>
                        <button class="view">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                    </div>
                `
                : ""
            }
        `;

        // Cart button handler for overlay buttons (rest of the products)
        const overlayCartBtn = card.querySelector(".hover-overlay .cart-btn");
        if (overlayCartBtn) {
            overlayCartBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                addToCart(product.id);
            });
        }

        // Cart button handler for featured card bottom bar
        const featuredCartBtn = card.querySelector(".add-cart");
        if (featuredCartBtn) {
            featuredCartBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                addToCart(product.id);
            });
        }

        card.addEventListener("click", () => openModal(product.id));
        grid.appendChild(card);
    });
}

/* =====================================================
   MINI PRODUCT COLUMNS
===================================================== */
function createMiniProducts(target, productList) {
    const container = document.getElementById(target);
    if (!container) return;

    container.innerHTML = "";

    productList.forEach(product => {
        const item = document.createElement("div");
        item.className = "mini-product";

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="mini-product-info">
                <div class="mini-product-name">${product.name}</div>
                <div class="mini-product-price">$${product.price.toLocaleString()}</div>
            </div>
        `;

        item.addEventListener("click", () => openModal(product.id));
        container.appendChild(item);
    });
}

/* =====================================================
   CATEGORY CAROUSEL
===================================================== */
const categoryList = document.getElementById("categoryList");
const nextCategory = document.getElementById("categoryNext");
const previousCategory = document.getElementById("categoryPrev");

if (nextCategory && categoryList) {
    nextCategory.addEventListener("click", () => {
        categoryList.scrollBy({ left: 110, behavior: "smooth" });
    });
}

if (previousCategory && categoryList) {
    previousCategory.addEventListener("click", () => {
        categoryList.scrollBy({ left: -110, behavior: "smooth" });
    });
}

/* =====================================================
   SEARCH
===================================================== */
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll(".product-card").forEach(card => {
            const name = card.querySelector(".product-name").textContent.toLowerCase();
            card.style.display = name.includes(value) ? "" : "none";
        });
    });
}

/* =====================================================
   PRODUCT MODAL
===================================================== */
let selectedProduct = null;
let modalQuantity = 1;

function openModal(id) {
    selectedProduct = products.find(product => product.id === id);
    if (!selectedProduct) return;

    const modal = document.getElementById("productModal");

    document.getElementById("modalImage").src = selectedProduct.image;
    document.getElementById("modalName").textContent = selectedProduct.name;
    document.getElementById("modalSku").textContent = selectedProduct.sku;
    document.getElementById("modalBrand").textContent = selectedProduct.brand;
    document.getElementById("modalPrice").textContent = "$" + selectedProduct.price;
    document.getElementById("modalOldPrice").textContent = "$" + selectedProduct.oldPrice;

    modalQuantity = 1;
    document.getElementById("modalQuantity").textContent = modalQuantity;
    modal.classList.add("active");
}

function closeModal() {
    document.getElementById("productModal")?.classList.remove("active");
}

document.getElementById("modalClose")?.addEventListener("click", closeModal);

document.getElementById("modalPlus")?.addEventListener("click", () => {
    modalQuantity++;
    document.getElementById("modalQuantity").textContent = modalQuantity;
});

document.getElementById("modalMinus")?.addEventListener("click", () => {
    if (modalQuantity > 1) {
        modalQuantity--;
    }
    document.getElementById("modalQuantity").textContent = modalQuantity;
});

document.getElementById("modalAddCart")?.addEventListener("click", () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct.id, modalQuantity);
    closeModal();
});

/* =====================================================
   INITIALIZE PAGE
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    displayProducts();
    renderCart();

    createMiniProducts("flashSale", [products[1], products[2], products[3]]);
    createMiniProducts("bestSellers", [products[4], products[5], products[2]]);
    createMiniProducts("topRated", [products[6], products[4], products[5]]);
    createMiniProducts("newArrival", [products[2], products[8], products[3]]);
});

/* =====================================================
   CLOSE BLACK FRIDAY BAR
===================================================== */
const offerClose = document.querySelector(".offer-close");
if (offerClose) {
    offerClose.addEventListener("click", () => {
        document.querySelector(".top-offer").style.display = "none";
    });
}
/* =====================================================
   ALL CATEGORY DROPDOWN TOGGLE
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const categoryBtn = document.getElementById("categoryDropdownBtn");
    const categoryDropdown = categoryBtn?.parentElement;

    if (categoryBtn && categoryDropdown) {
        categoryBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            categoryDropdown.classList.toggle("active");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!categoryDropdown.contains(e.target)) {
                categoryDropdown.classList.remove("active");
            }
        });
    }
});

/* =====================================================
   LIVE DEAL COUNTDOWN TIMER
===================================================== */
function startDealTimer(durationInSeconds) {
    const timerElement = document.getElementById("dealCountdown");
    if (!timerElement) return;

    let timeRemaining = durationInSeconds;

    function updateTimer() {
        if (timeRemaining <= 0) {
            timerElement.textContent = "00d : 00h : 00m : 00s";
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(timeRemaining / (3600 * 24));
        const hours = Math.floor((timeRemaining % (3600 * 24)) / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = Math.floor(timeRemaining % 60);

        // Format numbers with leading zeros (e.g., 05 instead of 5)
        const formatNum = (num) => String(num).padStart(2, "0");

        timerElement.textContent = `${formatNum(days)}d : ${formatNum(hours)}h : ${formatNum(minutes)}m : ${formatNum(seconds)}s`;

        timeRemaining--;
    }

    updateTimer(); // Run once immediately
    const timerInterval = setInterval(updateTimer, 1000); // Update every second
}

// Start timer when DOM is ready (16 days, 21 hours, 57 minutes, 23 seconds in total seconds)
document.addEventListener("DOMContentLoaded", () => {
    const totalSeconds = (16 * 86400) + (21 * 3600) + (57 * 60) + 23;
    startDealTimer(totalSeconds);
});