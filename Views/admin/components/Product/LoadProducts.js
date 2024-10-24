async function loadProducts() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:5002/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await response.json();
    console.log(products);
    
    const tbody = document.querySelector("#productsTable tbody");
    tbody.innerHTML = "";

    products.data.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${++index}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>
                  <button onclick="openProductEditModal('${
                    product.id
                  }')" class="edit"><i class="fas fa-pen"></i></button>
                  <button onclick="openDeleteProductModal('${
                    product.id
                  }')" class="delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Məhsullar yüklənərkən xəta baş verdi:", error);
  }
}

async function loadMenuProducts() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:5004/api/menu", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await response.json();
    console.log(products);

    const tbody = document.querySelector("#productsTable tbody");
    tbody.innerHTML = "";

    products.data.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${++index}</td>
                <td>${product.productName}</td>
                <td>${product.price}</td>
                <td>
                  <button onclick="openProductEditModal('${
                    product.id
                  }')" class="edit"><i class="fas fa-pen"></i></button>
                  <button onclick="openDeleteProductModal('${
                    product.id
                  }')" class="delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Məhsullar yüklənərkən xəta baş verdi:", error);
  }
}

//CreateProduct form-u üçün category-leri düz
function fillCategoriesForForm() {
  const token = localStorage.getItem("token");
  const categorySelect = document.getElementById("categoryId");

  // Backend'deki kategoriler endpoint'ine istek atın
  fetch("http://localhost:5002/api/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }) // Örnek endpoint
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kategoriler gətirilməsində problem yarandı.");
      }
      return response.json();
      
    })
    .then((categories) => {
      categories.data.forEach((category) => {
        console.log(category);
        
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name; 
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Xəta:", error);
    });
}

function fillProductsForMenuForm() {
  const token = localStorage.getItem("token");
  const productSelect = document.getElementById("productId");

  // Backend'deki kategoriler endpoint'ine istek atın
  fetch("http://localhost:5002/api/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }) // Örnek endpoint
    .then((response) => {
      if (!response.ok) {
        throw new Error("Məhsulların gətirilməsində problem yarandı.");
      }
      return response.json();
    })
    .then((products) => {
      products.data.forEach((product) => {
        console.log(product);

        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name;
        productSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Xəta:", error);
    });
}

function openDeleteCategoryModal(categoryId) {
  openModal("deletemodal"); // Genel modal açma fonksiyonunu çağır

  const modalBody = document.querySelector("#delete-modal-body");
  modalBody.innerHTML = `
    <p>Məhsulu silmək istədiyinizə əminsinizmi?</p>
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
  const endpoint = `http://localhost:5002/api/products/${categoryId}`;

  fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        alert("Məhsul uğurla silindi");
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
