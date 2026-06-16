const db = new PouchDB('ecommerce');

export { db };

export async function buscarUsuario(email) {
    try {
        const usuario = await db.get(email);
        return usuario;
    } catch (error) {
        return null;
    }
}

export async function criarUsuarioTeste() {
    const usuarios = [
        {
            _id: 'cliente@email.com',
            tipo: 'usuario',
            nome: 'Usuário Teste',
            role: 'cliente',
            email: 'cliente@email.com',
            senha: '123'
        },
        {
            _id: 'admin@email.com',
            tipo: 'usuario',
            nome: 'Administrador',
            role: 'admin',
            email: 'admin@email.com',
            senha: 'admin123'
        }
    ];
    
    for (const usuario of usuarios) {
        try {
            await db.get(usuario._id);
        } catch (error) {
            await db.put(usuario);
            console.log(`Usuário '${usuario.nome}' criado.`);
        }
    }
}

export async function criarProdutosMock() {
    const produtosMock = 
        [
            { 
                _id: '1',
                tipo: 'produto',
                nome: 'Camisa Confortável Slim',
                categoria: 'Roupas',
                preco: 119.90,
                imagem: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop',
                descricao: 'Camisa confortável e elegante, perfeita para relaxar em casa ou para uma noite de sono tranquila. Feita com tecido macio e respirável, esta camisa é ideal para todas as estações do ano. Seu design slim valoriza a silhueta, proporcionando um ajuste perfeito e um toque de estilo ao seu guarda-roupa de roupas de dormir.'
            },
            { 
                _id: '2',
                tipo: 'produto',
                nome: 'Relógio Inteligente Sport v4',
                categoria: 'Acessórios',
                preco: 349.00,
                imagem: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
                descricao: 'O Relógio Inteligente Sport v4 é o companheiro perfeito para os entusiastas de fitness e tecnologia. Com um design moderno e resistente, este relógio oferece uma variedade de recursos para monitorar sua saúde e desempenho. Ele inclui monitoramento de frequência cardíaca, rastreamento de atividades físicas, notificações inteligentes e uma bateria de longa duração, garantindo que você esteja sempre conectado e motivado durante seus treinos.'
            },
            { 
                _id: '3',
                tipo: 'produto',
                nome: 'Batom Matte Longa Duração',
                categoria: 'Maquiagens',
                preco: 45.90,
                imagem: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop',
                descricao: 'O Batom Matte Longa Duração é a escolha ideal para quem busca um acabamento sofisticado e duradouro. Com uma fórmula de alta pigmentação, este batom proporciona uma cor intensa e vibrante que permanece impecável por horas. Sua textura matte oferece um toque aveludado aos lábios, enquanto sua resistência à transferência garante que você possa desfrutar de um visual perfeito durante todo o dia ou noite, sem se preocupar com retoques constantes.'
            },
            { 
                _id: '4',
                tipo: 'produto',
                nome: 'Creme Hidratante Corporal 200ml',
                categoria: 'Cosméticos',
                preco: 79.90,
                imagem: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop',
                descricao: 'O Creme Hidratante Corporal 200ml é a solução perfeita para manter sua pele macia, hidratada e saudável. Formulado com ingredientes nutritivos, este creme penetra profundamente na pele, proporcionando hidratação intensa e duradoura. Sua textura leve e de rápida absorção deixa a pele suave ao toque, sem sensação pegajosa. Ideal para uso diário, este creme é essencial para quem deseja cuidar da pele do corpo e mantê-la radiante em todas as estações do ano.'
            }
        ];
    await db.bulkDocs(produtosMock);
}
