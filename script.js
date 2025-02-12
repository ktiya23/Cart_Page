document.addEventListener("DOMContentLoaded", async () => {
    const cartList = document.getElementById("cart-list");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    let cartItems = [];

    // Fetch cart data from API
    const fetchCartData = async () => {
        try {
            const response = await fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889");
            const data = await response.json();
            cartItems = data.items;
            renderCart();
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    // Function to render cart items
    const renderCart = () => {
        cartList.innerHTML = "";
        let subtotal = 0;

        cartItems.forEach((item, index) => {
            const itemPrice = item.price / 100;
            const itemTotal = (item.quantity * itemPrice).toFixed(2);
            subtotal += parseFloat(itemTotal);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    ${item.title}
                </td>
                <td>₹${itemPrice.toFixed(2)}</td>
                <td>
                    <button class="decrease-btn" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-btn" data-index="${index}">+</button>
                </td>
                <td>₹${itemTotal}</td>
                <td>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </td>
            `;

            cartList.appendChild(row);
        });

        subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
        totalEl.textContent = `₹${subtotal.toFixed(2)}`;
    };

    // Function to update item quantity
    const updateQuantity = (index, change) => {
        if (cartItems[index].quantity + change > 0) {
            cartItems[index].quantity += change;
        } else {
            cartItems.splice(index, 1); // Remove item if quantity reaches 0
        }
        renderCart();
    };

    // Function to remove item from cart
    const removeItem = (index) => {
        cartItems.splice(index, 1);
        renderCart();
    };

    // Event delegation for button clicks
    cartList.addEventListener("click", (event) => {
        if (event.target.classList.contains("increase-btn")) {
            const index = event.target.getAttribute("data-index");
            updateQuantity(index, 1);
        } else if (event.target.classList.contains("decrease-btn")) {
            const index = event.target.getAttribute("data-index");
            updateQuantity(index, -1);
        } else if (event.target.classList.contains("remove-btn")) {
            const index = event.target.getAttribute("data-index");
            removeItem(index);
        }
    });

    // Fetch and display cart on page load
    fetchCartData();
});
