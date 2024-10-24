async function loadEmployees() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:5006/api/employees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const employees = await response.json();
    const tbody = document.querySelector("#employeesTable tbody");

    tbody.innerHTML = "";

    employees.data.forEach((employee, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${++index}</td>
                <td>${employee.userName}</td>
                <td>${employee.email}</td>
                <td>${employee.branchId}</td>
                <td>${employee.roles}</td>
                <td>
                    <button onclick="openRoleEditModal('${
                      employee.id
                    }')" class="primary"><i class="fas fa-key"></i></button>
                    <button onclick="openChangeBranchModal('${
                      employee.id
                    }')" class="primary"><i class="fas fa-building"></i></button>
                    <button onclick="openDeleteUserModal('${
                      employee.id
                    }')" class="delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Çalışanlar yüklenirken hata oluştu:", error);
  }
}

async function openChangeBranchModal(userId) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:5005/api/branches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Branches could not be loaded.");
    }

    const branches = await response.json();
    const branchSelect = document.getElementById("branchSelect");
    branchSelect.innerHTML = branches.data
      .map(
        (branch) => `
        <option value="${branch.id}">${branch.name}</option>
      `
      )
      .join("");

    document
      .getElementById("changeBranchForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        changeUserBranch(userId);
      });

    openModal("changeBranchModal");
  } catch (error) {
    console.error("Error loading branches:", error);
  }
}

async function changeUserBranch(userId) {
  const token = localStorage.getItem("token");
  const form = document.getElementById("changeBranchForm");
  const formData = new FormData(form);
  const branchId = formData.get("branch");

  try {
    const response = await fetch(
      `http://localhost:5006/api/employees/updatebranch?userId=${userId}&branchId=${branchId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Branch could not be changed.");
    }
    closeModal("changeBranchModal");
    loadEmployees(); // Reload employees to reflect changes
  } catch (error) {
    console.error("Error changing branch:", error);
  }
}

async function openRoleEditModal(userId) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:5001/api/roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Roles could not be loaded.");
    }

    const roles = await response.json();
    const modalBody = document.getElementById("role-edit-modal-body");
    modalBody.innerHTML = `
      <form id="assignRoleForm">
        <div>
          <label for="roleSelect">Rolunu seç:</label>
          <select id="roleSelect" name="role">
            ${roles
              .map(
                (role) => `
              <option value="${role.id}">${role.name}</option>
            `
              )
              .join("")}
          </select>
        </div>
        <button type="submit" class="primaryaction">Rolu artır</button>
      </form>
    `;

    document
      .getElementById("assignRoleForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        assignRole(userId);
      });

    openModal("roleEditModal");
  } catch (error) {
    console.error("Error loading roles:", error);
  }
}

async function assignRole(userId) {
  const token = localStorage.getItem("token");
  const form = document.getElementById("assignRoleForm");
  const formData = new FormData(form);
  const role = formData.get("role");

  try {
    const response = await fetch(
      `http://localhost:5006/api/Employees/assign-role?userId=${userId}&roleId=${role}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error("Role could not be assigned.");
    }

    alert("Role assigned successfully.");
    closeModal("roleEditModal");
    loadEmployees(); // Reload employees to reflect changes
  } catch (error) {
    console.error("Error assigning role:", error);
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
