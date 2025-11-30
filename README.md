# 🛒 Catálogo de Produtos Premium Interativo

## Este projeto é um catálogo dinâmico de produtos que carrega dados de um arquivo JSON local utilizando jQuery e AJAX. Foi construído com foco em **UI/UX moderna**, implementando um carrossel interativo, um painel de controle otimizado e um design totalmente responsivo.

---

## 🌟 Funcionalidades e Melhorias

O projeto entrega uma experiência de e-commerce moderna com as seguintes funcionalidades ativas:

* **Carregamento Dinâmico:** Carregamento automático dos produtos via **AJAX** a partir do arquivo `data/produtos.json`.
* **Carrossel Interativo (Hero):**
    * **Transição Suave:** Implementação de carrossel no header com transição por **opacidade** (`opacity`) no CSS.
    * **UX Refinada:** Setas de navegação **centralizadas** e **visíveis apenas ao passar o mouse** (`:hover`), e navegação por pontos indicadores.
* **Painel de Controle Avançado:**
    * **Busca Otimizada:** Campo de busca com **ícone dedicado** e foco aprimorado.
    * **Filtros Abertos:** Filtragem por categorias e ordenação agrupadas em um layout limpo.
* **Visualização de Produtos:**
    * Exibição em **cards responsivos** com destaque para preços de oferta e controle visual de estoque.
    * Lógica de **Adicionar ao Carrinho** com atualização instantânea do estoque.
* **Navegação Móvel (Navbar):**
    * Menu Hambúrguer com **transição suave** de deslizar (`max-height` transition) no mobile.
    * **Navbar Sticky:** Barra de navegação fixa no topo ao rolar a página (`position: sticky`).
* **Detalhes do Produto:** Modal para visualização de detalhes completos do item, incluindo estoque atualizado.

---

## ⚙️ Estrutura de Arquivos

A estrutura de diretórios do projeto reflete a separação de responsabilidades (estrutura, estilo e lógica) e garante a organização dos ativos.


├── index.html            
├── css/                  
│   ├── style.css         
│   └── responsive.css    
├── js/                   
│   ├── main.js           
│   └── produtos.js       
├── data/                 
│   └── produtos.json     
├── assets/              
│   └── images/           
│      └── placeholder.png 
└── README.md             


---

## 💻 Tecnologias Utilizadas

* **HTML5:** Estrutura Semântica.
* **CSS3:** Estilização, Flexbox, Grid e Variáveis CSS.
* **JavaScript (ES6):** Lógica e manipulação de estado.
* **jQuery 3.6:** Simplificação de manipulação do DOM e requisições **AJAX**.
* **JSON:** Formato de dados.
* **Font Awesome:** Ícones.

---

## 🧠 Lógica do Sistema (`js/main.js`)

O arquivo JavaScript é o coração dinâmico do projeto, responsável por coordenar a interação e os dados:

* **`carregarProdutos()`:** Carrega os produtos via AJAX de `data/produtos.json` e inicializa os filtros.
* **`preencherCategorias()`:** Preenche automaticamente as opções de filtro com base nos dados carregados.
* **`exibirProdutos()`:** Renderiza o HTML dos cards na tela, aplicando as classes de estilo e verificando o estoque.
* **`filtrarProdutos()` / `ordenarProdutos()`:** Aplica a busca em tempo real e reordena os itens na grid.
* **`adicionarAoCarrinho()`:** Atualiza o estado do carrinho, decrementa o estoque do produto e fornece feedback visual.
* **`inicializarCarrossel()`:** Gerencia a transição automática dos slides (`setInterval`) e os controles manuais.

---

## 🚀 Como Executar o Projeto

**OBS:** Como o projeto utiliza requisições **AJAX** para carregar o `produtos.json`, o navegador pode bloquear o carregamento se o arquivo `index.html` for aberto diretamente (protocolo `file://`).

**Recomendação:** Utilizar um servidor local.

1.  **Utilize a Extensão Live Server (VS Code):**
    * No VS Code, vá em Extensions (`Ctrl+Shift+X`).
    * Pesquise e instale a extensão **Live Server**.
2.  **Iniciar:**
    * Clique com o botão direito no `index.html` e selecione **"Open With Live Server"**.

---

## 👥 Contribuidores / Owner

* **Kevein Cardoso Ferreira Dos Santos** (01797043)
* **Marcos Eduardo Oliveira Ferreira** (01839494)
* **Jóse Rivaldo Pereira Ziano da Silva** (01809882)
