async function loadCategories() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:5002/api/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const categories = await response.json();
    const tbody = document.querySelector("#categoriesTable tbody");
    tbody.innerHTML = "";

    categories.data.forEach((category, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${++index}</td>
                <td>${category.name}</td>
                <td>
                  <button onclick="openProductsModal('${
                    category.id
                  }')" class="primaryaction"><i class="fas fa-hamburger"></i></button>
                  <button onclick="openCategoryEditModal('${
                    category.id
                  }')" class="edit"><i class="fas fa-pen"></i></button>
                  <button onclick="openDeleteCategoryModal('${
                    category.id
                  }')" class="delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Çalışanlar yüklenirken hata oluştu:", error);
  }
}

function openDeleteCategoryModal(categoryId) {
  openModal("deletemodal"); // Genel modal açma fonksiyonunu çağır

  const modalBody = document.querySelector("#delete-modal-body");
  modalBody.innerHTML = `
    <p>Kateqoriyanı silmək istədiyinizə əminsinizmi?</p>
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
      deleteCategory(categoryId);
    });
}

async function deleteCategory(categoryId) {
  const token = localStorage.getItem("token");
  const endpoint = `http://localhost:5002/api/categories/${categoryId}`;

  fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        alert("Kateqoriya uğurla silindi");
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
async function openProductsModal(categoryId) {
  const token = localStorage.getItem("token");
  // Modal'ı aç
  openModal("productsModal");

  // Modal içindeki ürün listesi elementini seç
  const productsList = document.getElementById("productsList");

  // Önceki ürünleri temizle (eğer varsa)
  productsList.innerHTML = "";

  try {
    const response = await fetch(
      `http://localhost:5002/api/Products/ByCategoryId/${categoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Ürünler yüklenirken bir hata oluştu.");
    }

    // JSON olarak dönen ürünleri al
    const products = await response.json();

    // Ürünleri modal içinde listele
    if (products.length === 0) {
      productsList.innerHTML = "<li>Bu kategoriye ait ürün bulunamadı.</li>";
    } else {
      products.data.forEach((product) => {
        const listItem = document.createElement("li");
        listItem.textContent = product.name; // product.name değişkeni, dönen üründe isme karşılık gelir
        productsList.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error("Hata:", error);
    productsList.innerHTML = "<li>Ürünler yüklenemedi.</li>";
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
