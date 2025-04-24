# Testes de API - Gerenciamento de Usuários

Este repositório contém **testes automatizados** para a validação da API de **Gerenciamento de Usuários**. Utilizamos o **Cypress** para garantir que as funcionalidades relacionadas ao cadastro, login, busca, edição e exclusão de usuários estejam funcionando corretamente. 

## Funcionalidades Testadas

O objetivo dos testes é verificar que a API está funcionando conforme esperado em diferentes cenários, incluindo condições de sucesso e falha.

### Cenários de Testes:

1. **Cadastrar usuário admin com sucesso**  
   - O teste valida o cadastro de um usuário com o papel de "admin".  
   - **Esperado:** O usuário deve ser criado com sucesso.

2. **Cadastrar usuário comum com sucesso**  
   - Verifica o cadastro de um usuário comum (não admin).  
   - **Esperado:** O usuário deve ser criado com sucesso.

3. **Cadastrar usuário com e-mail já existente - deve falhar**  
   - Tenta cadastrar um usuário com um e-mail que já foi registrado.  
   - **Esperado:** A API retorna um erro indicando que o e-mail já está em uso.

4. **Login com sucesso**  
   - Testa o login com um usuário válido e credenciais corretas.  
   - **Esperado:** O login deve ser bem-sucedido e o token de autenticação deve ser retornado.

5. **Login com senha inválida**  
   - Testa o login com senha incorreta.  
   - **Esperado:** A API retorna um erro indicando que a senha está errada.

6. **Buscar usuário por ID com sucesso**  
   - Verifica se é possível buscar um usuário pelo seu ID.  
   - **Esperado:** A API retorna os dados do usuário.

7. **Buscar usuário por ID inexistente - deve falhar**  
   - Realiza uma busca com um ID que não existe.  
   - **Esperado:** A API retorna um erro informando que o usuário não foi encontrado.

8. **Buscar usuário por ID inválido - deve falhar**  
   - Tenta buscar um usuário com um ID no formato incorreto.  
   - **Esperado:** A API retorna um erro indicando que o ID é inválido.

9. **Editar usuário com sucesso**  
   - Verifica a atualização de um usuário existente.  
   - **Esperado:** Os dados do usuário são atualizados com sucesso.

10. **Editar usuário com email já cadastrado - deve falhar**  
    - Tenta editar o e-mail de um usuário para um e-mail que já existe.  
    - **Esperado:** A API retorna um erro informando que o e-mail já está em uso.

11. **Excluir usuário com sucesso**  
    - Testa a exclusão de um usuário.  
    - **Esperado:** O usuário é excluído com sucesso.

---

## Como Executar os Testes

### 1. Pré-requisitos

Antes de executar os testes, você precisará garantir que os seguintes requisitos estejam instalados em sua máquina:

- **Node.js** (Recomendado: v14.x ou superior)
- **Cypress** (v12.x ou superior)

### 2. Clonar o Repositório

Clone o repositório para a sua máquina local utilizando o comando:

```bash
git clone https://github.com/seu-usuario/gerenciamento-usuarios-tests.git
