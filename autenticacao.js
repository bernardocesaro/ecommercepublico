export function getUsuarioLogado() {
    const dados = localStorage.getItem('usuarioLogado');
    return dados ? JSON.parse(dados) : null;
}

export function protegerRotaAdmin() {
    const usuario = getUsuarioLogado();

    if (!usuario || usuario.role !== 'admin') {
        window.location.href = 'index.html';
    }

    return usuario;
}

export function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.reload();
}

export function configurarHeaderSessao() {
    const usuario = getUsuarioLogado();

    const botaoLogin = document.querySelector('[data-elemento="botao-login"]');
    const botaoAvatar = document.querySelector('[data-elemento="botao-avatar"]');
    const nomeUsuario = document.querySelector('[data-elemento="nome-usuario-logado"]');
    const emailUsuario = document.querySelector('[data-elemento="email-usuario-logado"]');
    const listaLinksAdmin = document.getElementById('lista-links-admin');
    const linkSair = document.querySelector('[data-elemento="link-sair"]');

    if (!botaoLogin || !botaoAvatar) return;

    if (usuario) {
        botaoLogin.classList.add('hidden');
        botaoAvatar.classList.remove('hidden');

        if (nomeUsuario) nomeUsuario.textContent = usuario.nome;
        if (emailUsuario) emailUsuario.textContent = usuario.email;

        if (usuario.role === 'admin' && listaLinksAdmin) {
            listaLinksAdmin.classList.remove('hidden');
        }

        if (linkSair) {
            linkSair.addEventListener('click', (evento) => {
                evento.preventDefault();
                logout();
            });
        }
    } else {
        botaoLogin.classList.remove('hidden');
        botaoAvatar.classList.add('hidden');
    }
}