async function loadTables() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:5005/api/tables", {
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
    console.log(tables);
    
    const tbody = document.querySelector("#tablesTable tbody");
    tbody.innerHTML = "";

    tables.forEach((table, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${++index}</td>
        <td>${table.tableNumber}</td>
        <td>${table.deposit}</td>
        <td>
          <button onclick="openTableEditModal('${
            table.id
          }')" class="edit"><i class="fas fa-pen"></i></button>
          <button onclick="openDeleteTableModal('${
            table.id
          }')" class="delete"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading tables:", error);
  }
}

function openDeleteTableModal(tableId) {
  openModal("deletemodal");

  const modalBody = document.querySelector("#delete-modal-body");
  modalBody.innerHTML = `
    <p>Masayı silmək istədiyinizə əminsinizmi?</p>
    <button id="deleteTableBtn" class="delete-btn">
      <i class="fas fa-trash"></i> Sil
    </button>
    <button class="close-btn">Ləğv et</button>
  `;

  document.querySelector(".close-btn").addEventListener("click", function () {
    closeModal("deletemodal");
  });

  document
    .getElementById("deleteTableBtn")
    .addEventListener("click", function () {
      deleteTable(tableId);
    });
}

async function deleteTable(tableId) {
  const token = localStorage.getItem("token");
  const endpoint = `http://localhost:5005/api/tables/${tableId}`;

  fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        alert("Masa uğurla silindi");
        closeModal("deletemodal");
        loadTables(); // Masaları tekrar yükle
      } else {
        console.log(response);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
