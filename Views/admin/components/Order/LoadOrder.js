async function loadOrders(status) {
  const token = localStorage.getItem("token");
  let apiUrl;

  if (status === "completed") {
    apiUrl = "http://localhost:5007/api/orders/completed";
  } else if (status === "active") {
    apiUrl = "http://localhost:5007/api/orders/active";
  }

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Orders could not be loaded.");
    }

    const orders = await response.json();
    const tbody = document.querySelector("#OrdersTable tbody");
    tbody.innerHTML = "";

    orders.data.forEach((order, index) => {
      const openedDate = new Date(order.opened).toLocaleString();
      const closedDate =
        order.closed &&
        new Date(order.closed).toLocaleString() !== "1/1/1, 12:00:00 AM"
          ? new Date(order.closed).toLocaleString()
          : "N/A";
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${++index}</td>
        <td>${order.id}</td>
        <td>${openedDate}</td>
        <td>${closedDate}</td>
        <td>${order.tableNumber}</td>
        <td>${order.totalPrice.toFixed(2)} AZN</td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading orders:", error);
  }
}

// Genel modal açma ve kapama işleyicisi
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}

// Tüm close butonlarına tıklama olayı ekleme
document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    closeModal(this.closest(".modal").id);
  });
});

// Modal dışına tıklayınca kapatma
window.addEventListener("click", function (event) {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});
