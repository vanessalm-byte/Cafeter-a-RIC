document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const authNavContainer = document.getElementById('authNavContainer');

    // 1. Procesar formulario de inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('userRole').value;
            const name = document.getElementById('userName').value.trim();
            const email = document.getElementById('userEmail').value.trim();

            localStorage.setItem('ric_user', JSON.stringify({ name, email, role }));

            // Redirigir según el rol seleccionado
            if (role === 'admin') {
                window.location.href = 'admin.html';
            } else if (role === 'barista') {
                window.location.href = 'barista.html';
            } else if (role === 'delivery') {
                window.location.href = 'delivery.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // 2. Mostrar menú de sesión activa en la barra de navegación
    if (authNavContainer) {
        const savedUser = JSON.parse(localStorage.getItem('ric_user'));
        if (savedUser) {
            const roleLabels = {
                cliente: 'Cliente',
                barista: 'Barista',
                delivery: 'Delivery',
                admin: 'Admin'
            };

            let panelLink = '';
            if (savedUser.role === 'admin') {
                panelLink = `<li><a class="dropdown-item small fw-semibold" href="admin.html"><i class="bi bi-speedometer2 me-1"></i> Panel Admin</a></li>`;
            } else if (savedUser.role === 'barista') {
                panelLink = `<li><a class="dropdown-item small fw-semibold" href="barista.html"><i class="bi bi-cup-hot me-1"></i> Barra Barista</a></li>`;
            } else if (savedUser.role === 'delivery') {
                panelLink = `<li><a class="dropdown-item small fw-semibold" href="delivery.html"><i class="bi bi-bicycle me-1"></i> Panel Delivery</a></li>`;
            }

            authNavContainer.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-coffee btn-sm rounded-pill dropdown-toggle px-3" type="button" data-bs-toggle="dropdown">
                        <i class="bi bi-person-check me-1"></i> ${savedUser.name} (${roleLabels[savedUser.role]})
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                        <li><span class="dropdown-item-text small text-muted">${savedUser.email}</span></li>
                        <li><hr class="dropdown-divider"></li>
                        ${panelLink}
                        <li><a class="dropdown-item small" href="index.html"><i class="bi bi-shop me-1"></i> Ver Menú Cliente</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><button class="dropdown-item small text-danger" id="logoutBtn">Cerrar sesión</button></li>
                    </ul>
                </div>
            `;

            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('ric_user');
                window.location.href = 'index.html';
            });
        }
    }
});