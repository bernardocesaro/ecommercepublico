import { db } from './db.js';
import { protegerRotaAdmin, configurarHeaderSessao } from './autenticacao.js';

protegerRotaAdmin();

const params = new URLSearchParams(window.location.search);
const idUsuario = params.get('id');
const modoEdicao = !!idUsuario;

const enumTipo = {
    Cliente: 'Cliente',
    Administrador: 'Administrador'
};

const DOM = {
    divAlerta: document.getElementById('alerta-sucesso'),

    formUsuario: document.getElementById('formulario-usuario'),
    tituloForm: document.getElementById('titulo-formulario'),

    inputId: document.getElementById('usuario-id'),
    inputRev: document.getElementById('usuario-rev'),
    inputNome: document.getElementById('usuario-nome'),
    inputRole: document.getElementById('usuario-role'),
    inputEmail: document.getElementById('usuario-email'),
    inputSenha: document.getElementById('usuario-senha'),

    btnSalvar: document.getElementById('btn-salvar'),
    btnCancelar: document.getElementById('btn-cancelar-edicao')
}

async function inicializar() {
    if (modoEdicao) {
        DOM.tituloForm.textContent = 'Editar Usuário';
        DOM.btnSalvar.textContent  = 'Salvar Alterações';
        DOM.btnCancelar.classList.remove('hidden');
        DOM.btnCancelar.classList.add('flex-1');
        DOM.btnCancelar.classList.add('inline-flex');

        const usuario = await db.get(decodeURIComponent(idUsuario));

        console.log('Produto para edição:', usuario);

        DOM.inputId.value    = usuario._id;
        DOM.inputRev.value   = usuario._rev;
        DOM.inputNome.value  = usuario.nome;
        DOM.inputRole.value  = usuario.role;
        DOM.inputEmail.value = usuario.email;
        DOM.inputSenha.value = usuario.senha;
    }
}

function ConfigurarEventosFormUsuario() {
    if (DOM.formUsuario) {
        DOM.formUsuario.addEventListener('submit', async (evento) => {
            evento.preventDefault();

            const usuario = {
                tipo: 'usuario',
                nome: DOM.inputNome.value,
                role: DOM.inputRole.value,
                email: DOM.inputEmail.value,
                senha: DOM.inputSenha.value
            }

            try {
                if (modoEdicao) {
                    usuario._id = DOM.inputId.value;
                    usuario._rev = DOM.inputRev.value;
                    await db.put(usuario);
                } else {
                    await db.post(usuario);
                }
                DOM.divAlerta.classList.remove('hidden');
            } catch (erro) {
                console.error('Erro ao salvar usuário:', erro);
            }
        });

        if (DOM.btnSalvar) {
            DOM.btnSalvar.addEventListener('click', () => {
                
            });
        }

        if (DOM.btnCancelar) {
            DOM.btnCancelar.addEventListener('click', () => {
                window.location.href = 'admin-usuarios-consulta.html';
            });
        }
    }
}

configurarHeaderSessao();
ConfigurarEventosFormUsuario();
inicializar();

DOM.inputNome.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
DOM.inputRole.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
DOM.inputEmail.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
DOM.inputSenha.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
