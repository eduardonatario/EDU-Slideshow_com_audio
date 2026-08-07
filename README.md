# Bento Slideshow Player

Aplicação React + Vite com design Bento e suporte a slides com áudio sincronizado, trava de avanço e exportador HTML autônomo.

---

## 🚀 Como Publicar no GitHub e GitHub Pages

Siga o passo a passo abaixo para enviar o projeto para o GitHub e colocá-lo no ar via GitHub Pages.

### Passo 1: Criar o Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new).
2. Dê um nome ao seu repositório (exemplo: `slideshow-bento`).
3. Mantenha a opção **Public** selecionada.
4. Clique em **Create repository**.

---

### Passo 2: Enviar os Arquivos do Seu Computador para o GitHub

No terminal do seu computador (dentro da pasta do projeto):

```bash
# 1. Inicializar o Git (se ainda não estiver inicializado)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Criar o primeiro commit
git commit -m "feat: versão inicial do slideshow bento"

# 4. Renomear a branch principal para main
git branch -M main

# 5. Conectar ao seu repositório remoto (substitua com seu link do GitHub)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 6. Enviar para o GitHub
git push -u origin main
```

---

### Passo 3: Ativar o GitHub Pages

Você pode escolher **uma das duas formas** para publicar:

#### ⚡ Opção A: Automático via GitHub Actions (Recomendado)
Já deixamos configurado o arquivo `.github/workflows/deploy.yml`.

1. No GitHub, vá na aba **Settings** (Configurações) do seu repositório.
2. Na barra lateral esquerda, clique em **Pages**.
3. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
4. Pronto! Cada vez que você fizer `git push`, o site será atualizado automaticamente no link fornecido pelo GitHub Pages (ex: `https://seu-usuario.github.io/seu-repositorio/`).

#### 📦 Opção B: Manual via Comando Terminal
Se preferir publicar manualmente via terminal:

```bash
npm run deploy
```
Este comando criará automaticamente a branch `gh-pages` e enviará a versão final do projeto compilada.

---

## 🛠️ Comandos Locais

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```
