/* ============================================
   CALCULADORA DE VENTAS - Lógica JavaScript
   ============================================ */

// Definición de productos con sus precios
const PRODUCTS = {
    recarga: {
        name: 'Recarga Individual',
        costBase: 2.50,
        salePrice: 10.00
    },
    cuarto: {
        name: 'Cuarto de Caja',
        costBase: 12.50,
        salePrice: 40.00
    },
    media: {
        name: 'Media Caja',
        costBase: 25.00,
        salePrice: 90.00
    },
    caja: {
        name: 'Caja Completa',
        costBase: 50.00,
        salePrice: 150.00
    }
};

// Porcentajes de deducciones
const DEDUCCION_TRABAJADORES = 0.30; // 30%
const DEDUCCION_MANTENIMIENTO = 0.10; // 10%

/**
 * Formatea un número como moneda
 */
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

/**
 * Obtiene la cantidad ingresada para un producto
 */
function getQuantity(productKey) {
    const input = document.getElementById('qty-' + productKey);
    const value = parseInt(input.value) || 0;
    return Math.max(0, value);
}

/**
 * Ajusta la cantidad de un producto con los botones +/-
 */
function adjustQty(productKey, delta) {
    const input = document.getElementById('qty-' + productKey);
    let current = parseInt(input.value) || 0;
    current = Math.max(0, current + delta);
    input.value = current;
    calculateAll();
}

/**
 * Calcula y actualiza los resultados de todos los productos
 * incluyendo deducciones de trabajadores (30%) y mantenimiento (10%)
 */
function calculateAll() {
    let totalUnidades = 0;
    let totalVentas = 0;
    let totalCostos = 0;
    let gananciaBruta = 0;

    // Calcular cada producto
    for (const [key, product] of Object.entries(PRODUCTS)) {
        const qty = getQuantity(key);
        const ventaProducto = qty * product.salePrice;
        const costoProducto = qty * product.costBase;
        const gananciaProducto = ventaProducto - costoProducto;

        // Actualizar la UI del producto
        document.getElementById('total-venta-' + key).textContent = formatCurrency(ventaProducto);
        document.getElementById('total-costo-' + key).textContent = formatCurrency(costoProducto);

        const gananciaEl = document.getElementById('ganancia-' + key);
        gananciaEl.textContent = formatCurrency(gananciaProducto);

        // Animación cuando hay ganancia
        if (gananciaProducto > 0) {
            gananciaEl.classList.add('animate-profit');
            setTimeout(() => gananciaEl.classList.remove('animate-profit'), 400);
        }

        // Acumular totales
        totalUnidades += qty;
        totalVentas += ventaProducto;
        totalCostos += costoProducto;
        gananciaBruta += gananciaProducto;
    }

    // Calcular deducciones sobre la ganancia bruta
    const montoTrabajadores = gananciaBruta * DEDUCCION_TRABAJADORES;
    const montoMantenimiento = gananciaBruta * DEDUCCION_MANTENIMIENTO;
    const gananciaNeta = gananciaBruta - montoTrabajadores - montoMantenimiento;

    // Actualizar resumen general
    document.getElementById('total-unidades').textContent = totalUnidades;
    document.getElementById('total-ventas').textContent = formatCurrency(totalVentas);
    document.getElementById('total-costos').textContent = formatCurrency(totalCostos);

    // Ganancia bruta
    document.getElementById('ganancia-bruta').textContent = formatCurrency(gananciaBruta);

    // Deducciones
    document.getElementById('deduccion-trabajadores').textContent = '−' + formatCurrency(montoTrabajadores);
    document.getElementById('deduccion-mantenimiento').textContent = '−' + formatCurrency(montoMantenimiento);

    // Barra de distribución
    if (gananciaBruta > 0) {
        document.getElementById('barra-trabajadores').style.width = '30%';
        document.getElementById('barra-mantenimiento').style.width = '10%';
        document.getElementById('barra-neta').style.width = '60%';
    } else {
        document.getElementById('barra-trabajadores').style.width = '0%';
        document.getElementById('barra-mantenimiento').style.width = '0%';
        document.getElementById('barra-neta').style.width = '0%';
    }

    // Ganancia neta final
    const gananciaTotal = document.getElementById('ganancia-total');
    gananciaTotal.textContent = formatCurrency(gananciaNeta);

    // Animación del total
    if (gananciaNeta > 0) {
        gananciaTotal.classList.add('animate-profit');
        setTimeout(() => gananciaTotal.classList.remove('animate-profit'), 400);
    }
}

/**
 * Reinicia todas las cantidades a 0 y recalcula
 */
function resetAll() {
    for (const key of Object.keys(PRODUCTS)) {
        document.getElementById('qty-' + key).value = 0;
    }
    calculateAll();
}

/**
 * Alterna entre tema claro y oscuro
 */
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);

    // Cambiar icono
    const icon = document.getElementById('themeIcon');
    icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';

    // Guardar preferencia
    localStorage.setItem('theme', newTheme);
}

/**
 * Carga el tema guardado al iniciar
 */
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = document.getElementById('themeIcon');
        icon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadSavedTheme();
    calculateAll();
});
