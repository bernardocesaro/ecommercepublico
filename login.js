import { buscarUsuario, criarUsuarioTeste } from './db.js';

criarUsuarioTeste();

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
            _id: usuario.email,
            tipo: usuario.tipo,
            nome: usuario.nome,
            role: usuario.role,
            email: usuario.email,
            senha: usuario.senha            
        }));

        window.location.href = 'index.html';
    } else {
        DOM.divAlerta.classList.remove('hidden');
    }
});

DOM.inputEmail.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
DOM.inputSenha.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
