document.addEventListener('DOMContentLoaded', () => {
    const savedUser = JSON.parse(localStorage.getItem('ric_user'));
    if (!savedUser || (savedUser.role !== 'barista' && savedUser.role !== 'admin')) {
        alert('Acceso exclusivo para Baristas. Inicia sesión con perfil de Barista.');
        window.location.href = 'login.html';
        return;
    }

    renderBaristaOrders();
});

function renderBaristaOrders() {
    const orders = JSON.parse(localStorage.getItem('ric_orders')) || [];
    const grid = document.getElementById('baristaOrdersGrid');

    // El barista solo atiende órdenes Pendientes o En preparación
    const activeOrders = orders.filter(o => o.status === 'Pendiente' || o.status === 'Preparando');

    document.getElementById('countPending').textContent = orders.filter(o => o.status === 'Pendiente').length;
    document.getElementById('countPreparing').textContent = orders.filter(o => o.status === 'Preparando').length;

    if (activeOrders.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-cup-hot fs-1 text-muted"></i>
                <p class="text-muted mt-2">No hay bebidas pendientes en barra por el momento.</p>
            </div>`;
        return;
    }

    grid.innerHTML = activeOrders.map(order => {
        const isPreparing = order.status === 'Preparando';

        const drinksList = order.items.map(item => `
            <div class="border-bottom pb-2 mb-2">
                <div class="d-flex justify-content-between fw-bold small">
                    <span>${item.qty}x ${item.name}</span>
                    <span class="text-muted">${item.size || ''}</span>
                </div>
                <small class="text-muted d-block" style="font-size: 0.78rem;">
                    Receta: ${(item.ingredients || []).join(', ')}
                </small>
            </div>
        `).join('');

        return `
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
                    <div class="card-header border-0 pt-3 px-4 d-flex justify-content-between align-items-center bg-transparent">
                        <span class="fw-bold font-monospace">${order.id}</span>
                        <span class="badge rounded-pill ${isPreparing ? 'bg-info text-dark' : 'bg-warning text-dark'}">
                            ${order.status}
                        </span>
                    </div>
                    <div class="card-body px-4 d-flex flex-column">
                        <small class="text-muted mb-3">Cliente: <strong>${order.customer}</strong> • ${order.date}</small>
                        
                        <div class="mb-3">
                            ${drinksList}
                        </div>

                        <div class="p-2 rounded-3 mb-3 small" style="background-color: #EFE9E0;">
                            <strong><i class="bi bi-chat-left-text me-1"></i> Notas:</strong> ${order.notes}
                        </div>

                        <div class="mt-auto d-grid gap-2">
                            ${!isPreparing ? `
                                <button class="btn btn-outline-coffee btn-sm rounded-pill py-2" onclick="updateBaristaStatus('${order.id}', 'Preparando')">
                                    <i class="bi bi-fire me-1"></i> Empezar a Preparar
                                </button>
                            ` : ''}
                            <button class="btn btn-coffee btn-sm rounded-pill py-2 fw-semibold" onclick="updateBaristaStatus('${order.id}', 'Listo para envío')">
                                <i class="bi bi-check2-circle me-1"></i> Terminar y Pasar a Delivery
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.updateBaristaStatus = function(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('ric_orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('ric_orders', JSON.stringify(orders));
        renderBaristaOrders();
    }
};