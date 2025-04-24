describe('Testes de Carrinhos', () => {

    let produtoId;

    before(() => {
        cy.request('POST', '/login', {
            email: Cypress.env('username'),
            password: Cypress.env('password'),
        }).then((res) => {
            Cypress.env('token', res.body.authorization);
        });

        // Buscar os produtos para pegar um ID válido
        cy.request({
            method: 'GET',
            url: '/produtos',
            headers: {
                Authorization: Cypress.env('token'),
            }
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.produtos).to.be.an('array');
            Cypress.env('idProduto', res.body.produtos[0]._id)
            produtoId = res.body.produtos[0]._id;  // Selecionando o primeiro produto como exemplo
        });
    });

    // 1. Listar Carrinhos Cadastrados
    context('Listar Carrinhos Cadastrados', () => {
        it('Deve listar carrinhos cadastrados com sucesso', () => {
            cy.request({
                method: 'GET',
                url: '/carrinhos',
                headers: {
                    Authorization: Cypress.env('token'),
                }
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.carrinhos).to.be.an('array');
            });
        });
    });

    // 2. Cadastrar Carrinho
    context('Cadastrar Carrinho', () => {
        it('Deve cadastrar carrinho com sucesso', () => {
            const carrinho = {
                produtos: [
                    { idProduto: produtoId, quantidade: 3 }
                ]
            };

            cy.request({
                method: 'POST',
                url: '/carrinhos',
                headers: {
                    Authorization: Cypress.env('token'),
                },
                body: carrinho,
            }).then((res) => {
                expect(res.status).to.eq(201);
                expect(res.body.message).to.eq('Cadastro realizado com sucesso');
            });
        });

        it('Não deve ser permitido ter mais de 1 item no carrinho', () => {
            const carrinho = {
                produtos: [
                    { idProduto: produtoId, quantidade: 1 }
                ]
            };

            cy.request({
                method: 'POST',
                url: '/carrinhos',
                headers: {
                    Authorization: Cypress.env('token'),
                },
                body: carrinho,
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body.message).to.eq('Não é permitido ter mais de 1 carrinho');
            });
        });

        it('Deve retornar erro ao tentar cadastrar mais de um carrinho por usuário', () => {
            const carrinho = {
                produtos: [
                    { idProduto: produtoId, quantidade: 1 }
                ]
            };

            cy.request({
                method: 'POST',
                url: '/carrinhos',
                headers: {
                    Authorization: Cypress.env('token'),
                },
                body: carrinho,
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body.message).to.eq('Não é permitido ter mais de 1 carrinho');
            });
        });
    });

    // 3. Buscar Carrinho por ID
    context('Buscar Carrinho por ID', () => {
        it('Deve buscar carrinho por ID com sucesso', () => {
            const carrinhoId = 'qbMqntef4iTOwWfg'; // Exemplo de ID válido

            cy.request({
                method: 'GET',
                url: `/carrinhos/${carrinhoId}`,
                headers: {
                    Authorization: Cypress.env('token'),
                }
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body._id).to.eq(carrinhoId);
            });
        });

        it('O id do carrinho deve ter 16 caracteres', () => {
            const carrinhoIdInvalido = 'idInvalido123'; // ID inválido

            cy.request({
                method: 'GET',
                url: `/carrinhos/${carrinhoIdInvalido}`,
                headers: {
                    Authorization: Cypress.env('token'),
                },
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
            });
        });
    });

    // 4. Excluir Carrinho (Concluir Compra)
    context('Excluir Carrinho - Concluir Compra', () => {
        it('Deve excluir carrinho com sucesso ao concluir compra', () => {
            cy.request({
                method: 'DELETE',
                url: '/carrinhos/concluir-compra',
                headers: {
                    Authorization: Cypress.env('token'),
                }
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.message).to.eq('Registro excluído com sucesso');
            });
        });

        it('Deve retornar erro se o token for inválido ou ausente', () => {
            cy.request({
                method: 'DELETE',
                url: '/carrinhos/concluir-compra',
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
            });
        });
    });

    // 5. Excluir Carrinho (Cancelar Compra)
    context('Excluir Carrinho - Cancelar Compra', () => {
        it('Deve cancelar uma compra com sucesso', () => {
            cy.request({
                method: 'DELETE',
                url: '/carrinhos/cancelar-compra',
                headers: {
                    Authorization: Cypress.env('token'),
                }
            }).then((res) => {
                expect(res.status).to.eq(200);
            });
        });

        it('Deve retornar erro se o token for inválido ou ausente', () => {
            cy.request({
                method: 'DELETE',
                url: '/carrinhos/cancelar-compra',
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
            });
        });
    });

});
