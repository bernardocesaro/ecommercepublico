import { buscarUsuario } from 'db.js';

const DOM = {
    formLogin: document.getElementById('form-login'),
    inputEmail: document.getElementById('email'),
    inputSenha: document.getElementById('password'),
    divAlerta: document.getElementById('alerta-erro'),
}


DOM.formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = DOM.inputEmail.value;
    const senha = DOM.inputSenha.value;

    const usuario = await buscarUsuario(email);

    if (usuario && usuario.senha === senha) {
        localStorage.setItem('usuarioLogado', JSON.stringify({
            email: usuario.email,
            nome: usuario.nome,
            role: usuario.role
        }));

        window.location.href = 'index.html';
    } else {
        DOM.divAlerta.classList.remove('hidden');
    }
});

DOM.inputEmail.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
DOM.inputSenha.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));