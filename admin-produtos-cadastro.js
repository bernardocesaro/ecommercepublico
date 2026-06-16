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


export async function criarProdutosMock() {
    const produtosMock = 
        [
            { 
                _id: '1',
                tipo: 'produto',
                nome: 'Camisa Confortável Slim',
                categoria: enumCategorias.Roupas,
                preco: 119.90,
                imagem: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop',
                descricao: 'Camisa confortável e elegante, perfeita para relaxar em casa ou para uma noite de sono tranquila. Feita com tecido macio e respirável, esta camisa é ideal para todas as estações do ano. Seu design slim valoriza a silhueta, proporcionando um ajuste perfeito e um toque de estilo ao seu guarda-roupa de roupas de dormir.'
            },
            { 
                _id: '2',
                tipo: 'produto',
                nome: 'Relógio Inteligente Sport v4',
                categoria: enumCategorias.Acessorios,
                preco: 349.00,
                imagem: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
                descricao: 'O Relógio Inteligente Sport v4 é o companheiro perfeito para os entusiastas de fitness e tecnologia. Com um design moderno e resistente, este relógio oferece uma variedade de recursos para monitorar sua saúde e desempenho. Ele inclui monitoramento de frequência cardíaca, rastreamento de atividades físicas, notificações inteligentes e uma bateria de longa duração, garantindo que você esteja sempre conectado e motivado durante seus treinos.'
            },
            { 
                _id: '3',
                tipo: 'produto',
                nome: 'Batom Matte Longa Duração',
                categoria: enumCategorias.Maquiagens,
                preco: 45.90,
                imagem: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop',
                descricao: 'O Batom Matte Longa Duração é a escolha ideal para quem busca um acabamento sofisticado e duradouro. Com uma fórmula de alta pigmentação, este batom proporciona uma cor intensa e vibrante que permanece impecável por horas. Sua textura matte oferece um toque aveludado aos lábios, enquanto sua resistência à transferência garante que você possa desfrutar de um visual perfeito durante todo o dia ou noite, sem se preocupar com retoques constantes.'
            },
            { 
                _id: '4',
                tipo: 'produto',
                nome: 'Creme Hidratante Corporal 200ml',
                categoria: enumCategorias.Cosmeticos,
                preco: 79.90,
                imagem: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop',
                descricao: 'O Creme Hidratante Corporal 200ml é a solução perfeita para manter sua pele macia, hidratada e saudável. Formulado com ingredientes nutritivos, este creme penetra profundamente na pele, proporcionando hidratação intensa e duradoura. Sua textura leve e de rápida absorção deixa a pele suave ao toque, sem sensação pegajosa. Ideal para uso diário, este creme é essencial para quem deseja cuidar da pele do corpo e mantê-la radiante em todas as estações do ano.'
            }
        ];
    await db.bulkDocs(produtosMock);
}

configurarHeaderSessao();
ConfigurarEventosFormProduto();
inicializar();
