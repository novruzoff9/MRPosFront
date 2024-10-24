document.addEventListener("DOMContentLoaded", function () {
  loadTables();
});

async function loadTables() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:5005/api/tables`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Tables could not be loaded.");
    }

    const tables = await response.json();
    const tablesContainer = document.getElementById("tables-container");
    tablesContainer.innerHTML = tables
      .map(
        (table) => `
      <div class="table" onclick="checkOrderStatus('${table.branchId}', '${
          table.tableNumber
        }')">
        <h3>Masa: ${table.tableNumber}</h3>
        <p>Depozit: ${table.deposit.toFixed(2)}%</p>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading tables:", error);
  }
}

async function checkOrderStatus(branchId, tableNumber) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://localhost:5007/api/orders/check-status?branchId=${branchId}&tableNumber=${tableNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Order status could not be checked.");
    }

    const orderStatus = await response.json();
    if (orderStatus.hasOpenOrder) {
      openOrderModal(branchId, tableNumber, orderStatus.orderId);
    } else {
      openConfirmOrderModal(branchId, tableNumber);
    }
  } catch (error) {
    console.error("Error checking order status:", error);
  }
}

function openConfirmOrderModal(branchId, tableNumber) {
  const confirmYesBtn = document.getElementById("confirmYesBtn");
  confirmYesBtn.onclick = function () {
    createOrder(branchId, tableNumber);
  };
  openModal("confirmOrderModal");
}

async function createOrder(branchId, tableNumber) {
  const token = localStorage.getItem("token");

  const orderPayload = {
    BranchId: branchId,
    TableNumber: tableNumber,
  };

  try {
    const response = await fetch(`http://localhost:5007/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const order = await response.json();
    closeModal("confirmOrderModal");
    openOrderModal(branchId, tableNumber, order.id);
  } catch (error) {
    console.error("Error creating order:", error);
    alert(error.message);
  }
}

async function openOrderModal(branchId, tableNumber, orderId) {
  const token = localStorage.getItem("token");
  const completeOrderBtn = document.getElementById("completeOrderBtn");
  completeOrderBtn.attributes["onclick"].value = `completeOrder('${orderId}')`;

  // Clear existing product entries
  const productEntries = document.getElementById("productEntries");
  productEntries.innerHTML = "";

  try {
    const response = await fetch(`http://localhost:5004/api/menu`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Products could not be loaded.");
    }

    const products = await response.json();
    const productSelects = document.querySelectorAll(".productSelect");
    productSelects.forEach((select) => {
      select.innerHTML = products.data
        .map(
          (product) => `
        <option value="${product.id}">${product.productName}</option>
      `
        )
        .join("");
    });

    // Fetch current order details
    const orderResponse = await fetch(
      `http://localhost:5007/api/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!orderResponse.ok) {
      throw new Error("Order details could not be loaded.");
    }

    const order = await orderResponse.json();
    document.getElementById("totalPrice").innerText =
      order.totalPrice.toFixed(2);

    // Clone the form to remove existing event listeners
    const oldForm = document.getElementById("orderForm");
    const newForm = oldForm.cloneNode(true);
    oldForm.parentNode.replaceChild(newForm, oldForm);

    newForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addItemsToOrder(orderId, tableNumber);
    });

    openModal("orderModal");
  } catch (error) {
    console.error("Error loading products or order details:", error);
  }
}

function addProductEntry() {
  const productEntries = document.getElementById("productEntries");
  const newEntry = document.createElement("div");
  newEntry.classList.add("product-entry");
  newEntry.innerHTML = `
    <label for="productSelect">Məhsul:</label>
    <select class="productSelect" name="product">
      <!-- Options will be dynamically loaded -->
    </select>
    <label for="quantity">Miqdar:</label>
    <input type="number" class="quantity" name="quantity" min="1" required>
    <button type="button" class="deleteaction" onclick="removeProductEntry(this)"><i class="fas fa-trash"></i></button>
  `;
  productEntries.appendChild(newEntry);

  // Load products into the new select element
  const token = localStorage.getItem("token");
  fetch(`http://localhost:5004/api/menu`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((products) => {
      const productSelect = newEntry.querySelector(".productSelect");

      productSelect.innerHTML = products.data
        .map(
          (product) => `
      <option value="${product.productId}">${product.productName}</option>
    `
        )
        .join("");
    })
    .catch((error) => console.error("Error loading products:", error));
}

function removeProductEntry(button) {
  const productEntry = button.closest(".product-entry");
  productEntry.remove();
}

async function addItemsToOrder(orderId, tableNumber) {
  const token = localStorage.getItem("token");
  const form = document.getElementById("orderForm");
  const productEntries = form.querySelectorAll(".product-entry");
  const items = await Promise.all(
    Array.from(productEntries).map(async (entry) => {
      const productId = entry.querySelector(".productSelect").value;
      const quantity = entry.querySelector(".quantity").value;

      // Fetch product details to get the product name and price
      const response = await fetch(
        `http://localhost:5002/api/products/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Product details could not be loaded.");
      }

      const product = await response.json();
      return {
        productName: product.name,
        price: product.price,
        quantity: parseInt(quantity, 10),
      };
    })
  );

  const addItemPayload = {
    orderId: orderId,
    items: items,
  };

  const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5007/orderHub")
    .build();

  try {
    const response = await fetch(`http://localhost:5007/api/orders/add-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addItemPayload),
    });

    if (!response.ok) {
      throw new Error("Items could not be added to the order.");
    }

    await connection.start();

    await connection.invoke("OrderUpdated", items, tableNumber);

    closeModal("orderModal");
  } catch (error) {
    console.error("Error adding items to order:", error);
  }
}

async function completeOrder(orderId) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://localhost:5007/api/orders/complete/${orderId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Order could not be completed.");
    }
    closeModal("orderModal");
  } catch (error) {
    console.error("Error completing order:", error);
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}

document.querySelectorAll(".close-btn").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    closeModal(this.closest(".modal").id);
  });
});

window.addEventListener("click", function (event) {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});
