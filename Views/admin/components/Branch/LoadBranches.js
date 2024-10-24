async function loadBranches() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:5005/api/branches/summary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const branches = await response.json();
    console.log(branches);
    
    const tbody = document.querySelector("#branchesTable tbody");
    tbody.innerHTML = "";

    branches.data.forEach((branch, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${++index}</td>
                <td>${branch.id}</td>
                <td>${branch.companyId}</td>
                <td>${branch.is24Hour}</td>
                <td>${branch.opening}</td>
                <td>${branch.closing}</td>
                <td>
                    <button onclick="openBranchEditModal('${
                      branch.id
                    }')" class="edit"><i class="fas fa-pen"></i></button>
                    <button onclick="openDeleteBranchModal('${
                      branch.id
                    }')" class="delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Çalışanlar yüklenirken hata oluştu:", error);
  }
}

// Şube silme modalını aç
function openDeleteBranchModal(branchId) {
  openModal("deletemodal");

  const modalBody = document.querySelector("#delete-modal-body");
  modalBody.innerHTML = `
    <p>Filialı silmək istədiyinizə əminsinizmi?</p>
    <button id="deleteBranchBtn" class="delete-btn">
      <i class="fas fa-trash"></i> Sil
    </button>
    <button class="close-btn">Ləğv et</button>
  `;

  document.querySelector(".close-btn").addEventListener("click", function () {
    closeModal("deletemodal");
  });

  document
    .getElementById("deleteBranchBtn")
    .addEventListener("click", function () {
      deleteBranch(branchId);
    });
}

// Şubeyi sil
async function deleteBranch(branchId) {
  const token = localStorage.getItem("token");
  const endpoint = `http://localhost:5005/api/branches/${branchId}`;

  fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        alert("Filial uğurla silindi");
        closeModal("deletemodal");
        loadBranches(); // Şubeyi tekrar yükle
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
