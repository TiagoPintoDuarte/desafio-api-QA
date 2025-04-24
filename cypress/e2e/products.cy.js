describe('Produtos API', () => {

  let produtoId = '';
  const produtoNome = `Produto Teste ${Date.now()}`;

  before(() => {
    cy.request('POST', '/login', {
      email: Cypress.env('username'),
      password: Cypress.env('password'),
    }).then((res) => {
      Cypress.env('token', res.body.authorization);
    });
  });

  it('Cadastrar produto com sucesso', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: {
        Authorization: Cypress.env('token')
      },
      body: {
        nome: produtoNome,
        preco: 250,
        descricao: 'Produto criado via teste automatizado',
        quantidade: 15
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
      produtoId = res.body._id;
    });
  });

  it('Listar produtos', () => {
    cy.request('GET', '/produtos').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.produtos).to.be.an('array');
    });
  });

  it('Buscar produto por nome', () => {
    cy.request(`GET`, `/produtos?nome=${produtoNome}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.produtos[0].nome).to.eq(produtoNome);
    });
  });

  it('Editar produto com sucesso', () => {
    cy.request({
      method: 'PUT',
      url: `/produtos/${produtoId}`,
      headers: {
        Authorization: Cypress.env('token')
      },
      body: {
        nome: `${produtoNome} Editado`,
        preco: 300,
        descricao: 'Produto editado via teste',
        quantidade: 10
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Registro alterado com sucesso');
    });
  });

  it('Visualizar produto pelo ID', () => {
    cy.request(`GET`, `/produtos/${produtoId}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body._id).to.eq(produtoId);
    });
  });

  it('Não permitir cadastro de produto com nome duplicado', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false,
      headers: {
        Authorization: Cypress.env('token')
      },
      body: {
        nome: `${produtoNome} Editado`,
        preco: 100,
        descricao: 'Duplicado',
        quantidade: 5
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.eq('Já existe produto com esse nome');
    });
  });
  it('Não deve permitir cadastro sem nome', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false,
      headers: {
        Authorization: Cypress.env('token')
      },
      body: {
        preco: 100,
        descricao: 'Sem nome',
        quantidade: 10
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('nome').that.includes('nome é obrigatório');
    });
  });

  it('Não deve permitir cadastro sem preço', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false,
      headers: {
        Authorization: Cypress.env('token')
      },
      body: {
        nome: 'Produto Sem Preço',
        descricao: 'Sem preço',
        quantidade: 10
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('preco').that.includes('preco é obrigatório');
    });
  });

  it('Não deve permitir cadastro sem descrição', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false,
      headers: {
        Authorization: Cypress.env('token')
      },
      body: {
        nome: 'Produto Sem Descrição',
        preco: 50,
        quantidade: 5
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('descricao').that.includes('descricao é obrigatório');
    });
  });

  it('Não deve permitir cadastro sem quantidade', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      failOnStatusCode: false,
      headers: {
        Authorization: Cypress.env('token')
      },
      body: {
        nome: 'Produto Sem Quantidade',
        preco: 150,
        descricao: 'Sem quantidade'
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('quantidade').that.includes('quantidade é obrigatório');
    });
  });


  it('Excluir produto com sucesso', () => {
    cy.request({
      method: 'DELETE',
      url: `/produtos/${produtoId}`,
      headers: {
        Authorization: Cypress.env('token')
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Registro excluído com sucesso');
    });
  });




});
