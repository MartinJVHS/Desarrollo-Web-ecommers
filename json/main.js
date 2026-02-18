const PAGINACTUAL = window.location.pathname;

const FORMCARRITOCONTENT = document.querySelector('.popup-cart-content');
const BTNCERRAR = document.querySelector('.popup-cart-close');
const BTNCOMPRAR = document.querySelector('.popup-cart-btn');
const POPUPCARTPRICE = document.querySelector('.popup-cart-total');
const TITULOCATEGORIA = document.querySelector('.title-category');

const CAROUSELPRIMESP = document.getElementById('casouselprimerespacio');
const CAROUSELSECESP = document.getElementById('casouselsegundoespacio');
const CAROUSELTRIESP = document.getElementById('casouseltercerespacio');
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
const SEARCHINPUT= document.getElementById('searchinput');
const BOTONES = ['btncapasitor', 'btnsmd', 'btntransi', 'btnceled', 'btnplaf', 'btntransf', 'btncabl', 'btnconectalt', 'btntransfalt'];
const CATEGORIAS = [['capasitor'],['smd'],['transistor'],['celdasled'],['plafones'],['transformador'],['cableado'],['conectoralt'],['trasnformadoralt']];
const TITULOS = ['CAPASITOR', 'SMD', 'TRANSITOR', 'CELDAS LED', 'PLAFONES', 'TRANSOFRMADORES', 'CABLEADO', 'CONECOTRES DE ALTA', 'TRANSOFORMADOR DE ALTA'];

let metadata = [];
let category = ['capasitor'];
let Productos = '';
let Producto = '';
let Carrito = [];
let cantidadesproductos = {};
let currentValue = 0;
let totalprice = 0;
let product = {};
let search = '';
let cantproductest = 0;

fetch('/json/metadata.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo metadata.json');
        }
        return response.json(); 
    })
    .then(data => {
        metadata = data;
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

function chargedata(metadata, category)  {
    if (!localStorage.getItem('spancount')) {
        localStorage.setItem('spancount', '0');
    }

    if (CAROUSELPRIMESP !== null){

        
    }
    if (IDCARTPROD !== null){

        SEARCHINPUT.addEventListener('input', function() {
            category = [];
            Createcards(IDCARTPROD, metadata, category, SEARCHINPUT);
        });

        const PARAMETROS = new URLSearchParams(window.location.search);
        const QUERY = PARAMETROS.get('search');

        if (QUERY !== null) {
            SEARCHINPUT.value = QUERY;
            category = [];
            Createcards(IDCARTPROD, metadata, category, SEARCHINPUT);
        } else {
            Createcards(IDCARTPROD, metadata, category);
        }

        BOTONES.forEach((Boton, index) => {
            document.getElementById(Boton).addEventListener('click', function(event) {
                event.preventDefault();
                category = CATEGORIAS[index];
                TITULOCATEGORIA.textContent = TITULOS[index];
                chargedata(metadata, category);
            });
        });

    } else {
        SEARCHINPUT.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const valor = SEARCHINPUT.value.trim();
                if (valor !== "") {
                    window.location.href = `product.html?search=${encodeURIComponent(valor)}`;
                }
            }
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

    SEARCHINPUT.addEventListener('input', function() {
            category = [];
            Createcards(IDCARTPROD, metadata, category, SEARCHINPUT);
    });

    ActualizarCarrito();    
};

function Createcards(diveable, metadata, category, searching){
    SPANCOUNT.textContent = localStorage.getItem('spancount');
    if (category.length > 0){
        const SEARCHRESULT = metadata.productos.filter(Producto => category.includes(Producto.categoria)).map(Producto => { 
            return createcardtag(Producto) });
        Productos = SEARCHRESULT.join('');
    } else if (category.length === 0 && searching.value.trim() !== '') {
        search = searching.value.toLowerCase();
        const SEARCHRESULT = metadata.productos.filter(Producto => Producto.titulo.toLowerCase().includes(search)).map(Producto => { 
            return createcardtag(Producto) });
        Productos = SEARCHRESULT.join('');
        TITULOCATEGORIA.textContent = 'RESULTADO DE: ' + searching.value; 
    } else if (searching.value === '') {
        const SEARCHRESULT = metadata.productos.map(Producto => { 
            return createcardtag(Producto) });
        Productos = SEARCHRESULT.join('');
        TITULOCATEGORIA.textContent = 'TODOS LOS PRODUCTOS'; 
    };
    if (Productos.length > 0) {
        diveable.innerHTML = Productos;
    } else {
        TITULOCATEGORIA.textContent = 'No hay resultado';
        diveable.innerHTML = '';
    }
    const BUTTONSHOP = document.querySelectorAll('.button-shop');
    BUTTONSHOP.forEach(Button => {
        Button.addEventListener('click', function() {
                if (Carrito.indexOf(Button.dataset.id) !== -1) {
                    cantidadesproductos[Button.dataset.id] += 1;
                } else {
                    Carrito.push(Button.dataset.id);
                    cantidadesproductos[Button.dataset.id] = 1;
                    alerta('Se agrego el producto al carrito')
                }
            localStorage.setItem('cantproduct', JSON.stringify(cantidadesproductos));
            localStorage.setItem('cartproducts', JSON.stringify(Carrito));
            SPANCOUNT.textContent = parseInt(JSON.parse(localStorage.getItem('spancount'))) + 1;
            localStorage.setItem('spancount', SPANCOUNT.textContent);
            ActualizarCarrito(); 
        });
    });
};

function createcardtag(Prod){
    return `
    <div class="card-product">
        <div class="card-product-img">
            <img src="${Prod.img}" alt="Imagen del producto">
        </div>
        <div class="card-product-title-price">
            <a href="#"><h2 class="title-product">${Prod.titulo}</h2></a>
            <p>Precio: $${Prod.precio}</p>
        </div>
        <div class="btn-products">
            <button class="button-shop" type="button" data-id=${Prod.id}>COMPRAR</button>
        </div>
    </div>
`}

function createcardcarousel(Prod){
    return `
    <div class="card m-2" style="width: 18rem;">
        <img src="${Prod.img}"class="card-img-top" alt="Imagen del producto">
        <div class="card-body">
            <h5 class="card-title">${Prod.titulo}</h5>
            <p class="card-text">$${Prod.precio}</p>
            <button class="button-shop-carousel" type="button" data-id=${Prod.id}>COMPRAR</button>
        </div>
    </div>
`}

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
        await sleep(8000);
        Carrito.forEach(producto => {
            if (Carrito != [] && cantidadesproductos != []) {
                cantproductest = cantproductest + cantidadesproductos[producto]; 
            } else {
                cantproductest = 0;
            }
        }); 
        if (cantproductest != JSON.parse(localStorage.getItem('spancount'))){
            localStorage.setItem('spancount', cantproductest);
            SPANCOUNT.textContent = cantproductest
        }
        cantproductest = 0;
        if (JSON.stringify(Carrito) !== localStorage.getItem('cartproducts') || JSON.stringify(cantidadesproductos) !== localStorage.getItem('cantproduct') ){
            localStorage.setItem('cantproduct', JSON.stringify(cantidadesproductos));
            localStorage.setItem('cartproducts', JSON.stringify(Carrito));
            ActualizarCarrito();
        };
    };
};

window.addEventListener('resize', RepositionarCarrito);
