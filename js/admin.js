const DATA_URL = 'data/bebidas.json';

const DEFAULT_DRINK_IMAGES = [
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
];

let drinks = [];
const drinkFormModal = new bootstrap.Modal(document.getElementById('drinkFormModal'));

document.addEventListener('DOMContentLoaded', async () => {
    const savedUser = JSON.parse(localStorage.getItem('ric_user'));
    if (!savedUser || savedUser.role !== 'admin') {
        alert('Acceso exclusivo para administradores. Inicia sesión como Administrador.');
        window.location.href = 'login.html';
        return;
    }

    await loadAdminMenu();
    renderOrdersTable();
});

// 1. Cargar menú desde localStorage o data/bebidas.json
async function loadAdminMenu() {
    const stored = JSON.parse(localStorage.getItem('ric_menu'));
    if (stored && stored.length > 0) {
        drinks = stored;
    } else {
        try {
            const res = await fetch(DATA_URL);
            if (!res.ok) throw new Error('Usando respaldo');
            drinks = await res.json();
        } catch (err) {
            drinks = [
                { id: 1, name: "Iced Caramel Macchiato", category: "Frías", price: 78, size: "16 oz", ingredients: ["Doble shot espresso", "Leche fría", "Jarabe de vainilla", "Drizzle de caramelo", "Hielo"], description: "Capas de leche fría con un toque de vainilla, marcadas con espresso recién extraído y caramelo artesanal.", image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80" },
                { id: 2, name: "Velvet Cappuccino", category: "Calientes", price: 65, size: "12 oz", ingredients: ["Espresso doble", "Leche texturizada", "Microespuma sedosa", "Cacao en polvo"], description: "Equilibrio clásico entre intensidad de grano tostado medio y espuma de leche aterciopelada.", image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80" },
                { id: 3, name: "Iced Strawberry Matcha", category: "Especialidades", price: 85, size: "16 oz", ingredients: ["Matcha ceremonial", "Leche de avena", "Puré natural de fresa", "Hielo"], description: "Té verde matcha grado ceremonial batido a mano sobre leche cremosa y compota artesanal de fresa.", image_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80" },
                { id: 4, name: "Cold Brew Vainilla", category: "Frías", price: 72, size: "16 oz", ingredients: ["Infusión en frío 18 hrs", "Crema dulce de vainilla", "Hielo"], description: "Café infusionado en frío durante 18 horas para lograr baja acidez, coronado con crema ligera de vainilla.", image_url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80" }
            ];
        }
        localStorage.setItem('ric_menu', JSON.stringify(drinks));
    }
    renderAdminTable();
}

// 2. Renderizar tabla de bebidas y estadísticas
function renderAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    document.getElementById('statTotalDrinks').textContent = drinks.length;

    const avg = drinks.length > 0
        ? drinks.reduce((sum, d) => sum + Number(d.price), 0) / drinks.length
        : 0;
    document.getElementById('statAvgPrice').textContent = `$${avg.toFixed(2)}`;

    tbody.innerHTML = drinks.map(drink => `
        <tr>
            <td class="ps-4">
                <div class="d-flex align-items-center gap-3">
                    <img src="${drink.image_url}" alt="${drink.name}"
                         onerror="this.src='${DEFAULT_DRINK_IMAGES[0]}'"
                         class="rounded-3" style="width: 48px; height: 48px; object-fit: cover;">
                    <div class="fw-bold font-serif">${drink.name}</div>
                </div>
            </td>
            <td><span class="badge bg-light text-dark border rounded-pill">${drink.category}</span></td>
            <td>${drink.size}</td>
            <td><small class="text-muted">${(drink.ingredients || []).join(', ')}</small></td>
            <td class="fw-bold" style="color: var(--accent-coffee);">$${Number(drink.price).toFixed(2)}</td>
            <td class="text-end pe-4">
                <button class="btn btn-sm btn-outline-coffee rounded-pill me-1" onclick="editDrink(${drink.id})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteDrink(${drink.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// 3. Abrir modal para nueva bebida
window.openFormModal = function() {
    document.getElementById('formModalTitle').textContent = 'Agregar Nueva Bebida';
    document.getElementById('drinkForm').reset();
    document.getElementById('drinkId').value = '';
    drinkFormModal.show();
};

// 4. Cargar datos en modal para editar
window.editDrink = function(id) {
    const drink = drinks.find(d => d.id === id);
    if (!drink) return;

    document.getElementById('formModalTitle').textContent = 'Editar Bebida';
    document.getElementById('drinkId').value = drink.id;
    document.getElementById('drinkName').value = drink.name;
    document.getElementById('drinkCategory').value = drink.category;
    document.getElementById('drinkSize').value = drink.size;
    document.getElementById('drinkPrice').value = drink.price;
    document.getElementById('drinkIngredients').value = (drink.ingredients || []).join(', ');
    document.getElementById('drinkDesc').value = drink.description;
    document.getElementById('drinkImg').value = drink.image_url;

    drinkFormModal.show();
};

// 5. Guardar creación o edición
document.getElementById('drinkForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = document.getElementById('drinkId').value;
    const ingArray = document.getElementById('drinkIngredients').value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    const imgInput = document.getElementById('drinkImg').value.trim();

    const drinkData = {
        id: idVal ? Number(idVal) : Date.now(),
        name: document.getElementById('drinkName').value.trim(),
        category: document.getElementById('drinkCategory').value,
        size: document.getElementById('drinkSize').value.trim(),
        price: parseFloat(document.getElementById('drinkPrice').value),
        ingredients: ingArray,
        description: document.getElementById('drinkDesc').value.trim(),
        image_url: imgInput || DEFAULT_DRINK_IMAGES[Math.floor(Math.random() * DEFAULT_DRINK_IMAGES.length)]
    };

    if (idVal) {
        const index = drinks.findIndex(d => d.id === Number(idVal));
        if (index !== -1) drinks[index] = drinkData;
    } else {
        drinks.unshift(drinkData);
    }

    localStorage.setItem('ric_menu', JSON.stringify(drinks));
    renderAdminTable();
    drinkFormModal.hide();
});

// 6. Eliminar bebida
window.deleteDrink = function(id) {
    if (!confirm('¿Segura que quieres eliminar esta bebida del menú?')) return;
    drinks = drinks.filter(d => d.id !== id);
    localStorage.setItem('ric_menu', JSON.stringify(drinks));
    renderAdminTable();
};

// 7. Restaurar menú original de bebidas.json
document.getElementById('resetMenuBtn').addEventListener('click', async () => {
    if (!confirm('¿Restaurar el menú original de RIC? Se borrarán los cambios locales.')) return;
    localStorage.removeItem('ric_menu');
    await loadAdminMenu();
});

// 8. Tabla global de seguimiento de pedidos (Barista + Delivery)
function renderOrdersTable() {
    const orders = JSON.parse(localStorage.getItem('ric_orders')) || [];
    const tbody = document.getElementById('ordersTableBody');
    const badge = document.getElementById('activeOrdersBadge');

    document.getElementById('statTotalOrders').textContent = orders.length;
    const activeCount = orders.filter(o => o.status !== 'Entregado').length;
    badge.textContent = activeCount;

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Aún no hay pedidos registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const itemsSummary = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');
        return `
            <tr>
                <td class="ps-4 fw-bold font-monospace">${order.id}</td>
                <td>
                    <div class="fw-semibold">${order.customer}</div>
                    <small class="text-muted"><i class="bi bi-geo-alt"></i> ${order.address}</small>
                </td>
                <td>
                    <small class="d-block">${itemsSummary}</small>
                    <small class="text-muted fst-italic">Notas: ${order.notes}</small>
                </td>
                <td class="fw-bold" style="color: var(--accent-coffee);">$${order.total.toFixed(2)}</td>
                <td>
                    <select class="form-select form-select-sm rounded-pill" style="width: 175px;" onchange="changeOrderStatus('${order.id}', this.value)">
                        <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>🟡 Pendiente</option>
                        <option value="Preparando" ${order.status === 'Preparando' ? 'selected' : ''}>🟠 Preparando (Barra)</option>
                        <option value="Listo para envío" ${order.status === 'Listo para envío' ? 'selected' : ''}>🔵 Listo para envío</option>
                        <option value="En camino" ${order.status === 'En camino' ? 'selected' : ''}>🟣 En camino (Delivery)</option>
                        <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>🟢 Entregado</option>
                    </select>
                </td>
            </tr>
        `;
    }).join('');
}

window.changeOrderStatus = function(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('ric_orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('ric_orders', JSON.stringify(orders));
        renderOrdersTable();
    }
};