# Gyma-WEB

Gyma-WEB é o frontend da aplicação Gyma, construída com Next.js e Typescript. A aplicação permite que usuários façam login, visualizem, criem, editem e removam planos de treino com exercícios associados. O frontend consome a API Java Spring Boot (Gyma-API) para gerenciar dados autenticados via HTTP Basic Auth.

---

## Tecnologias utilizadas

- Next.js 13+ (React, Server Components e Client Components)
- Typescript
- React Context para autenticação (AuthContext)
- Fetch API para comunicação HTTP
- Tailwind CSS para estilização
- React hooks (useState, useEffect, useContext)
- Next.js Router (useRouter) para navegação programática

---

## Estrutura principal

- `/app` — diretório padrão do Next.js com páginas e layouts
- `/components` — componentes React reutilizáveis (Navbar, botões, inputs)
- `/context/AuthContext.tsx` — provê estado global de autenticação (email e senha)
- `/app/plans` — páginas para listagem, criação e edição de planos
- `/app/login` — página de login do usuário
- `/app/plans/form` — formulário para criação de um novo plano de treino
- - `/app/plans/edit/[id]` — formulário para editar um plano de treino

---

## Funcionalidades principais

- Login autenticado via HTTP Basic (email e senha)
- CRUD completo de planos de treino
- Adicionar, editar e remover exercícios em cada plano
- Validação de formulários
- Controle de estado com React Context e useState
- Navegação com proteção via verificação de autenticação
- Layout responsivo com Tailwind CSS

---

## Como executar localmente

### Pré-requisitos

- Node.js 18+
- Yarn ou npm
- Gyma-API rodando localmente em `http://localhost:8080`

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/seuusuario/Gyma-WEB.git
cd Gyma-WEB
```

2. Instale dependências:

```bash
npm install
# ou
yarn install
```

3. Rode o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

4. Acesse `http://localhost:3000` no navegador.

---

## Configurações importantes

- A autenticação é feita via `AuthContext` que mantém email e senha no estado global.
- Todas as requisições à API usam HTTP Basic Auth (header `Authorization: Basic base64(email:senha)`).
- URLs da API estão hardcoded para `http://localhost:8080` (alterar se necessário).
- Componentes de formulário possuem validação simples com mensagens de erro exibidas ao usuário.
- Botões e inputs estilizados com Tailwind CSS (cores personalizadas para o tema Gyma).

---
