import { db } from './db.js';
import { protegerRotaAdmin, configurarHeaderSessao } from './autenticacao.js';

protegerRotaAdmin();

const DOM = {
    tabelaUsuarios: document.getElementById('tabela-usuarios-tbody')
}

let todosUsuarios = [];

function renderizarUsuarios(usuariosParaExibir) {
    DOM.tabelaUsuarios.innerHTML = '';

    if (usuariosParaExibir.length === 0) {
        DOM.tabelaUsuarios.innerHTML = `
            <tr data-elemento="linha-sem-usuarios">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <p class="text-lg font-medium">
                        Nenhum usuário encontrado.
                    </p>
                </td>
            </tr>
        `;
        return;
    }

    usuariosParaExibir.forEach(usuario => {
        const HTML = `
            <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    ${usuario.nome}
                </th>
                <td class="px-6 py-4">
                    ${usuario.role}
                </td>
                <td class="px-6 py-4">
                    ${usuario.email}
                </td>
                <td class="px-6 py-4">
                    ${usuario.senha}
                </td>
                <td class="px-6 py-4 text-right">
                    <a href="admin-usuarios-cadastro.html?id=${encodeURIComponent(usuario._id)}"
                       data-elemento="botao-editar-usuario"
                       class="btn-editar inline-flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg px-3 py-1.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors">
                        <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.845 6.845L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                        </svg>
                        Editar
                    </a>
                    <button data-id="${usuario._id}"
                            data-elemento="botao-excluir-usuario"
                            class="btn-excluir inline-flex items-center gap-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 rounded-lg px-3 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 transition-colors">
                        <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                        </svg>
                        Excluir
                    </button>
                </td>
            </tr>
        `;
        DOM.tabelaUsuarios.insertAdjacentHTML('beforeend', HTML);
    });
}

async function carregarDadosIniciais() {
    try {
        const resultado = await db.allDocs({ include_docs: true });
        
        todosUsuarios = resultado.rows
            .map(row => row.doc)
            .filter(doc => doc.tipo === 'usuario');

        renderizarUsuarios(todosUsuarios);
    } catch (erro) {
        console.error("Erro ao carregar dados do PouchDB:", erro);
    }
}

DOM.tabelaUsuarios.addEventListener('click', async (evento) => {
    const botaoExcluir = evento.target.closest('.btn-excluir');
    if (!botaoExcluir) return;

    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    const id = botaoExcluir.getAttribute('data-id');

    try {
        const usuario = await db.get(id);
        await db.remove(usuario);
        await carregarDadosIniciais();
    } catch (erro) {
        console.error('Erro ao excluir usuário:', erro);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosIniciais();
    configurarHeaderSessao();
});
