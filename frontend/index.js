import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginContainer = document.querySelector('.form-container');
    const registerContainer = document.getElementById('registerContainer');
    const messageElement = document.getElementById('message');

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });

    function showMessage(message, isError = false) {
        messageElement.textContent = message;
        messageElement.classList.add(isError ? 'error' : 'success');
        messageElement.classList.add('show');
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 3000);
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const result = await backend.login(email, password);
            if ('ok' in result) {
                showMessage(result.ok);
            } else {
                showMessage(result.err, true);
            }
        } catch (error) {
            showMessage('An error occurred. Please try again.', true);
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const result = await backend.register(email, password);
            if ('ok' in result) {
                showMessage(result.ok);
                registerContainer.classList.add('hidden');
                loginContainer.classList.remove('hidden');
            } else {
                showMessage(result.err, true);
            }
        } catch (error) {
            showMessage('An error occurred. Please try again.', true);
        }
    });
});
