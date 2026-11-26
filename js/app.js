const DATA_URL = 'data/bebidas.json';

// Respaldo interno por si abres index.html sin Live Server
const BACKUP_DRINKS = [
    {
        id: 1,
        name: "Iced Caramel Macchiato",
        category: "Frías",
        price: 78,
        size: "16 oz",
        ingredients: ["Doble shot espresso", "Leche fría", "Jarabe de vainilla", "Drizzle de caramelo", "Hielo"],
        description: "Capas de leche fría con un toque de vainilla, marcadas con espresso recién extraído y caramelo artesanal.",
        image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Velvet Cappuccino",
        category: "Calientes",
        price: 65,
        size: "12 oz",
        ingredients: ["Espresso doble", "Leche texturizada", "Microespuma sedosa", "Cacao en polvo"],
        description: "Equilibrio clásico entre intensidad de grano tostado medio y espuma de leche aterciopelada.",
        image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Iced Strawberry Matcha",
        category: "Especialidades",
        price: 85,
        size: "16 oz",
        ingredients: ["Matcha ceremonial", "Leche de avena", "Puré natural de fresa", "Hielo"],
        description: "Té verde matcha grado ceremonial batido a mano sobre leche cremosa y compota artesanal de fresa.",
        image_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Cold Brew Vainilla",
        category: "Frías",
        price: 72,
        size: "16 oz",
        ingredients: ["Infusión en frío 18 hrs", "Crema dulce de vainilla", "Hielo"],
        description: "Café infusionado en frío durante 18 horas para lograr baja acidez, coronado con crema ligera de vainilla.",
        image_url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Chai Latte Especiado",
        category: "Calientes",
        price: 70,
        size: "12 oz",
        ingredients: ["Concentrado de té negro", "Canela, cardamomo y jengibre", "Leche vaporizada"],
        description: "Mezcla aromática de especias dulces infusionadas con té negro y leche cremosa.",
        image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Mocha Avellana",
        category: "Calientes",
        price: 75,
        size: "12 oz",
        ingredients: ["Espresso", "Chocolate semiamargo", "Jarabe de avellana", "Leche vaporizada"],
        description: "Chocolate oscuro fundido con espresso intenso y notas tostadas de avellana.",
        image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Espresso Tonic Cítrico",
        category: "Especialidades",
        price: 76,
        size: "14 oz",
        ingredients: ["Doble espresso", "Agua quina premium", "Rodaja de naranja deshidratada", "Hielo"],
        description: "Bebida refrescante y burbujeante que combina el amargor elegante del espresso con notas cítricas.",
        image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Frappé Cookies & Cream",
        category: "Frías",
        price: 82,
        size: "16 oz",
        ingredients: ["Base de café frío", "Leche entera", "Galleta de chocolate triturada", "Crema batida"],
        description: "Textura cremosa tipo frappé con trozos de galleta de cacao y un toque de espresso.",
        image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80"
    }
];

let allDrinks = [];
let cart = JSON.parse(localStorage.getItem('ric_cart')) || [];
let currentCategory = 'all';

const productsGrid = document.getElementById('productsGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('#filterButtons button');
const drinkModal = new bootstrap.Modal(document.getElementById('drinkModal'));

document.addEventListener('DOMContentLoaded', () => {
    loadDrinks();
    renderCart();
});

// 1. Cargar bebidas desde localStorage, bebidas.json o respaldo interno
async function loadDrinks() {
    const storedMenu = JSON.parse(localStorage.getItem('ric_menu'));

    if (storedMenu && storedMenu.length > 0) {
        allDrinks = storedMenu;
    } else {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error('Usando respaldo local');
            allDrinks = await response.json();
        } catch (error) {
            allDrinks = BACKUP_DRINKS;
        }
        localStorage.setItem('ric_menu', JSON.stringify(allDrinks));
    }

    loadingSpinner.style.display = 'none';
    renderFeatured(allDrinks[0]);
    renderDrinks(allDrinks);
}

// 2. Bebida destacada en el Hero
function renderFeatured(drink) {
    const featuredCard = document.getElementById('featuredCard');
    featuredCard.innerHTML = `
        <div class="row g-0 align-items-center bg-white">
            <div class="col-5">
                <img src="${drink.image_url}" alt="${drink.name}" class="img-fluid h-100" style="object-fit: cover; min-height: 220px;">
            </div>
            <div class="col-7 p-4">
                <span class="badge rounded-pill mb-2" style="background-color: var(--accent-coffee);">Recomendación RIC</span>
                <h5 class="font-serif fw-bold mb-1">${drink.name}</h5>
                <p class="text-muted small mb-2">${drink.category} • ${drink.size}</p>
                <p class="fw-bold fs-5 mb-3" style="color: var(--accent-coffee);">$${Number(drink.price).toFixed(2)}</p>
                <button class="btn btn-sm btn-outline-coffee rounded-pill px-3" onclick="addToCart(${drink.id})">
                    + Agregar a mi orden
                </button>
            </div>
        </div>
    `;
}

// 3. Renderizar tarjetas del menú
function renderDrinks(drinks) {
    productsGrid.innerHTML = '';

    if (drinks.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted">No encontramos bebidas con ese filtro.</p>
            </div>`;
        return;
    }

    drinks.forEach(drink => {
        const ingredientsPreview = (drink.ingredients || []).slice(0, 3).join(' • ');

        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-3';
        col.innerHTML = `
            <div class="card h-100 coffee-card rounded-4 overflow-hidden">
                <div class="coffee-img-box position-relative p-0 overflow-hidden">
                    <span class="badge bg-white text-dark border position-absolute top-0 start-0 m-3 rounded-pill small">
                        ${drink.category}
                    </span>
                    <img src="${drink.image_url}" alt="${drink.name}" class="w-100 h-100" style="object-fit: cover;">
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <h5 class="card-title font-serif fw-bold fs-6 mb-0">${drink.name}</h5>
                        <span class="fw-bold" style="color: var(--accent-coffee);">$${Number(drink.price).toFixed(2)}</span>
                    </div>
                    <p class="text-muted small mb-2">${drink.size}</p>
                    <p class="text-muted small mb-3" style="font-size: 0.78rem;">${ingredientsPreview}</p>
                    <div class="mt-auto d-flex gap-2">
                        <button class="btn btn-outline-coffee btn-sm rounded-pill flex-grow-1" onclick="openDrinkModal(${drink.id})">
                            Ingredientes
                        </button>
                        <button class="btn btn-coffee btn-sm rounded-circle" onclick="addToCart(${drink.id})" title="Agregar">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsGrid.appendChild(col);
    });
}

// 4. Filtros por categoría y búsqueda
function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();

    const filtered = allDrinks.filter(drink => {
        const matchesName = drink.name.toLowerCase().includes(query);
        const matchesIng = (drink.ingredients || []).some(i => i.toLowerCase().includes(query));
        const matchesCat = currentCategory === 'all' || drink.category === currentCategory;

        return (matchesName || matchesIng) && matchesCat;
    });

    renderDrinks(filtered);
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        applyFilters();
    });
});

searchInput.addEventListener('input', applyFilters);

// 5. Modal de detalle e ingredientes
window.openDrinkModal = function(id) {
    const drink = allDrinks.find(d => d.id === id);
    if (!drink) return;

    const ingBadges = (drink.ingredients || [])
        .map(ing => `<span class="badge rounded-pill text-dark fw-normal me-1 mb-1" style="background-color: #EFE9E0;">${ing}</span>`)
        .join('');

    document.getElementById('modalBodyContent').innerHTML = `
        <div class="row align-items-center g-4">
            <div class="col-md-5 text-center">
                <img src="${drink.image_url}" alt="${drink.name}" class="img-fluid rounded-4 shadow-sm" style="max-height: 280px; object-fit: cover;">
            </div>
            <div class="col-md-7">
                <span class="text-uppercase small text-muted">${drink.category} • ${drink.size}</span>
                <h3 class="font-serif fw-bold my-2">${drink.name}</h3>
                <h4 class="fw-bold mb-3" style="color: var(--accent-coffee);">$${Number(drink.price).toFixed(2)}</h4>
                <p class="text-muted small mb-3">${drink.description}</p>
                <div class="mb-4">
                    <span class="d-block small fw-semibold mb-1">Preparación / Ingredientes:</span>
                    ${ingBadges}
                </div>
                <button class="btn btn-coffee rounded-pill w-100 py-2" onclick="addToCart(${drink.id}); drinkModal.hide();">
                    Agregar a mi Orden
                </button>
            </div>
        </div>
    `;
    drinkModal.show();
};

// Verificar si el usuario inició sesión antes de ordenar
function requireLogin() {
    const savedUser = JSON.parse(localStorage.getItem('ric_user'));
    if (!savedUser) {
        alert('Debes iniciar sesión o registrarte antes de armar un pedido en RIC.');
        window.location.href = 'login.html';
        return null;
    }
    return savedUser;
}

// 6. Carrito de compras (exige sesión iniciada)
window.addToCart = function(id) {
    if (!requireLogin()) return;

    const drink = allDrinks.find(d => d.id === id);
    if (!drink) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: drink.id,
            name: drink.name,
            price: Number(drink.price),
            size: drink.size,
            ingredients: drink.ingredients || [],
            image: drink.image_url,
            qty: 1
        });
    }
    saveAndRenderCart();
};

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveAndRenderCart();
};

function saveAndRenderCart() {
    localStorage.setItem('ric_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const countBadge = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartTotal');

    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    countBadge.textContent = totalItems;
    totalEl.textContent = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-muted text-center small my-5">Tu orden está vacía. Elige una bebida del menú.</p>`;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="d-flex align-items-center gap-3 bg-white p-2 rounded-3 mb-2 border">
            <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: cover;" class="rounded-2">
            <div class="flex-grow-1">
                <h6 class="mb-0 small fw-bold">${item.name}</h6>
                <small class="text-muted">${item.qty} x $${item.price.toFixed(2)}</small>
            </div>
            <button class="btn btn-sm text-danger" onclick="removeFromCart(${item.id})">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `).join('');
}

// 7. Confirmar pedido (bloqueado si no hay usuario registrado)
document.getElementById('checkoutBtn').addEventListener('click', () => {
    const savedUser = requireLogin();
    if (!savedUser) return;

    if (cart.length === 0) return alert('Agrega al menos una bebida a tu orden.');

    const addressInput = document.getElementById('deliveryAddress');
    const address = addressInput.value.trim();
    if (!address) {
        addressInput.focus();
        return alert('Por favor escribe tu dirección de entrega para el servicio de Delivery.');
    }

    const notes = document.getElementById('orderNotes').value.trim() || 'Sin indicaciones especiales';
    const orders = JSON.parse(localStorage.getItem('ric_orders')) || [];

    const newOrder = {
        id: 'RIC-' + Math.floor(1000 + Math.random() * 9000),
        customer: savedUser.name,
        email: savedUser.email,
        address: address,
        notes: notes,
        date: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        items: [...cart],
        total: cart.reduce((acc, item) => acc + (item.price * item.qty), 0),
        status: 'Pendiente'
    };

    orders.unshift(newOrder);
    localStorage.setItem('ric_orders', JSON.stringify(orders));

    alert(`¡Orden ${newOrder.id} enviada a barra a nombre de ${savedUser.name}!`);
    cart = [];
    addressInput.value = '';
    document.getElementById('orderNotes').value = '';
    saveAndRenderCart();
});