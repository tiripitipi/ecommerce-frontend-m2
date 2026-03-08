
// DATOS DE LOS PRODUCTOS


const productos = [
  {
    id: 1,
    nombre: "Raqueta Wilson Pro Staff",
    descripcion: "Raqueta profesional de grafito, ideal para jugadores avanzados. Control y potencia en cada golpe. Peso: 315g, balance: 31cm, patrón de cordaje: 16x19.",
    precio: 89990,
    imagen: "img/raqueta-wilson.webp"
  },
  {
    id: 2,
    nombre: "Zapatillas Asics Gel-Dedicate 8",
    descripcion: "Zapatillas diseñadas para canchas de arcilla, con amortiguación reactiva y agarre superior. Suela duradera de goma.",
    precio: 49990,
    imagen: "img/zapatillas_asics.webp"
  },
  {
    id: 3,
    nombre: "Pelotas Babolat x4",
    descripcion: "Pack de 4 pelotas de competición. Presión constante y durabilidad garantizada. Homologadas para torneos.",
    precio: 8990,
    imagen: "img/pelotas-babolat.webp"
  },
  {
    id: 4,
    nombre: "Overgrip Wilson Pro x3",
    descripcion: "Pack de 3 overgrips absorbentes. Máximo control y comodidad en el mango. Grosor: 0.6mm.",
    precio: 4990,
    imagen: "img/overgrip-wilson.webp"
  },
  {
    id: 5,
    nombre: "Camiseta Torino Verde Ellesse",
    descripcion: "Camiseta técnica de alto rendimiento. Tejido transpirable y secado rápido. Ideal para entrenamientos y partidos.",
    precio: 19990,
    imagen: "img/camiseta-ellesse.jpg"
  },
  {
    id: 6,
    nombre: "Antivibrador Head Xtra Damp x2",
    descripcion: "Reduce las vibraciones del impacto. Pack de 2 unidades, compatible con todas las raquetas. Fácil instalación.",
    precio: 8990,
    imagen: "img/antivibrador-head.webp"
  }
];


// CARRITO - guardado en localStorage

// Carga el carrito desde localStorage o empieza vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Guarda el carrito y actualiza el contador
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

// Actualiza el numerito del badge en la navbar
function actualizarContador() {
  const total = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const badges = document.querySelectorAll("#cart-count");
  badges.forEach(badge => badge.textContent = total);
}

// Agrega un producto al carrito
function agregarAlCarrito(id, nombre, precio) {
  const existe = carrito.find(item => item.id === id);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }
  guardarCarrito();
  alert(`✅ "${nombre}" agregado al carrito`);
}


// HOME - botones y eventos

// Busca todos los botones "Agregar" y les asigna el evento click
const botonesAgregar = document.querySelectorAll(".agregar-carrito");
botonesAgregar.forEach(boton => {
  boton.addEventListener("click", function() {
    const id = parseInt(this.dataset.id);
    const nombre = this.dataset.nombre;
    const precio = parseInt(this.dataset.precio);
    agregarAlCarrito(id, nombre, precio);
  });
});

// DETALLE - carga del producto

// Verifica si estamos en detalle.html
if (document.getElementById("detalle-nombre")) {

  // Lee el id de la URL
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  // Busca el producto por su id
  const producto = productos.find(p => p.id === id);

  if (producto) {
    // Llena la página con los datos del producto
    document.getElementById("detalle-nombre").textContent = producto.nombre;
    document.getElementById("detalle-descripcion").textContent = producto.descripcion;
    document.getElementById("detalle-precio").textContent = "$" + producto.precio.toLocaleString("es-CL");
    document.getElementById("detalle-imagen").src = producto.imagen;
    document.getElementById("detalle-imagen").alt = producto.nombre;
    document.title = producto.nombre + " – El Rincón del Tenis";

    // Botón agregar al carrito
    document.getElementById("btn-agregar").addEventListener("click", function() {
      agregarAlCarrito(producto.id, producto.nombre, producto.precio);
    });
  }
}

// CARRITO - muestra los productos

if (document.getElementById("carrito-container")) {

  function renderizarCarrito() {
    const container = document.getElementById("carrito-container");
    const totalEl = document.getElementById("carrito-total");

    if (carrito.length === 0) {
      container.innerHTML = "<p class='text-muted'>Tu carrito está vacío.</p>";
      totalEl.textContent = "$0";
      return;
    }

    // tabla de productos
    let html = '<div class="list-group">';
    let total = 0;

    carrito.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      html += `
        <div class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-0">${item.nombre}</h6>
            <small class="text-muted">$${item.precio.toLocaleString("es-CL")} x ${item.cantidad}</small>
          </div>
          <div class="d-flex align-items-center gap-3">
            <span class="fw-bold text-success">$${subtotal.toLocaleString("es-CL")}</span>
            <button class="btn btn-outline-danger btn-sm btn-eliminar" data-id="${item.id}">✕</button>
          </div>
        </div>
      `;
    });

    html += "</div>";
    container.innerHTML = html;
    totalEl.textContent = "$" + total.toLocaleString("es-CL");

    // Botones eliminar producto
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", function() {
        const id = parseInt(this.dataset.id);
        carrito = carrito.filter(item => item.id !== id);
        guardarCarrito();
        renderizarCarrito();
      });
    });
  }

  // Botón vaciar carrito completo
  document.getElementById("btn-vaciar").addEventListener("click", function() {
    if (confirm("¿Seguro que quieres vaciar el carrito?")) {
      carrito = [];
      guardarCarrito();
      renderizarCarrito();
    }
  });

  renderizarCarrito();
}

// Actualiza el contador al cargar cualquier página
actualizarContador();