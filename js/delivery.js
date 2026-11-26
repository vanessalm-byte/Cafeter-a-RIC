document.addEventListener('DOMContentLoaded', () => {
    const savedUser = JSON.parse(localStorage.getItem('ric_user'));
    if (!savedUser || (savedUser.role !== 'delivery' && savedUser.role !== 'admin')) {
        alert('Acceso exclusivo para Repartidores. Inicia sesión con perfil de Delivery.');
        window.location.href = 'login.html';
        return;
    }

    renderDeliveryOrders();
});

function renderDeliveryOrders() {
    const orders = JSON.parse(localStorage.getItem('ric_orders')) || [];
    const grid = document.getElementById('deliveryOrdersGrid');

    // El repartidor ve las órdenes listas en barra o que ya lleva en camino
    const activeDeliveries = orders.filter(o => o.status === 'Listo para envío' || o.status === 'En camino');
    document.getElementById('countDeliveries').textContent = activeDeliveries.length;

    if (activeDeliveries.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-bicycle fs-1 text-muted"></i>
                <p class="text-muted mt-2">No hay pedidos listos para envío en este momento.</p>
            </div>`;
        return;
    }

    grid.innerHTML = activeDeliveries.map(order => {
        const onTheWay = order.status === 'En camino';
        const itemsText = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');

        return `
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
                    <div class="card-header border-0 pt-3 px-4 d-flex justify-content-between align-items-center bg-transparent">
                        <span class="fw-bold font-monospace">${order.id}</span>
                        <span class="badge rounded-pill ${onTheWay ? 'bg-primary' : 'bg-success'}">
                            ${order.status}
                        </span>
                    </div>
                    <div class="card-body px-4 d-flex flex-column">
                        <h6 class="font-serif fw-bold mb-1">${order.customer}</h6>
                        <p class="small text-muted mb-3">
                            <i class="bi bi-geo-alt-fill text-danger me-1"></i> ${order.address}
                        </p>

                        <div class="p-3 rounded-3 mb-3 small" style="background-color: #EFE9E0;">
                            <div class="mb-1"><strong>Bebidas:</strong> ${itemsText}</div>
                            <div><strong>Total a cobrar:</strong> $${order.total.toFixed(2)}</div>
                        </div>

                        <div class="mt-auto d-grid gap-2">
                            ${!onTheWay ? `
                                <button class="btn btn-outline-coffee btn-sm rounded-pill py-2" onclick="updateDeliveryStatus('${order.id}', 'En camino')">
                                    <i class="bi bi-bicycle me-1"></i> Recoger y Salir a Ruta
                                </button>
                            ` : ''}
                            <button class="btn btn-coffee btn-sm rounded-pill py-2 fw-semibold" onclick="updateDeliveryStatus('${order.id}', 'Entregado')">
                                <i class="bi bi-house-check me-1"></i> Confirmar Entrega al Cliente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.updateDeliveryStatus = function(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('ric_orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('ric_orders', JSON.stringify(orders));
        renderDeliveryOrders();
    }
};