document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('usuario-logado'));
    const form = document.getElementById('product-form');
    const loginAlert = document.getElementById('login-alert');

    if (user && user.tipo === 'fornecedor') {
        loginAlert.style.display = 'none'; // Esconde o alerta de login
        form.style.display = 'block'; // Exibe o formulário de produto
    } else {
        loginAlert.style.display = 'block'; // Mostra o alerta de login
        form.style.display = 'none'; // Esconde o formulário de produto
    }

    if (user && user.name) {
        document.getElementById('welcome-message').textContent = `Bem-vindo(a), ${user.name}!`;
        document.getElementById('logout-icon').style.display = 'inline';
    } else {
        document.getElementById('welcome-message').style.display = 'none';
    }

    // Carregar o nome do usuário ao carregar a página
    if (user && user.tipo === 'cliente') {
        document.getElementById('product-form').style.display = 'none';
        document.getElementById('login-alert').textContent = 'Você não tem permissão para visualizar esta página como cliente.';
    }

    const priceMask = IMask(document.getElementById('productPrice'), {
        mask: Number,
        scale: 2,
        signed: false,
        thousandsSeparator: '.',
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ',',
        mapToRadix: ['.'],
        min: 1
    });

    // Adiciona o evento de clique ao ícone de logout
    document.getElementById('logout-icon').addEventListener('click', function() {
        localStorage.removeItem('usuario-logado');
        document.getElementById('welcome-message').style.display = 'none';
        document.getElementById('logout-icon').style.display = 'none';
        sessionStorage.removeItem('reloaded'); // Remover a flag de recarregamento
        location.reload();
    });
});

(function() {
    'use strict';
    window.addEventListener('load', function() {
        var forms = document.getElementsByClassName('needs-validation');
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                const user = JSON.parse(localStorage.getItem('usuario-logado'));

                if (user && user.tipo === 'fornecedor') {
                    validateSupplierForm(event, form);
                } else if (user && user.tipo === 'cliente') {
                    validateClientForm(event, form);
                }
            }, false);
        });
    }, false);
})();

function validateSupplierForm(event, form) {
    var nameInput = document.getElementById('productName');
    var descriptionInput = document.getElementById('productDescription');
    var brandInput = document.getElementById('productBrand');
    var modelInput = document.getElementById('productModel');
    var colorInput = document.getElementById('productColor');
    var materialInput = document.getElementById('productMaterial');

    var nameValue = nameInput.value;
    var descriptionValue = descriptionInput.value;
    var brandValue = brandInput.value;
    var modelValue = modelInput.value;
    var colorValue = colorInput.value;
    var materialValue = materialInput.value;

    var nameIsValid = !/^\d+$/.test(nameValue) && nameValue.trim() !== '';
    var descriptionIsValid = !/^\d+$/.test(descriptionValue) && descriptionValue.trim() !== '';
    var brandIsValid = !/^\d+$/.test(brandValue) && brandValue.trim() !== '';
    var modelIsValid = !/^\d+$/.test(modelValue) && modelValue.trim() !== '';
    var colorIsValid = /^[A-Za-z]+$/.test(colorValue) && colorValue.trim() !== '';
    var materialIsValid = /^[A-Za-zçÇ-]+$/.test(materialValue) && materialValue.trim() !== '';

    if (!nameIsValid || !descriptionIsValid || !brandIsValid || !modelIsValid || !colorIsValid || !materialIsValid) {
        event.preventDefault();
        event.stopPropagation();
    }

    form.classList.add('was-validated');
}

function validateClientForm(event, form) {
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

    if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
    }

    form.classList.add('was-validated');
}

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
        // Recarregar a página após o login
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
        // Recarregar a página após o login
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
