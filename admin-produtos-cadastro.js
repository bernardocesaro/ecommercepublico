import { db } from './db.js';
import { protegerRotaAdmin, configurarHeaderSessao } from './autenticacao.js';

protegerRotaAdmin();

const params = new URLSearchParams(window.location.search);
const idProduto = params.get('id');
const modoEdicao = !!idProduto;

const enumCategorias = {
    Todas: 'Todas',
    Roupas: 'Roupas',
    Acessorios: 'Acessórios',
    Maquiagens: 'Maquiagens',
    Cosmeticos: 'Cosméticos',
    Outros: 'Outros'
};

const DOM = {
    divAlerta: document.getElementById('alerta-sucesso'),

    formProduto: document.getElementById('formulario-produto'),
    tituloForm: document.getElementById('titulo-formulario'),

    inputId: document.getElementById('produto-id'),
    inputRev: document.getElementById('produto-rev'),
    inputNome: document.getElementById('produto-nome'),
    inputCategoria: document.getElementById('produto-categoria'),
    inputPreco: document.getElementById('produto-preco'),
    inputImagem: document.getElementById('produto-imagem'),
    inputDescricao: document.getElementById('produto-descricao'),

    btnSalvar: document.getElementById('btn-salvar'),
    btnCancelar: document.getElementById('btn-cancelar-edicao')
}

async function inicializar() {
    if (modoEdicao) {
        DOM.tituloForm.textContent = 'Editar Produto';
        DOM.btnSalvar.textContent  = 'Salvar Alterações';
        DOM.btnCancelar.classList.remove('hidden');
        DOM.btnCancelar.classList.add('flex-1');
        DOM.btnCancelar.classList.add('inline-flex');

        const produto = await db.get(decodeURIComponent(idProduto));

        console.log('Produto para edição:', produto);

        DOM.inputId.value        = produto._id;
        DOM.inputRev.value       = produto._rev;
        DOM.inputNome.value      = produto.nome;
        DOM.inputCategoria.value = produto.categoria;
        DOM.inputPreco.value     = produto.preco;
        DOM.inputImagem.value    = produto.imagem;
        DOM.inputDescricao.value = produto.descricao || '';
    }
}

function ConfigurarEventosFormProduto() {
    if (DOM.formProduto) {
        DOM.formProduto.addEventListener('submit', async (evento) => {
            evento.preventDefault();

            const produto = {
                tipo: 'produto',
                nome: DOM.inputNome.value,
                categoria: DOM.inputCategoria.value,
                preco: Number(DOM.inputPreco.value),
                imagem: DOM.inputImagem.value,
                descricao: DOM.inputDescricao.value
            }

            try {
                if (modoEdicao) {
                    produto._id = DOM.inputId.value;
                    produto._rev = DOM.inputRev.value;
                    await db.put(produto);
                } else {
                    await db.post(produto);
                }
                DOM.divAlerta.classList.remove('hidden');
            } catch (erro) {
                console.error('Erro ao salvar produto:', erro);
            }
        });

        if (DOM.btnCancelar) {
            DOM.btnCancelar.addEventListener('click', () => {
                window.location.href = 'admin-produtos-consulta.html';
            });
        }

        DOM.inputNome.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
        DOM.inputCategoria.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
        DOM.inputPreco.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
        DOM.inputImagem.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
        DOM.inputDescricao.addEventListener('input', () => DOM.divAlerta.classList.add('hidden'));
    }
}

configurarHeaderSessao();
ConfigurarEventosFormProduto();
inicializar();
