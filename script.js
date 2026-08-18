const products = [
    // --- MAIN GRID PRODUCTS (IDs 1 to 9) ---
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
        image: "images/drone.svg",
        brand: "Bose",
        sku: "BOSE002"
    },
    {
        id: 3,
        name: "Simple Mobile 4G LTE Prepaid Smartphone",
        price: 220,
        image: "images/mob.svg",
        brand: "Simple Mobile",
        sku: "SM003"
    },
    {
        id: 4,
        name: "4K UHD LED Smart TV with Chromecast Built-in",
        price: 150,
        oldPrice: 865,
        image: "images/console.svg",
        brand: "Samsung",
        sku: "TV004"
    },
    {
        id: 5,
        name: "Sony DSC-HX8 High Zoom Point & Shoot Camera",
        price: 1200,
        image: "images/headphones copy.svg",
        brand: "Sony",
        sku: "SONY005"
    },
    {
        id: 6,
        name: "Dell Optiplex 7000x7480 All-in-One Computer Monitor",
        price: 299,
        image: "images/mob2.svg",
        brand: "Dell",
        sku: "DELL006"
    },
    {
        id: 7,
        name: "Portable Washing Machine, 11lbs capacity Model",
        price: 70,
        oldPrice: 865.99,
        image: "images/drone2.svg",
        brand: "Portable",
        sku: "WASH007"
    },
    {
        id: 8,
        name: "2-Barrel Carburetor Carbin 2100 Engine Horsepower",
        price: 160,
        image: "images/comp.svg",
        brand: "Carbin",
        sku: "CAR008"
    },
    {
        id: 9,
        name: "JBL FLIP 4 Waterproof Portable Bluetooth Speaker",
        price: 250,
        oldPrice: 360,
        image: "images/cam.svg",
        brand: "JBL",
        sku: "JBL009"
    },

    // --- DEDICATED MINI COLUMN PRODUCTS (IDs 10 to 16) ---
    {
        id: 10,
        name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
        price: 1500,
        image: "images/flashcam.svg",
        brand: "Bose",
        sku: "MINI01"
    },
    {
        id: 11,
        name: "Samsung Electronics Samsung Galaxy S21 5G",
        price: 1500,
        image: "images/Image.svg",
        brand: "Samsung",
        sku: "MINI02"
    },
    {
        id: 12,
        name: "TOZO T6 True Wireless Earbuds Bluetooth Headpho...",
        price: 1500,
        image: "images/mob.svg",
        brand: "TOZO",
        sku: "MINI03"
    },
    {
        id: 13,
        name: "Simple Mobile 5G LTE Galaxy 12 Mini 512GB Gaming Phone",
        price: 1500,
        image: "images/mob.svg",
        brand: "Simple Mobile",
        sku: "MINI04"
    },
    {
        id: 14,
        name: "Sony DSCHX8 High Zoom Point & Shoot Camera",
        price: 1500,
        image: "images/drone.svg",
        brand: "Sony",
        sku: "MINI05"
    },
    {
        id: 15,
        name: "JBL FLIP 4 - Waterproof Portable Bluetooth Speaker...",
        price: 1500,
        image: "images/headphones copy.svg",
        brand: "JBL",
        sku: "MINI06"
    },
    {
        id: 16,
        name: "Wyze Cam Pan v2 1080p Pan/Tilt/Zoom Wi-Fi Indoor Smart...",
        price: 1500,
        image: "images/console.svg",
        brand: "Wyze",
        sku: "MINI07"
    }
];

let cart = JSON.parse(localStorage.getItem("cliconCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("cliconWishlist")) || [];

/* =====================================================
   WISHLIST STORAGE & MANAGEMENT
===================================================== */
function saveWishlist() {
    localStorage.setItem("cliconWishlist", JSON.stringify(wishlist));
}

function toggleWishlist(id, event) {
    if (event) event.stopPropagation();

    const index = wishlist.indexOf(id);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(id);
    }

    saveWishlist();
    displayProducts();

    if (selectedProduct && selectedProduct.id === id) {
        updateModalWishlistState();
    }
}

function updateModalWishlistState() {
    const modalWishlistBtn = document.getElementById("modalWishlist");
    if (!modalWishlistBtn || !selectedProduct) return;

    const isWishlisted = wishlist.includes(selectedProduct.id);
    modalWishlistBtn.classList.toggle("active", isWishlisted);
    
    const icon = modalWishlistBtn.querySelector("i");
    if (icon) {
        icon.className = isWishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart";
    }
}

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
   ADD TO CART FUNCTIONALITY
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
   CART RENDERING & TOTALS
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
   BEST DEAL PRODUCTS GRID (EXPLICITLY ONLY FIRST 9)
===================================================== */
function displayProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    grid.innerHTML = "";

    // Strictly slice the array so ONLY the first 9 main products display in the main grid
    const mainGridProducts = products.slice(0, 9);

    mainGridProducts.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card";

        const isFeatured = (index === 0);
        if (isFeatured) {
            card.classList.add("featured");
        }

        const isWishlisted = wishlist.includes(product.id);
        const heartIconClass = isWishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart";

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
                            <button class="action-btn wishlist-btn ${isWishlisted ? 'active' : ''}" title="Wishlist">
                                <i class="${heartIconClass}"></i>
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
        product.oldPrice
        ? `<span class="old-price">$${product.oldPrice.toLocaleString()}</span>`
        : ""
    }
    $${product.price.toLocaleString()}
</div>

            ${
                isFeatured
                ? `
                    <div class="card-buttons">
                        <button class="wishlist ${isWishlisted ? 'active' : ''}">
                            <i class="${heartIconClass}"></i>
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

        // Wishlist handlers
        const overlayWishlistBtn = card.querySelector(".hover-overlay .wishlist-btn");
        if (overlayWishlistBtn) {
            overlayWishlistBtn.addEventListener("click", (e) => toggleWishlist(product.id, e));
        }

        const featuredWishlistBtn = card.querySelector(".wishlist");
        if (featuredWishlistBtn) {
            featuredWishlistBtn.addEventListener("click", (e) => toggleWishlist(product.id, e));
        }

        // Cart handlers
        const overlayCartBtn = card.querySelector(".hover-overlay .cart-btn");
        if (overlayCartBtn) {
            overlayCartBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                addToCart(product.id);
            });
        }

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
   PRODUCT MODAL LOGIC
===================================================== */
let selectedProduct = null;
let modalQuantity = 1;

function openModal(id) {
    selectedProduct = products.find(product => product.id === id);
    if (!selectedProduct) return;

    const modal = document.getElementById("productModal");

    document.getElementById("modalImage").src = selectedProduct.image;
    document.getElementById("modalName").textContent = selectedProduct.name;
    document.getElementById("modalSku").textContent = selectedProduct.sku || "XBOX001";
    document.getElementById("modalBrand").textContent = selectedProduct.brand || "Microsoft";
    document.getElementById("modalPrice").textContent = "$" + selectedProduct.price.toFixed(2);
    
    const oldPriceEl = document.getElementById("modalOldPrice");
    const discountEl = document.getElementById("modalDiscount");

    if (selectedProduct.oldPrice) {
        oldPriceEl.textContent = "$" + selectedProduct.oldPrice.toFixed(2);
        oldPriceEl.style.display = "inline";

        const discountPct = Math.round(((selectedProduct.oldPrice - selectedProduct.price) / selectedProduct.oldPrice) * 100);
        discountEl.textContent = `${discountPct}% OFF`;
        discountEl.style.display = "inline-block";
    } else {
        oldPriceEl.style.display = "none";
        discountEl.style.display = "none";
    }

    modalQuantity = 1;
    document.getElementById("modalQuantity").textContent = String(modalQuantity).padStart(2, "0");

    // Initialize & Reset Interactive Stars
    initStarRating();
    currentProductRating = 5;
    highlightStars(5, "active");
    const ratingValEl = document.getElementById("modalRatingVal");
    if (ratingValEl) {
        ratingValEl.textContent = "4.7 Star Rating";
    }

    modal.classList.add("active");
}

function closeModal() {
    document.getElementById("productModal")?.classList.remove("active");
}

document.getElementById("modalClose")?.addEventListener("click", closeModal);

document.getElementById("modalPlus")?.addEventListener("click", () => {
    modalQuantity++;
    document.getElementById("modalQuantity").textContent = String(modalQuantity).padStart(2, "0");
});

document.getElementById("modalMinus")?.addEventListener("click", () => {
    if (modalQuantity > 1) {
        modalQuantity--;
        document.getElementById("modalQuantity").textContent = String(modalQuantity).padStart(2, "0");
    }
});

document.getElementById("modalAddCart")?.addEventListener("click", () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct.id, modalQuantity);
    closeModal();
});

document.getElementById("modalBuyNow")?.addEventListener("click", () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct.id, modalQuantity);
    window.location.href = "cart.html";
});

/* =====================================================
   INTERACTIVE MODAL STAR RATING LOGIC
===================================================== */
let currentProductRating = 5;

function initStarRating() {
    const starContainer = document.getElementById("modalStars");
    if (!starContainer) return;

    const stars = starContainer.querySelectorAll("i");

    stars.forEach((star) => {
        const newStar = star.cloneNode(true);
        star.parentNode.replaceChild(newStar, star);
    });

    const freshStars = starContainer.querySelectorAll("i");

    freshStars.forEach((star) => {
        star.addEventListener("mouseenter", function () {
            const val = parseInt(this.getAttribute("data-value"));
            highlightStars(val, "hover");
        });

        star.addEventListener("mouseleave", function () {
            clearStarClasses("hover");
            highlightStars(currentProductRating, "active");
        });

        star.addEventListener("click", function () {
            currentProductRating = parseInt(this.getAttribute("data-value"));
            highlightStars(currentProductRating, "active");

            const ratingValEl = document.getElementById("modalRatingVal");
            if (ratingValEl) {
                ratingValEl.textContent = `${currentProductRating}.0 Star Rating`;
            }
        });
    });
}

function highlightStars(count, className) {
    const stars = document.querySelectorAll("#modalStars i");
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add(className);
        } else {
            star.classList.remove(className);
        }
    });
}

function clearStarClasses(className) {
    const stars = document.querySelectorAll("#modalStars i");
    stars.forEach((star) => star.classList.remove(className));
}

/* =====================================================
   SINGLE INITIALIZE PAGE LISTENER
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    displayProducts();
    renderCart();

    // 1. FLASH SALE TODAY COLUMN
    createMiniProducts("flashSale", [
        products[9],  // Bose Earbuds (Cam image)
        products[2],  // Simple Mobile Phone (Mob image)
        products[3]   // Smart TV (Console image)
    ]);

    // 2. BEST SELLERS COLUMN
    createMiniProducts("bestSellers", [
        products[10], // Galaxy S21 (Console image)
        products[12], // Galaxy 12 Gaming Phone (Drone image)
        products[4]   // Sony Camera (Headphones image)
    ]);

    // 3. TOP RATED COLUMN
    createMiniProducts("topRated", [
        products[6],  // Portable Washing Machine (Drone image)
        products[13], // Sony DSCHX8 Camera (Drone image)
        products[5]   // Dell Optiplex Monitor (Mob2 image)
    ]);

    // 4. NEW ARRIVAL COLUMN
    createMiniProducts("newArrival", [
        products[11], // TOZO Earbuds (Mob image)
        products[14], // JBL Bluetooth Speaker (Headphone image)
        products[15]  // Wyze Cam Pan (Console image)
    ]);

    // Category Dropdown Toggle
    const categoryBtn = document.getElementById("categoryDropdownBtn");
    const categoryDropdown = categoryBtn?.parentElement;

    if (categoryBtn && categoryDropdown) {
        categoryBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            categoryDropdown.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!categoryDropdown.contains(e.target)) {
                categoryDropdown.classList.remove("active");
            }
        });
    }

    // Black Friday Close
    const offerClose = document.querySelector(".offer-close");
    if (offerClose) {
        offerClose.addEventListener("click", () => {
            document.querySelector(".top-offer").style.display = "none";
        });
    }

    // Deal Timer
    const totalSeconds = (16 * 86400) + (21 * 3600) + (57 * 60) + 23;
    startDealTimer(totalSeconds);
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

        const formatNum = (num) => String(num).padStart(2, "0");

        timerElement.textContent = `${formatNum(days)}d : ${formatNum(hours)}h : ${formatNum(minutes)}m : ${formatNum(seconds)}s`;

        timeRemaining--;
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}