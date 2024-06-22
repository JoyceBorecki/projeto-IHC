var originalProductsHTML = document.getElementById('product-list').innerHTML;
var currentPage = 1;
var productsPerPage = 9; // Defina a quantidade de itens por página

function reorganizarProdutos(query) {
    var productList = document.getElementById('product-list');
    if (query === "") {
        productList.innerHTML = originalProductsHTML;
        paginateProducts(currentPage);
        return;
    }

    var products = Array.from(productList.getElementsByClassName('col-md-4'));
    products.forEach(function(product) {
        var productName = product.querySelector('.product-name').innerText.toLowerCase();
        if (productName.includes(query.toLowerCase())) {
            product.classList.remove('hidden');
        } else {
            product.classList.add('hidden');
        }
    });

    var matchingProducts = products.filter(function(product) {
        return !product.classList.contains('hidden');
    });

    var nonMatchingProducts = products.filter(function(product) {
        return product.classList.contains('hidden');
    });

    productList.innerHTML = '';
    matchingProducts.forEach(function(product) {
        productList.appendChild(product);
    });
    nonMatchingProducts.forEach(function(product) {
        productList.appendChild(product);
    });

    paginateProducts(currentPage); // Update pagination to show only filtered results on the current page
}

document.getElementById('search-input').addEventListener('input', function(event) {
    var query = event.target.value;
    reorganizarProdutos(query);
});

document.getElementById('main-search-input').addEventListener('input', function(event) {
    var query = event.target.value;
    reorganizarProdutos(query);
});

document.querySelector('.btn-pesquisar-procura').addEventListener('click', function() {
    var query = document.getElementById('search-input').value;
    reorganizarProdutos(query);
});

document.querySelector('.btn-pesquisar').addEventListener('click', function() {
    var query = document.getElementById('main-search-input').value;
    window.location.href = 'ver-mais.html?search=' + encodeURIComponent(query);
});

// Ordenação
document.getElementById('sortSelect').addEventListener('change', function(event) {
    var sortOrder = event.target.value;
    sortProducts(sortOrder);
});

function sortProducts(order) {
    var productList = document.getElementById('product-list');
    var products = Array.from(productList.getElementsByClassName('col-md-4'));

    if (order === 'default') {
        productList.innerHTML = originalProductsHTML;
        paginateProducts(currentPage);
        return;
    }

    products.sort(function(a, b) {
        var priceA = parseFloat(a.querySelector('.product-price').innerText.replace('R$', '').replace(',', '.'));
        var priceB = parseFloat(b.querySelector('.product-price').innerText.replace('R$', '').replace(',', '.'));

        if (order === 'asc') {
            return priceA - priceB;
        } else if (order === 'desc') {
            return priceB - priceA;
        } else {
            return 0;
        }
    });

    productList.innerHTML = '';
    products.forEach(function(product) {
        productList.appendChild(product);
    });

    paginateProducts(currentPage); // Update pagination to show sorted results on the current page
}

// Paginação
document.querySelectorAll('.pagination .page-link').forEach(function(pageLink) {
    pageLink.addEventListener('click', function(event) {
        event.preventDefault();
        currentPage = parseInt(event.target.getAttribute('data-page'));
        simulatePageNavigation();
    });
});

function simulatePageNavigation() {
    var productList = document.getElementById('product-list');
    productList.innerHTML = '<div class="loading-message">Carregando...</div>'; // Mostra a mensagem de carregamento

    setTimeout(function() {
        productList.innerHTML = originalProductsHTML; // Restaurar o HTML original
        paginateProducts(currentPage); // Paginar os produtos
    }, 10); // Tempo de simulação do carregamento (1 segundo)
}

function paginateProducts(page) {
    var products = document.querySelectorAll('.product-page');
    // Exibe todos os produtos em todas as páginas
    products.forEach(function(product) {
        product.style.display = 'block';
    });

    updatePaginationLinks();
}

function updatePaginationLinks() {
    var pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    for (var i = 1; i <= 3; i++) { // Adicionando links de paginação manualmente para 3 páginas
        var li = document.createElement('li');
        li.classList.add('page-item');
        var a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.setAttribute('data-page', i);
        a.innerText = i;
        li.appendChild(a);
        pagination.appendChild(li);

        a.addEventListener('click', function(event) {
            event.preventDefault();
            currentPage = parseInt(event.target.getAttribute('data-page'));
            simulatePageNavigation();
        });
    }
}

// Mostrar a primeira página ao carregar
paginateProducts(1);

// Código adicional para gerenciar o carrinho
let cart = {};

function updateCartDisplay() {
    let totalItems = 0;
    for (let key in cart) {
        totalItems += cart[key].quantity;
    }
    document.querySelector('.badge').innerText = totalItems;
}

document.querySelectorAll('.add-item').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        let itemId = this.getAttribute('data-id');
        let itemName = this.getAttribute('data-name');
        if (!cart[itemId]) {
            cart[itemId] = { name: itemName, quantity: 0 };
        }
        cart[itemId].quantity++;
        this.nextElementSibling.innerText = cart[itemId].quantity; // Update item count
        updateCartDisplay();
    });
});

document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        let itemId = this.getAttribute('data-id');
        if (cart[itemId] && cart[itemId].quantity > 0) {
            cart[itemId].quantity--;
            this.previousElementSibling.innerText = cart[itemId].quantity; // Update item count
            if (cart[itemId].quantity === 0) {
                delete cart[itemId];
            }
            updateCartDisplay();
        }
    });
});

function displayCartItems() {
    let cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = ''; // Limpa a lista

    for (let key in cart) {
        let item = cart[key];
        let listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerText = `${item.name} - Quantidade: ${item.quantity}`;
        cartItemsList.appendChild(listItem);
    }
}


document.querySelector('.fa-shopping-cart').addEventListener('click', displayCartItems);

document.getElementById('clear-cart').addEventListener('click', function() {
    clearCart();
});

function clearCart() {
    cart = {}; // Limpa o carrinho
    updateCartDisplay(); // Atualiza a contagem de itens na navbar
    displayCartItems(); // Limpa a lista de itens na modal
}



// Código adicional para gerenciar a autenticação
document.addEventListener('DOMContentLoaded', function() {
    // Carregar o nome do usuário ao carregar a página
    const user = JSON.parse(localStorage.getItem('usuario-logado'));
    if (user && user.name) {
        document.getElementById('welcome-message').textContent = `Bem-vindo(a), ${user.name}!`;
        document.getElementById('logout-icon').style.display = 'inline';
    } else {
        document.getElementById('welcome-message').style.display = 'none';
    }

    // Adiciona o evento de clique ao ícone de logout
    document.getElementById('logout-icon').addEventListener('click', function() {
        localStorage.removeItem('usuario-logado');
        document.getElementById('welcome-message').style.display = 'none';
        document.getElementById('logout-icon').style.display = 'none';
    });
});

//window.addEventListener('beforeunload', function() {
//    localStorage.removeItem('usuario-logado');
//});

document.querySelector('#btn-account').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('dropdown-menu-account').classList.toggle('active');
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('dropdown-menu-account').classList.remove('active');
    document.getElementById('initial-options').classList.remove('hidden');
    document.getElementById('new-account-form').classList.add('hidden');
    document.getElementById('existing-account-form').classList.add('hidden');
    document.querySelector('.back-btn').style.display = 'none';
});

document.querySelector('.back-btn').addEventListener('click', function() {
    document.getElementById('initial-options').classList.remove('hidden');
    document.getElementById('new-account-form').classList.add('hidden');
    document.getElementById('existing-account-form').classList.add('hidden');
    document.querySelector('.back-btn').style.display = 'none';
});

document.getElementById('new-user-btn').addEventListener('click', function() {
    document.getElementById('initial-options').classList.add('hidden');
    document.getElementById('new-account-form').classList.remove('hidden');
    document.querySelector('.back-btn').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('new-email').value = '';
    document.getElementById('new-full-name').value = '';
    document.getElementById('new-password').value = '';
});

document.querySelector('.back-btn').addEventListener('click', function() {
    document.getElementById('new-email').value = '';
    document.getElementById('new-full-name').value = '';
    document.getElementById('existing-name').value = '';
    document.getElementById('existing-password').value = '';
    document.getElementById('new-password').value = '';
});

document.getElementById('existing-user-btn').addEventListener('click', function() {
    document.getElementById('initial-options').classList.add('hidden');
    document.getElementById('existing-account-form').classList.remove('hidden');
    document.querySelector('.back-btn').style.display = 'block';
});

document.getElementById('new-account-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('new-email').value;
    const fullName = document.getElementById('new-full-name').value;
    const password = document.getElementById('new-password').value;

    let isValid = true;

    if (!validateEmail(email)) {
        document.getElementById('new-email-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('new-email-error').classList.add('hidden');
    }
    if (!/^[a-zA-Z\s]*$/.test(fullName)) {
        document.getElementById('new-full-name-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('new-full-name-error').classList.add('hidden');
    }
    if (password.length < 6) {
        document.getElementById('new-password-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('new-password-error').classList.add('hidden');
    }

    if (isValid) {
        const usuarioLogado = {
            tipo: 'cliente',
            email: email,
            name: fullName,
        };
        localStorage.setItem('usuario-logado', JSON.stringify(usuarioLogado));
        document.getElementById('dropdown-menu-account').classList.remove('active');
        // Atualizar a mensagem de boas-vindas na navbar
        document.getElementById('welcome-message').textContent = `Bem-vindo, ${fullName}`;
        document.getElementById('welcome-message').style.display = 'block';
        location.reload();
    }
});

document.getElementById('existing-account-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('existing-name').value;
    const password = document.getElementById('existing-password').value;

    let isValid = true;

    if (name.trim() === '' || /\d/.test(name)) {
        document.getElementById('existing-name-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('existing-name-error').classList.add('hidden');
    }
    if (password.length < 6) {
        document.getElementById('existing-password-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('existing-password-error').classList.add('hidden');
    }

    if (isValid) {
        const usuarioLogado = {
            tipo: 'fornecedor',
            name: name,
        };
        localStorage.setItem('usuario-logado', JSON.stringify(usuarioLogado));
        document.getElementById('dropdown-menu-account').classList.remove('active');
        // Atualizar a mensagem de boas-vindas na navbar
        document.getElementById('welcome-message').textContent = `Bem-vindo, ${name}`;
        document.getElementById('welcome-message').style.display = 'block';
        location.reload();
    }
});

document.querySelectorAll('.toggle-password').forEach(item => {
    item.addEventListener('click', function() {
        const passwordField = this.previousElementSibling;
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

document.addEventListener("DOMContentLoaded", function() {
    const currentLocation = location.href;
    const navLinks = document.querySelectorAll(".nav-item-link");

    navLinks.forEach(link => {
        if (link.href === currentLocation) {
            link.classList.add("active");
        }
    });
});