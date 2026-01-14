const LOGOMOBILE = document.getElementById('logo-mobile');
const FORMCARRITO = document.getElementById('popup-form');
const FORMCARRITOCONTENT = document.querySelector('.popup-cart-content');
const BTNABRIR = document.getElementById('btn-cart');
const BTNCERRAR = document.querySelector('.popup-cart-close');
const SPANCOUNT = document.getElementById('CantCartProd');
const BTNCOMPRAR = document.querySelector('.popup-cart-btn');
const POPUPCARTPRICE = document.querySelector('.popup-cart-total');
const TOTALPRECIO = document.getElementById('totalprecio');
var metadata;
let Productos = '';
let Producto = '';
let Carrito = [];
let cantidadesproductos = {};
let currentValue = 0;
let totalprice = 0;
let product = {};

fetch('/json/metadata.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo metadata.json');
        }
        return response.json(); 
    })
    .then(data => {
        metadata = data; 
        chargedata(metadata);
        verifictlocal();
    })
    .catch(error => {
        console.error("Error al cargar los metadatos:", error);
    }
);

function chargedata(metadata)  {
    if (!localStorage.getItem('spancount')) {
        localStorage.setItem('spancount', '0');
    }
    SPANCOUNT.textContent = localStorage.getItem('spancount');
    const SEARCHRESULT = metadata.productos.map(
        Producto => {
            return `
                <div class="card-product">
                        <div class="card-product-img">
                            <img src="${Producto.img}" alt="Imagen del producto">
                        </div>
                        <div class="card-product-title-price">
                            <a href=""><h2 class="title-product">${Producto.titulo}</h2></a>
                            <p>Precio: $${Producto.precio}</p>
                        </div>
                        <div class="btn-products">
                            <button class="button-shop" type="button" data-id=${Producto.id}>COMPRAR</button>
                        </div>
                </div>
            `;
        }
    );
    Productos = SEARCHRESULT.join('');
    document.getElementById('id-cards-products').innerHTML = Productos;
    const BUTTONSHOP = document.querySelectorAll('.button-shop');
    BUTTONSHOP.forEach(Button => {
        Button.addEventListener('click', function() {
            for (let i = 0; i <= Carrito.length; i++) {
                if (Carrito[i] === Button.dataset.id) {
                    alert('El producto ya está en el carrito');
                    return;
                }
            }
            Carrito.push(Button.dataset.id);
            cantidadesproductos[Button.dataset.id] = 1;
            localStorage.setItem('cantproduct', JSON.stringify(cantidadesproductos));
            localStorage.setItem('cartproducts', JSON.stringify(Carrito));
            SPANCOUNT.textContent = parseInt(JSON.parse(localStorage.getItem('spancount'))) + 1;
            localStorage.setItem('spancount', SPANCOUNT.textContent);
            ActualizarCarrito(); 
        });
    });
    BTNABRIR.addEventListener('click', function() {
        FORMCARRITO.classList.add('active');
        const RECT = BTNABRIR.getBoundingClientRect();
        RepositionarCarrito(RECT);        
    });
    BTNCERRAR.addEventListener('click', function() {
        FORMCARRITO.classList.remove('active');
    });
    ActualizarCarrito();    
};

function ActualizarCarrito() {
    Carrito = JSON.parse(localStorage.getItem('cartproducts')) || [];
    cantidadesproductos = JSON.parse(localStorage.getItem('cantproduct')) || {};
    if (Carrito.length === 0) {
        document.getElementById('popup-cart-main').innerHTML = '<p class = "cartnulltext">El carrito está vacío</p>';
        BTNCOMPRAR.style.display = 'none';
        POPUPCARTPRICE.style.display = 'none';
        return;
    } else {
        POPUPCARTPRICE.style.display = 'block';
        BTNCOMPRAR.style.display = 'block';;
    }
    const PRODUCTOSCARRITO = Carrito.map(
        id => {
            const PRODUCTO = metadata.productos.find(p => p.id === id);
            const CANTIDAD = cantidadesproductos[id] || 1;
            return `
                <div class="cart-item"> 
                    <div class="cart-item-img">
                        <img class = "cart-item-img-ui" src="${PRODUCTO.img}" alt="Imagen del producto">
                    </div>
                    <div class="cart-item-title-price">
                        <h3 class="title-product-cart">${PRODUCTO.titulo}</h3>
                        <p class="price-product-cart">Precio: $${PRODUCTO.precio}</p>
                    </div>
                    <div class="cart-item-btns"> 
                        <div class="cart-item-decrese">
                            <button class="btnmenor" type="button" data-id="menor"><i class="fa-solid fa-minus"></i></button>
                            <input class="input-cant" type="text" value="${CANTIDAD}" readonly>
                            <button class="btnmayor" type="button" data-id="mayor"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <div class="cart-item-delete">
                            <button class="button-remove" type="button" data-id=${PRODUCTO.id} data-type="remove"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div>
                </div>
            `;
        }
    );
    document.getElementById('popup-cart-main').innerHTML = PRODUCTOSCARRITO.join('');
    const BUTTONREMOVE = document.querySelectorAll('.button-remove');
    const INPUTCANT = document.querySelectorAll('.input-cant');
    const BTNMAYOR = document.querySelectorAll('.btnmayor');
    const BTNMENOR = document.querySelectorAll('.btnmenor');
    BUTTONREMOVE.forEach((Button, index) => {
        Button.addEventListener('click', function() {
            ModificarCantidadProducto(Button, index);
            ActualizarCarrito();
        });
    });
    BTNMAYOR.forEach((Button, index) => {
        Button.addEventListener('click', function() {
            ModificarCantidadProducto(Button, index, INPUTCANT);
        })
    });
    BTNMENOR.forEach((Button, index) => {
        Button.addEventListener('click', function() {
            ModificarCantidadProducto(Button, index, INPUTCANT);
        })
    });
    PrecioTotal()
};

function ModificarCantidadProducto(Button, index, inputcant) {
    cantidadesproductos = JSON.parse(localStorage.getItem('cantproduct')) || {};
    Carrito = JSON.parse(localStorage.getItem('cartproducts')) || [];
    const PRODUCTOID = Carrito[index];
    const CANTIDAD = cantidadesproductos[PRODUCTOID];
    if (inputcant !== undefined) {
        currentValue = parseInt(inputcant[index].value);
        if (Button.dataset.id === 'menor' && currentValue > 1) {
            currentValue--;
            SPANCOUNT.textContent = parseInt(SPANCOUNT.textContent) - 1;
        } else if (Button.dataset.id === 'mayor') {
            currentValue++;
            SPANCOUNT.textContent = parseInt(SPANCOUNT.textContent) + 1;
        } 
        inputcant[index].value = currentValue;
        cantidadesproductos[PRODUCTOID] = currentValue;
    } else if (Button.dataset.type === 'remove') {
        delete cantidadesproductos[PRODUCTOID];
        Carrito.splice(index, 1);
        SPANCOUNT.textContent = parseInt(SPANCOUNT.textContent) - CANTIDAD;
    }
    localStorage.setItem('spancount', SPANCOUNT.textContent);
    localStorage.setItem('cantproduct', JSON.stringify(cantidadesproductos));
    localStorage.setItem('cartproducts', JSON.stringify(Carrito));
    PrecioTotal();
}

function PrecioTotal() {
    totalprice = 0;
    const PRECIOTOTAL = Carrito.map(
        id => {
            const PRODUCTO = metadata.productos.find(p => p.id === id);
            const CANTIDAD = cantidadesproductos[id] || 0;
            totalprice += PRODUCTO.precio * CANTIDAD;
            return totalprice
        }
    );
    TOTALPRECIO.textContent = totalprice;
}

function RepositionarCarrito() {
    if (FORMCARRITO.classList.contains('active')) { 
        const RECT = BTNABRIR.getBoundingClientRect();
        const RECTLOG = LOGOMOBILE.getBoundingClientRect();
        if(!window.matchMedia("(width <= 974px)").matches){
            FORMCARRITOCONTENT.style.left = `${RECT.right - FORMCARRITOCONTENT.offsetWidth}px`;
            FORMCARRITOCONTENT.style.top = `${RECT.top}px`;
        }else {
            FORMCARRITOCONTENT.style.left = `${RECTLOG.right - FORMCARRITOCONTENT.offsetWidth}px`;
            FORMCARRITOCONTENT.style.top = `${RECT.top}px`;
        }
    }
}

FORMCARRITO.addEventListener('click', function(event) {
    if (event.target === FORMCARRITO) {
        FORMCARRITO.classList.remove('active');
    }
});

function sleep(milisegundos) {
  return new Promise(resolve => setTimeout(resolve, milisegundos));
}

async function verifictlocal(){
    while(true){
        await sleep(2000);
        if(parseInt(SPANCOUNT.textContent) !== JSON.parse(localStorage.getItem('spancount')) || Carrito !== JSON.parse(localStorage.getItem('cartproducts')) || cantidadesproductos !== JSON.parse(localStorage.getItem('cantproduct')) ){
            localStorage.setItem('spancount', SPANCOUNT.textContent);
            localStorage.setItem('cantproduct', JSON.stringify(cantidadesproductos));
            localStorage.setItem('cartproducts', JSON.stringify(Carrito));
            ActualizarCarrito();
        }
    }
}

window.addEventListener('resize', RepositionarCarrito);
