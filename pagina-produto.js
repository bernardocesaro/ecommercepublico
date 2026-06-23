import { db } from './db.js';
import { configurarHeaderSessao } from './autenticacao.js';

const params = new URLSearchParams(window.location.search);
const idProduto = params.get('id');

const DOM = {
    imagemProduto: document.getElementById('produto-imagem'),
    nomeProduto: document.getElementById('produto-nome'),
    precoProduto: document.getElementById('produto-preco'),
    descricaoProduto: document.getElementById('produto-descricao')
}

async function inicializar() {
    const produto = await db.get(decodeURIComponent(idProduto));

    console.log(produto.descricao);

    DOM.imagemProduto.src = produto.imagem;
    DOM.nomeProduto.textContent = produto.nome;
    DOM.precoProduto.textContent = `R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}`;
    DOM.descricaoProduto.textContent = produto.descricao;
}

configurarHeaderSessao();
inicializar();