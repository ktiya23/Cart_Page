document.addEventListener("DOMContentLoaded", async () => {
    const cartList = document.getElementById("cart-list");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    // Fetch cart data from API
    const fetchCartData = async () => {
        try {
            const response = await fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889");
            const data = await response.json();
            return data.items;
        } catch (error) {
            console.error("Error fetching cart data:", error);
            return [];
        }
    };

    // Render cart items
    const renderCart = async () => {
        const cartItems = await fetchCartData();
        cartList.innerHTML = "";

        let subtotal = 0;

        cartItems.forEach(item => {
            subtotal += (item.price * item.quantity) / 100; // Convert price to INR

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="item-details">
                    <p class="item-title">${item.title}</p>
                    <p class="item-price">₹${(item.price / 100).toFixed(2)}</p>
                    <div class="item-quantity">
                        <button class="decrease-qty" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="increase-qty" data-id="${item.id}">+</button>
                    </div>
                </div>
                <p class="remove-item" data-id="${item.id}">🗑️</p>
            `;

            cartList.appendChild(cartItem);
        });

        // Update subtotal and total
        subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
        totalEl.textContent = `₹${subtotal.toFixed(2)}`;

        addEventListeners();
    };

    // Handle quantity changes and item removal
    const addEventListeners = () => {
        document.querySelectorAll(".increase-qty").forEach(button => {
            button.addEventListener("click", (e) => {
                const itemId = e.target.dataset.id;
                updateQuantity(itemId, 1);
            });
        });

        document.querySelectorAll(".decrease-qty").forEach(button => {
            button.addEventListener("click", (e) => {
                const itemId = e.target.dataset.id;
                updateQuantity(itemId, -1);
            });
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const itemId = e.target.dataset.id;
                removeItem(itemId);
            });
        });
    };

    // Update quantity of an item
    const updateQuantity = (itemId, change) => {
        const inputField = document.querySelector(`input[data-id="${itemId}"]`);
        let newValue = parseInt(inputField.value) + change;
        if (newValue < 1) newValue = 1;
        inputField.value = newValue;
        renderCart();
    };

    // Remove item from cart
    const removeItem = (itemId) => {
        if (confirm("Are you sure you want to remove this item?")) {
            document.querySelector(`.remove-item[data-id="${itemId}"]`).parentElement.remove();
            renderCart();
        }
    };

    // Initial render
    renderCart();
});
