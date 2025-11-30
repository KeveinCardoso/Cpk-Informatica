// js/main.js
$(document).ready(function() {
    
    // ===================================================
    // VARIÁVEIS DE ESTADO
    // ===================================================
    let produtos = [];
    let produtosFiltrados = [];
    let carrinho = []; // { id: number, nome: string, preco: number, quantidade: number }
    let carrinhoContagem = 0;

    // ===================================================
    //  ELEMENTOS DOM
    // ===================================================
    const $productGrid = $('#product-grid');
    const $statusMessage = $('#status-message');
    const $loadProductsBtn = $('#load-products-btn');
    const $searchInput = $('#search-input');
    const $filterCategory = $('#filter-category');
    const $sortBy = $('#sort-by');
    const $modal = $('#product-modal');
    const $modalBody = $('#modal-body');
    const $closeBtn = $('.close-btn');
    const $cartCount = $('#cart-count'); // Elemento para exibir a contagem no cabeçalho

    // ===================================================
    //  FUNÇÕES DE ESTADO E UTILIDADE
    // ===================================================

    function setLoadingState() {
        $statusMessage.html('<div class="loading"><span class="loading-spinner"></span>Carregando produtos...</div>');
        $loadProductsBtn.prop('disabled', true).text('Carregando...');
    }

    function resetLoadingState() {
        $loadProductsBtn.prop('disabled', false).text('Carregar Produtos');
    }

    // Carregar produtos do JSON
    function carregarProdutos() {
        setLoadingState();
        
        // arquivo data/produtos.json
        $.ajax({
            url: 'data/produtos.json',
            type: 'GET',
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
                produtos = data.produtos || [];
                produtosFiltrados = [...produtos];

                if (produtos.length === 0) {
                    $statusMessage.html('<div class="error">Nenhum produto encontrado no arquivo.</div>');
                    return;
                }
                
                preencherCategorias();
                exibirProdutos(produtosFiltrados);
                
                const totalEncontrado = data.total !== undefined ? data.total : produtos.length;
                const mensagemSucesso = data.mensagem || "Sucesso!";
                $statusMessage.html(`<div class="success">${mensagemSucesso} ${totalEncontrado} produtos encontrados.</div>`);
            },
            error: function() {
                $statusMessage.html('<div class="error">Erro ao carregar produtos. Verifique o caminho (data/produtos.json) e o formato do JSON.</div>');
            },
            complete: resetLoadingState
        });
    }

    // Preencher dropdown de categorias
    function preencherCategorias() {
        $filterCategory.empty().append('<option value="all">Todas as Categorias</option>');
        const categorias = [...new Set(produtos.map(p => p.categoria))].sort();
        
        categorias.forEach(categoria => {
            $filterCategory.append(`<option value="${categoria}">${categoria}</option>`);
        });
    }


    //  LÓGICA DO CARRINHO

    /**
     * Adiciona um produto ao carrinho e atualiza o estoque.
     * @param {number} productId O ID do produto a ser adicionado.
     * @param {object} $button O elemento jQuery do botão (opcional) para feedback visual.
     */
    function adicionarAoCarrinho(productId, $button = null) {
        // Encontra o produto na lista global (por referência)
        const produto = produtos.find(p => p.id === productId);
        
        if (!produto || produto.estoque <= 0) {
            alert('Produto esgotado ou não encontrado!');
            return;
        }
        
        // Atualiza o estoque na lista global
        produto.estoque--;
        
        // Atualiza o carrinho (array detalhado)
        const itemCarrinho = carrinho.find(item => item.id === productId);
        
        if (itemCarrinho) {
            itemCarrinho.quantidade++;
        } else {
            carrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                quantidade: 1
            });
        }
        
        // Atualiza a contagem simples no DOM
        carrinhoContagem++;
        $cartCount.text(carrinhoContagem); 
        
        // Feedback visual
        if ($button) {
            $button.prop('disabled', true).html('<i class="fas fa-check"></i> Adicionado');
            setTimeout(() => {
                // Atualiza a grid para refletir o novo estoque imediatamente
                exibirProdutos(produtosFiltrados); 
                // Se o modal estiver aberto, recarrega o modal para refletir o novo estoque
                if ($modal.is(':visible')) {
                    abrirModal(productId, false); // reabre sem fade para não piscar
                }
            }, 500);
        }
    }

    // 5. RENDERIZAÇÃO E EVENTOS
    
    // Exibir produtos na grid - CORRIGIDO PARA USAR AS CLASSES DO CSS
    function exibirProdutos(produtosArray) {
        $productGrid.empty();
        
        if (produtosArray.length === 0) {
            $productGrid.html('<div class="no-products">Nenhum produto encontrado com os filtros atuais.</div>');
            return;
        }

        produtosArray.forEach(produto => {
            const isEsgotado = produto.estoque <= 0;
            const estoqueStatus = isEsgotado ? 'ESGOTADO' : `Estoque: ${produto.estoque} unidades`;
            
            // Simula um preço antigo para o badge 'OFERTA' no CSS
            const precoOld = produto.preco * 1.2; 
            const isOffer = produto.preco < precoOld;

            const produtoCard = `
                <div class="product-card" data-id="${produto.id}">
                    <div class="product-image-container">
                        <img src="${produto.imagem}" alt="${produto.nome}" 
                             onerror="this.src='img/placeholder.png'">
                        ${isOffer ? '<span class="product-badge sale">OFERTA</span>' : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${produto.nome}</h3> 
                        <p class="product-category">${produto.categoria}</p>
                        
                        <div class="product-price">
                            ${isOffer ? `<span class="price-old">R$ ${precoOld.toFixed(2)}</span>` : ''}
                            <span class="price-current">R$ ${produto.preco.toFixed(2)}</span>
                        </div>
                        
                        <div class="card-actions">
                            <p class="product-stock ${isEsgotado || produto.estoque < 10 ? 'low-stock' : ''}">
                                ${estoqueStatus}
                            </p>
                            <button class="btn-details" data-id="${produto.id}">Ver Detalhes</button>
                            <button class="btn-add-cart" data-id="${produto.id}" ${isEsgotado ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i>
                                ${isEsgotado ? 'Esgotado' : 'Adicionar'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            $productGrid.append(produtoCard);
        });

        // Adicionar eventos aos botões de detalhes
        $('.btn-details').on('click', function() {
            const productId = $(this).data('id');
            abrirModal(productId);
        });
        
        // Adicionar evento aos botões "Adicionar ao Carrinho" da grid
        $('.btn-add-cart:not([disabled])').on('click', function() {
            const productId = $(this).data('id');
            adicionarAoCarrinho(productId, $(this)); 
        });
    }

    // Filtrar produtos
    function filtrarProdutos() {
        const termoBusca = $searchInput.val().toLowerCase().trim();
        const categoriaSelecionada = $filterCategory.val();
        
        produtosFiltrados = produtos.filter(produto => {
            const matchBusca = produto.nome.toLowerCase().includes(termoBusca) || 
                             produto.descricao.toLowerCase().includes(termoBusca);
            const matchCategoria = categoriaSelecionada === 'all' || produto.categoria === categoriaSelecionada;
            
            return matchBusca && matchCategoria;
        });
        
        ordenarProdutos();
        exibirProdutos(produtosFiltrados);
        
        $statusMessage.html(`<div class="info">${produtosFiltrados.length} produto(s) encontrado(s)</div>`);
    }

    // Ordenar produtos
    function ordenarProdutos() {
        const ordenacao = $sortBy.val();
        
        switch(ordenacao) {
            case 'nome-asc':
                produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'nome-desc':
                produtosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
                break;
            case 'preco-asc':
                produtosFiltrados.sort((a, b) => a.preco - b.preco);
                break;
            case 'preco-desc':
                produtosFiltrados.sort((a, b) => b.preco - a.preco);
                break;
            case 'categoria-asc':
                produtosFiltrados.sort((a, b) => a.categoria.localeCompare(b.categoria));
                break;
        }
    }

    // Abrir modal com detalhes do produto
    function abrirModal(productId, useFade = true) {
        const produto = produtos.find(p => p.id === productId);
        
        if (produto) {
            const isEsgotado = produto.estoque <= 0;
            const estoqueStatus = isEsgotado ? 'Esgotado' : `${produto.estoque} unidades`;

            const modalContent = `
                <div class="modal-product">
                    <div class="modal-image">
                        <img src="${produto.imagem}" alt="${produto.nome}"
                             onerror="this.src='img/placeholder.png'"> </div>
                    <div class="modal-details">
                        <h2>${produto.nome}</h2>
                        <p class="modal-category"><strong>Categoria:</strong> ${produto.categoria}</p>
                        <p class="modal-price"><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
                        <p class="modal-stock ${isEsgotado || produto.estoque < 10 ? 'low-stock' : ''}">
                            <strong>Estoque:</strong> ${estoqueStatus}
                        </p>
                        <p class="modal-description"><strong>Descrição:</strong> ${produto.descricao}</p>
                        
                        <div class="modal-actions">
                            <button id="modal-add-to-cart-btn" 
                                    class="btn-primary" 
                                    data-id="${produto.id}" 
                                    ${isEsgotado ? 'disabled' : ''}>
                                ${isEsgotado ? 'Esgotado' : 'Adicionar ao Carrinho'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            $modalBody.html(modalContent);

            if (useFade) {
                $modal.fadeIn(300);
                $('body').css('overflow', 'hidden');
            } else {
                 $modal.show(); // Apenas mostra se já estiver aberto (para atualizar estoque sem piscar)
            }
            
            // Adicionar o Event Listener para o botão do modal
            $('#modal-add-to-cart-btn:not([disabled])').on('click', function() {
                adicionarAoCarrinho(productId, $(this));
            });
        }
    }

    // Fechar modal
    function fecharModal() {
        $modal.fadeOut(300, function() {
            $('body').css('overflow', 'auto');
        });
    }

    //  INICIALIZAÇÃO E EVENTOS GERAIS

    // Event Listeners
    $loadProductsBtn.on('click', carregarProdutos);
    
    $searchInput.on('input', filtrarProdutos);
    
    $filterCategory.on('change', filtrarProdutos);
    
    $sortBy.on('change', function() {
        ordenarProdutos();
        exibirProdutos(produtosFiltrados);
    });
    
    $closeBtn.on('click', fecharModal);
    
    // Fechar modal clicando fora
    $(window).on('click', function(event) {
        if ($(event.target).is($modal)) {
            fecharModal();
        }
    });

    // Fechar modal com ESC
    $(document).on('keyup', function(event) {
        if (event.key === 'Escape') {
            fecharModal();
        }
    });

    // Adicionar estilo para estoque baixo (apenas para garantir)
    $('<style>.low-stock { color: #dc3545; font-weight: bold; }</style>').appendTo('head');

    // Inicialização
    carregarProdutos(); // Carrega produtos automaticamente ao carregar a página

    
    // AÇÕES DA NAVBAR (Mobile)
    const $navToggle = $('#nav-toggle');
    const $navMenu = $('#nav-menu');

    $navToggle.on('click', function() {
        $navMenu.toggleClass('active'); // Adiciona/remove a classe 'active' que o CSS usa
    });
});


// LÓGICA DO CARROSSEL

function inicializarCarrossel() {
    const $carouselContainer = $('.carousel-container');
    const $slides = $carouselContainer.find('.carousel-slide');
    const $dots = $carouselContainer.find('.dot');
    const totalSlides = $slides.length;
    let currentIndex = 0;
    let intervalId;

    // Função de renderização para mostrar o slide correto
    function updateCarousel(newIndex) {
        // Remove a classe 'active' de todos os slides e dots
        $slides.removeClass('active');
        $dots.removeClass('active');

        // Garante que o índice esteja dentro dos limites
        if (newIndex >= totalSlides) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = totalSlides - 1;
        }
        currentIndex = newIndex;

        // Adiciona a classe 'active' ao slide e dot corretos
        const $currentSlide = $slides.eq(currentIndex);
        $currentSlide.addClass('active');
        $dots.eq(currentIndex).addClass('active');

        // Define a imagem de fundo via CSS (usando o data-background)
        const bgImage = $currentSlide.data('background');
        if (bgImage) {
            $currentSlide.css('background-image', `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${bgImage}')`);
        }
    }

    // Inicializa a exibição (aplica o fundo da primeira imagem)
    updateCarousel(0); 

    // Função para alternar slides automaticamente
    function startAutoSlide() {
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(() => {
            updateCarousel(currentIndex + 1);
        }, 3000); // Troca a cada 5 segundos
    }

    // Controles de clique (setas)
    $('#carousel-next').on('click', function() {
        startAutoSlide(); // Reinicia o timer após interação manual
        updateCarousel(currentIndex + 1);
    });

    $('#carousel-prev').on('click', function() {
        startAutoSlide(); // Reinicia o timer
        updateCarousel(currentIndex - 1);
    });

    // Controles de clique (pontos)
    $dots.on('click', function() {
        const slideIndex = $(this).data('slide-to');
        startAutoSlide(); // Reinicia o timer
        updateCarousel(slideIndex);
    });

    // Inicia a troca automática
    startAutoSlide();
}

// Chame a função de inicialização do carrossel após o carregamento
inicializarCarrossel();
