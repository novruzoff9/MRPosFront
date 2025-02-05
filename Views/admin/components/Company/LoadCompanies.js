async function loadCompanies() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:5005/api/companies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const companies = await response.json();
    const tbody = document.querySelector("#companiesTable tbody");
    tbody.innerHTML = "";

    console.log(companies);
    

    companies.forEach((company, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${++index}</td>
                <td>${company.name}</td>
                <td>${company.description}</td>
                <td>
                  <button onclick="openCategoryEditModal('${
                    company.id
                  }')" class="edit"><i class="fas fa-pen"></i></button>
                  <button onclick="openDeleteCompanyModal('${
                    company.id
                  }')" class="delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Şirkətlər yüklənərrken xəta oldu:", error);
  }
}

function openDeleteCompanyModal(companyId) {
  openModal("deletemodal"); // Genel modal açma fonksiyonunu çağır

  const modalBody = document.querySelector("#delete-modal-body");
  modalBody.innerHTML = `
    <p>Şirkəti silmək istədiyinizə əminsinizmi?</p>
    <button id="deleteCategoryBtn" class="delete-btn">
      <i class="fas fa-trash"></i> Sil
    </button>
    <button class="close-btn">Ləğv et</button>
  `;

  document.querySelector(".close-btn").addEventListener("click", function () {
    closeModal("deletemodal");
  });

  document
    .getElementById("deleteCategoryBtn")
    .addEventListener("click", function () {
      deleteCategory(companyId);
    });
}

async function deleteCategory(companyId) {
  const token = localStorage.getItem("token");
  const endpoint = `http://localhost:5005/api/companies/${companyId}`;

  fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        alert("Şirkət uğurla silindi");
        closeModal("deletemodal");
        loadCategories(); // Silme işlemi sonrası kategorileri tekrar yükle
      } else {
        console.log(response);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Modal açma fonksiyonu
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
