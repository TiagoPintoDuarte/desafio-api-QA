describe('Login e Usuários API', () => {

    const usuarioAdmin = {
        nome: 'Fulano Admin',
        email: `admin_${Date.now()}@qa.com`,
        password: 'teste',
        administrador: 'true'
    };

    const usuarioPadrao = {
        nome: 'Usuario Padrao',
        email: `user_${Date.now()}@qa.com`,
        password: 'teste',
        administrador: 'false'
    };

    let idUsuario;

    it('Cadastrar usuário admin com sucesso', () => {
        cy.request('POST', '/usuarios', usuarioAdmin).then((res) => {
            expect(res.status).to.eq(201);
            expect(res.body.message).to.eq('Cadastro realizado com sucesso');
            idUsuario = res.body._id;
        });
    });

    it('Cadastrar usuário comum com sucesso', () => {
        cy.request('POST', '/usuarios', usuarioPadrao).then((res) => {
            expect(res.status).to.eq(201);
            expect(res.body.message).to.eq('Cadastro realizado com sucesso');
        });
    });

    it('Cadastrar usuário com e-mail já existente - deve falhar', () => {
        cy.request({
            method: 'POST',
            url: '/usuarios',
            body: usuarioAdmin,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.message).to.eq('Este email já está sendo usado');
        });
    });

    it('Login com sucesso', () => {
        cy.request('POST', '/login', {
            email: usuarioAdmin.email,
            password: usuarioAdmin.password
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.message).to.eq('Login realizado com sucesso');
            expect(res.body).to.have.property('authorization');
        });
    });

    it('Login com senha inválida', () => {
        cy.request({
            method: 'POST',
            url: '/login',
            failOnStatusCode: false,
            body: {
                email: usuarioAdmin.email,
                password: 'senhaErrada'
            }
        }).then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body.message).to.eq('Email e/ou senha inválidos');
        });
    });

    it('Buscar usuário por ID com sucesso', () => {
        cy.request('GET', `/usuarios/${idUsuario}`).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body._id).to.eq(idUsuario);
            expect(res.body.nome).to.eq(usuarioAdmin.nome);
        });
    });

    it('Buscar usuário por ID inexistente - deve falhar', () => {
        cy.request({
            method: 'GET',
            url: '/usuarios/2vIYPPq2iWbuJNl1',
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.message).to.eq('Usuário não encontrado');

        });
    });

    
    it('Buscar usuário por ID invalido - deve falhar', () => {
        cy.request({
            method: 'GET',
            url: '/usuarios/user123',
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');

        });
    });

    it('Editar usuário com sucesso', () => {
        cy.request({
            method: 'PUT',
            url: `/usuarios/${idUsuario}`,
            body: {
                nome: 'Fulano Editado',
                email: usuarioAdmin.email,
                password: usuarioAdmin.password,
                administrador: 'true'
            }
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.message).to.eq('Registro alterado com sucesso');
        });
    });

    it('Editar usuário com email já cadastrado - deve falhar', () => {
        cy.request({
            method: 'PUT',
            url: `/usuarios/${idUsuario}`,
            failOnStatusCode: false,
            body: {
                nome: 'Fulano',
                email: usuarioPadrao.email, // email já cadastrado
                password: 'teste',
                administrador: 'true'
            }
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.message).to.eq('Este email já está sendo usado');
        });
    });

    it('Excluir usuário com sucesso', () => {
        cy.request('DELETE', `/usuarios/${idUsuario}`).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.message).to.include('Registro excluído com sucesso');
        });
    });
});