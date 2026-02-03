const FORMCARRITOCONTENT = document.querySelector('.popup-cart-content');
const BTNCERRAR = document.querySelector('.popup-cart-close');
const BTNCOMPRAR = document.querySelector('.popup-cart-btn');
const POPUPCARTPRICE = document.querySelector('.popup-cart-total');
const TITULOCATEGORIA = document.querySelector('.title-category');

const LOGOMOBILE = document.getElementById('logo-mobile');
const FORMCARRITO = document.getElementById('popup-form');
const SPANCOUNT = document.getElementById('CantCartProd');
const BTNABRIR = document.getElementById('btn-cart');
const TOTALPRECIO = document.getElementById('totalprecio');
const POPCARTMAIN = document.getElementById('popup-cart-main');
const IDCARTPROD = document.getElementById('id-cards-products');
const CARRUSELL = document.getElementById('carouselcategoria');
const TEXTALERT = document.getElementById('alertext');
const FLOATALERT = document.getElementById('floatalert');
const CLOSEALERT = document.getElementById('closealert');
const BOTONES = ['btncapasitor', 'btnsmd', 'btntransi', 'btnceled', 'btnplaf', 'btntransf', 'btncabl', 'btnconectalt', 'btntransfalt'];
const CATEGORIAS = [['capasitor'],['smd'],['transistor'],['celdasled'],['plafones'],['transformador'],['cableado'],['conectoralt'],['trasnformadoralt']];
const TITULOS = ['CAPASITOR', 'SMD', 'TRANSITOR', 'CELDAS LED', 'PLAFONES', 'TRANSOFRMADORES', 'CABLEADO', 'CONECOTRES DE ALTA', 'TRANSOFORMADOR DE ALTA'];

var metadata = [];
let fetchfin = false;
let category = ['capasitor'];
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
        fetchfin = true;
        chargedata(metadata, category)
        verifictlocal();
    })
    .catch(error => {
        console.error("Error al cargar los metadatos:", error);
    }
);

if (CARRUSELL !== null){
    const CAROUSEL = new bootstrap.Carousel(CARRUSELL, {
        interval: 2000
    });
};

if (IDCARTPROD !== null) {
    BOTONES.forEach((Boton, index) => {
        document.getElementById(Boton).addEventListener('click', function() {
            if(fetchfin){
                category = CATEGORIAS[index];
                TITULOCATEGORIA.textContent = TITULOS[index];
                chargedata(metadata, category);
            }else{
                alert("No se puedo acceder a la base de datos")
            }
        });
    });
};

function chargedata(metadata, category)  {
    console.log(!localStorage.getItem('spancount'))
    if (!localStorage.getItem('spancount')) {
        localStorage.setItem('spancount', '0');

    }
    if (IDCARTPROD !== null){
        SPANCOUNT.textContent = localStorage.getItem('spancount');
        const SEARCHRESULT = metadata.productos.filter(Producto => category.includes(Producto.categoria)).map(Producto => { 
            return `
                <div class="card-product">
                        <div class="card-product-img">
                            <img src="${Producto.img}" alt="Imagen del producto">
                        </div>
                        <div class="card-product-title-price">
                            <a href="#"><h2 class="title-product">${Producto.titulo}</h2></a>
                            <p>Precio: $${Producto.precio}</p>
                        </div>
                        <div class="btn-products">
                            <button class="button-shop" type="button" data-id=${Producto.id}>COMPRAR</button>
                        </div>
                </div>
        `});
        Productos = SEARCHRESULT.join('');
        IDCARTPROD.innerHTML = Productos;
        const BUTTONSHOP = document.querySelectorAll('.button-shop');
        BUTTONSHOP.forEach(Button => {
            Button.addEventListener('click', function() {
                //for (let i = 0; i <= Carrito.length; i++) {
                    if (Carrito.indexOf(Button.dataset.id) !== -1) {
                        cantidadesproductos[Button.dataset.id] += 1;
                    } else {
                        Carrito.push(Button.dataset.id);
                        cantidadesproductos[Button.dataset.id] = 1;
                        alerta('Se agrego el producto al carrito')
                    }
                // }
                localStorage.setItem('cantproduct', JSON.stringify(cantidadesproductos));
                localStorage.setItem('cartproducts', JSON.stringify(Carrito));
                SPANCOUNT.textContent = parseInt(JSON.parse(localStorage.getItem('spancount'))) + 1;
                localStorage.setItem('spancount', SPANCOUNT.textContent);
                ActualizarCarrito(); 
                alert("Se agrego el producto al carrito")
            });
        });
    };
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
    SPANCOUNT.textContent = parseInt(JSON.parse(localStorage.getItem('spancount'))) || 0;
    if (Carrito.length === 0) {
        POPCARTMAIN.innerHTML = '<p class = "cartnulltext">El carrito está vacío</p>';
        BTNCOMPRAR.style.display = 'none';
        POPUPCARTPRICE.style.display = 'none';
        return;
    } else {
        POPUPCARTPRICE.style.display = 'block';
        BTNCOMPRAR.style.display = 'block';
    };
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
    POPCARTMAIN.innerHTML = PRODUCTOSCARRITO.join('');
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
};

function alerta(mensaje){
    if (TEXTALERT !== null){
        TEXTALERT.textContent = mensaje;
        FLOATALERT.style.display = 'block';
    }
}

CLOSEALERT.addEventListener('click', function() {
    FLOATALERT.style.display = 'none';
});

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
};

function RepositionarCarrito() {
    if (FORMCARRITO.classList.contains('active')) { 
        const RECT = BTNABRIR.getBoundingClientRect();
        const RECTLOG = LOGOMOBILE.getBoundingClientRect();
        if(!window.matchMedia("(width <= 1145px)").matches){
            FORMCARRITOCONTENT.style.left = `${RECT.right - FORMCARRITOCONTENT.offsetWidth}px`;
            FORMCARRITOCONTENT.style.top = `${RECT.top}px`;
        }else {
            FORMCARRITOCONTENT.style.left = `${RECTLOG.right - FORMCARRITOCONTENT.offsetWidth}px`;
            FORMCARRITOCONTENT.style.top = `${RECT.top}px`;
        }
    }
};

FORMCARRITO.addEventListener('click', function(event) {
    if (event.target === FORMCARRITO) {
        FORMCARRITO.classList.remove('active');
    }
});

function sleep(milisegundos) {
  return new Promise(resolve => setTimeout(resolve, milisegundos));
};

async function verifictlocal(){
    while(true){
        await sleep(7000);
        if(parseInt(SPANCOUNT.textContent) !== JSON.parse(localStorage.getItem('spancount')) || JSON.stringify(Carrito) !== localStorage.getItem('cartproducts') || JSON.stringify(cantidadesproductos) !== localStorage.getItem('cantproduct') ){
            console.log("hola");
            if (JSON.parse(localStorage.getItem('spancount')) < parseInt(SPANCOUNT.textContent)){
                localStorage.setItem('spancount', SPANCOUNT.textContent);
            };
            localStorage.setItem('cantproduct', JSON.stringify(cantidadesproductos));
            localStorage.setItem('cartproducts', JSON.stringify(Carrito));
            ActualizarCarrito();
        };
    };
};

window.addEventListener('resize', RepositionarCarrito);
