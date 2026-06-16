import { db } from './db.js';
import { configurarHeaderSessao } from './autenticacao.js';
import { criarProdutosMock } from './admin-produtos-cadastro.js';

const enumCategorias = {
    Todas: 'Todas',
    Roupas: 'Roupas',
    Acessorios: 'Acessórios',
    Maquiagens: 'Maquiagens',
    Cosmeticos: 'Cosméticos',
    Outros: 'Outros'
};

let estadoApp = {
    produtos: [],
    categoriaAtual: enumCategorias.Todas
};

const DOM = {
    containerProdutos: document.getElementById('container-produtos'),
    linksCategorias: document.querySelectorAll('.link-categoria'),
    inputBusca: document.getElementById('input-busca'),
    formBusca: document.getElementById('form-busca')
};

function renderizarProdutos(produtosParaExibir) {
    DOM.containerProdutos.innerHTML = '';

    if (produtosParaExibir.length === 0) {
        DOM.containerProdutos.innerHTML = `
            <div class="col-span-full text-center py-12 text-white">
                <p class="text-lg font-medium">
                    Nenhum produto encontrado.
                </p>
            </div>
        `;
        return;
    }

    produtosParaExibir.forEach(produto => {
        const HTML = `
            <div class="w-full max-w-[192px] lg:max-w-[256px] bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between overflow-hidden">
                <a href="#" class="p-4 block">
                    <img class="rounded-t-lg mx-auto h-48 object-contain transition-transform duration-200 hover:scale-105" 
                         src="${produto.imagem}"
                         alt="${produto.nome}"
                    />
                </a>
                <div class="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <span class="text-xs font-medium uppercase px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            ${produto.categoria}
                        </span>
                        <a href="#" class="block mt-2">
                            <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                ${produto.nome}
                            </h5>
                        </a>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-y-2 mt-5">
                        <span class="text-2xl font-bold text-gray-900 dark:text-white">
                            R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}
                        </span>
                        <button type="button" 
                                id="btn-add-${produto._id}"
                                data-id="${produto._id}"
                                class="btn-adicionar-carrinho text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors cursor-pointer">
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `;
        DOM.containerProdutos.insertAdjacentHTML('beforeend', HTML);
    });
}

async function carregarDadosIniciais() {
    try {
        const resultado = await db.allDocs({ include_docs: true });
        
        let todosProdutos = resultado.rows
            .map(row => row.doc)
            .filter(doc => doc.tipo === 'produto');

        if (todosProdutos.length === 0) {
            console.log("Criando produtos padrões...");
            await criarProdutosMock();
            return carregarDadosIniciais(); 
        }
        estadoApp.produtos = todosProdutos;
        renderizarProdutos(estadoApp.produtos);
    } catch (erro) {
        console.error("Erro ao carregar dados do PouchDB:", erro);
    }
}

function configurarEventos() {
    DOM.linksCategorias.forEach(link => {
        link.addEventListener('click', (evento) => {
            evento.preventDefault();

            const categoriaSelecionada = link.textContent.trim();            
            estadoApp.categoriaAtual = categoriaSelecionada;

            if (categoriaSelecionada === enumCategorias.Todas) {
                renderizarProdutos(estadoApp.produtos);
            } else {
                const filtrados = estadoApp.produtos.filter(p => p.categoria.toLowerCase() === categoriaSelecionada.toLowerCase());
                renderizarProdutos(filtrados);
            }
        });
    });

    if (DOM.formBusca && DOM.inputBusca) {
        DOM.formBusca.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const termoBusca = DOM.inputBusca.value.toLowerCase().trim();
            
            const produtosFiltrados = estadoApp.produtos.filter(produto => {
                const bateNome = produto.nome.toLowerCase().includes(termoBusca);
                const bateCategoria = estadoApp.categoriaAtual === 'Todas' || produto.categoria.toLowerCase() === estadoApp.categoriaAtual.toLowerCase();
                return bateNome && bateCategoria;
            });

            renderizarProdutos(produtosFiltrados);
        });
    }

    DOM.containerProdutos.addEventListener('click', async (evento) => {
        const botao = evento.target.closest('.btn-adicionar-carrinho');
        
        if (botao) {
            /*
            const idProdutoPadrao = botao.getAttribute('data-id'); 
            const produtoParaAdicionar = estadoApp.produtos.find(p => p._id === idProdutoPadrao);
            
            const idCarrinho = `carrinho:${idProdutoPadrao}`;

            try {
                await db.put({
                    _id: idCarrinho,
                    idOriginal: idProdutoPadrao,
                    nome: produtoParaAdicionar.nome,
                    preco: produtoParaAdicionar.preco,
                    imagem: produtoParaAdicionar.imagem,
                    quantidade: 1
                });
                
                alert(`${produtoParaAdicionar.nome} adicionado ao carrinho!`);
            } catch (erro) {
                if (erro.status === 409) {
                    alert("Este produto já está no seu carrinho!");
                } else {
                    console.error("Erro ao adicionar:", erro);
                }
            }
            */
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosIniciais();
    configurarEventos();
    configurarHeaderSessao();
});
