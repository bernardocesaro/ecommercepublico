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

async function criarUsuarioTeste() {
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

criarUsuarioTeste();