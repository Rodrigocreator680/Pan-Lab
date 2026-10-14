/* =========================================================
   PAN LAB - panlab-categorias.js
   Lógica da página categorias.html:
   - desenha os separadores e os cartões de cada grupo
   - guarda quais as categorias escolhidas
   - filtra as receitas e mostra o resultado
   - guarda os filtros no endereço (URL), para poderes partilhar
     ou voltar atrás. Ex.: categorias.html?pais=italiana&dieta=low-carb

   Precisa de panlab-dados.js (categorias) e panlab-receitas.js (receitas) carregados antes (ver categorias.html).

   REGRA DOS FILTROS
   - Dentro do mesmo grupo vale QUALQUER uma das opções (Italiana OU Japonesa).
   - Entre grupos a receita tem de cumprir TODOS (Italiana E Vegetariano).

   ÍNDICE
   1. Preparação (referências ao HTML e estado)
   2. Funções de apoio
   3. Construir separadores e cartões
   4. Mudar de separador
   5. Atualizar a página (cartões, etiquetas, resultados)
   6. Filtros no endereço (URL)
   7. Eventos (cliques e teclado)
   8. Barra "Ver receitas" no telemóvel
   9. Arranque
   ========================================================= */
(function () {
  'use strict';

  /* =======================================================
     1. PREPARAÇÃO
     ======================================================= */
  document.documentElement.classList.add('js');

  // Cores dos cartões (as classes .tint-... existem no panlab-style.css)
  const TONS = ['tomato', 'lemon', 'basil', 'sky', 'plum', 'orange'];

  // Elementos do HTML com que vamos trabalhar
  const elTabs = document.getElementById('tabs');
  const elPaineis = document.getElementById('paineis');
  const elFiltrosAtivos = document.getElementById('filtros-ativos');
  const elChips = document.getElementById('chips');
  const elLimpar = document.getElementById('limpar');
  const elContagem = document.getElementById('contagem');
  const elGrelha = document.getElementById('grelha');
  const elVazio = document.getElementById('vazio');
  const elLimparVazio = document.getElementById('limpar-vazio');
  const elResultados = document.getElementById('resultados');
  const elBarra = document.getElementById('barra-resultados');
  const elBarraTexto = document.getElementById('barra-texto');
  const elRodape = document.querySelector('.site-footer');

  // Estado: para cada grupo, o conjunto de categorias escolhidas
  // Ex.: { pais: Set(['italiana']), dieta: Set(), ... }
  const escolhidos = {};
  GRUPOS.forEach(function (g) { escolhidos[g.id] = new Set(); });

  // Pesquisa rápida: "pais/italiana" -> { id, nome, icone, ... }
  const itemPorChave = {};
  GRUPOS.forEach(function (g) {
    g.itens.forEach(function (it) { itemPorChave[g.id + '/' + it.id] = it; });
  });


  /* =======================================================
     2. FUNÇÕES DE APOIO
     ======================================================= */
  function nomeDe(grupoId, itemId) {
    return itemPorChave[grupoId + '/' + itemId].nome;
  }

  // "1 receita" / "5 receitas"
  function textoReceitas(n) {
    return PL.n('{n} receita|{n} receitas', n);
  }

  // 75 -> "1 h 15 min"
  function formatarTempo(minutos) {
    return PL.tempo(minutos); // 75 -> "1 h 15 min" (muda com o idioma)
  }

  // Quantas receitas existem numa categoria (sem outros filtros)
  function contarReceitas(grupoId, itemId) {
    return RECEITAS.filter(function (r) {
      return valoresDaReceita(r, grupoId).indexOf(itemId) !== -1;
    }).length;
  }

  // Quantas categorias estão escolhidas no total
  function totalEscolhidos() {
    return GRUPOS.reduce(function (soma, g) { return soma + escolhidos[g.id].size; }, 0);
  }

  // Devolve só as receitas que cumprem os filtros ativos
  function filtrarReceitas() {
    return RECEITAS.filter(function (r) {
      return GRUPOS.every(function (g) {
        var sel = escolhidos[g.id];
        if (sel.size === 0) return true; // grupo sem filtro: aceita tudo
        return valoresDaReceita(r, g.id).some(function (v) { return sel.has(v); });
      });
    });
  }

  // HTML de um cartão de receita (usa as classes .recipe-card do panlab-style.css)
  function htmlReceita(r) {
    return '' +
      '<article class="recipe-card">' +
        '<div class="recipe-card__media tint-' + r.tom + '" aria-hidden="true">' + r.icone + '</div>' +
        '<div class="recipe-card__body">' +
          '<span class="recipe-card__category">' + nomeDe('refeicao', r.refeicao) + '</span>' +
          '<h3 class="recipe-card__title">' +
            '<a href="receita.html?id=' + r.id + '">' + r.titulo + '</a>' +
          '</h3>' +
          '<div class="meta">' +
            '<span>' + formatarTempo(r.tempo) + '</span>' +
            '<span>' + nomeDe('dificuldade', r.dificuldade) + '</span>' +
            '<span>' + nomeDe('pais', r.pais) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }


  /* =======================================================
     3. CONSTRUIR SEPARADORES E CARTÕES
     ======================================================= */
  function criarInterface() {
    GRUPOS.forEach(function (g, gi) {

      // --- Separador (botão no topo) ---
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'group-tab';
      tab.id = 'tab-' + g.id;
      tab.dataset.grupo = g.id;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'painel-' + g.id);
      tab.setAttribute('aria-selected', 'false');
      tab.tabIndex = -1;
      tab.innerHTML = g.nome + '<span class="group-tab__count" hidden></span>';
      elTabs.appendChild(tab);

      // --- Painel com os cartões desse grupo ---
      var cartoes = g.itens.map(function (it, i) {
        var tom = TONS[(i + gi) % TONS.length];
        var n = contarReceitas(g.id, it.id);
        return '' +
          '<button type="button" class="cat-card tint-' + tom + '"' +
                 ' data-grupo="' + g.id + '" data-id="' + it.id + '" aria-pressed="false">' +
            '<span class="cat-card__icon" aria-hidden="true">' + it.icone + '</span>' +
            '<span class="cat-card__name">' + it.nome + '</span>' +
            (it.detalhe ? '<span class="cat-card__detail">' + it.detalhe + '</span>' : '') +
            '<span class="cat-card__info">' + textoReceitas(n) + '</span>' +
          '</button>';
      }).join('');

      var painel = document.createElement('div');
      painel.className = 'group-panel';
      painel.id = 'painel-' + g.id;
      painel.hidden = true;
      painel.setAttribute('role', 'tabpanel');
      painel.setAttribute('aria-labelledby', 'tab-' + g.id);
      painel.innerHTML =
        '<p class="group-panel__intro">' + g.descricao + '</p>' +
        '<div class="cat-grid">' + cartoes + '</div>';
      elPaineis.appendChild(painel);
    });
  }


  /* =======================================================
     4. MUDAR DE SEPARADOR
     ======================================================= */
  function mostrarGrupo(grupoId, focar) {
    GRUPOS.forEach(function (g) {
      var ativo = g.id === grupoId;
      var tab = document.getElementById('tab-' + g.id);
      tab.setAttribute('aria-selected', ativo ? 'true' : 'false');
      tab.tabIndex = ativo ? 0 : -1;
      document.getElementById('painel-' + g.id).hidden = !ativo;
      if (ativo && focar) tab.focus();
    });
  }


  /* =======================================================
     5. ATUALIZAR A PÁGINA
     Chamada sempre que um filtro muda.
     ======================================================= */
  function atualizar() {
    var total = totalEscolhidos();

    // 5.1 Cartões: marcar os escolhidos
    document.querySelectorAll('.cat-card').forEach(function (c) {
      var ligado = escolhidos[c.dataset.grupo].has(c.dataset.id);
      c.setAttribute('aria-pressed', ligado ? 'true' : 'false');
    });

    // 5.2 Separadores: número de escolhas em cada grupo
    GRUPOS.forEach(function (g) {
      var n = escolhidos[g.id].size;
      var tab = document.getElementById('tab-' + g.id);
      var bolha = tab.querySelector('.group-tab__count');
      bolha.hidden = n === 0;
      bolha.textContent = n;
      tab.setAttribute('aria-label', n ? g.nome + ', ' + PL.n('{n} selecionada|{n} selecionadas', n) : g.nome);
    });

    // 5.3 Etiquetas dos filtros ativos (com botão para remover)
    elFiltrosAtivos.hidden = total === 0;
    elChips.innerHTML = GRUPOS.map(function (g) {
      return Array.from(escolhidos[g.id]).map(function (id) {
        var it = itemPorChave[g.id + '/' + id];
        return '<li><button type="button" class="chip" data-grupo="' + g.id + '" data-id="' + id + '"' +
               ' aria-label="' + PL.t('Remover filtro {nome}', { nome: it.nome }) + '">' +
               '<span aria-hidden="true">' + it.icone + '</span> ' + it.nome +
               '<span class="chip__x" aria-hidden="true">×</span></button></li>';
      }).join('');
    }).join('');

    // 5.4 Resultados
    var lista = filtrarReceitas();
    elGrelha.innerHTML = lista.map(htmlReceita).join('');
    elGrelha.hidden = lista.length === 0;
    elVazio.hidden = lista.length !== 0;

    var textoContagem = total === 0
      ? textoReceitas(RECEITAS.length)
      : PL.t('{n} de {total}', { n: lista.length, total: textoReceitas(RECEITAS.length) });
    elContagem.textContent = textoContagem;
    elBarraTexto.textContent = textoReceitas(lista.length);

    // 5.5 Endereço e barra do telemóvel
    guardarNaURL();
    atualizarBarra();
  }

  function alternar(grupoId, itemId) {
    var sel = escolhidos[grupoId];
    if (sel.has(itemId)) sel.delete(itemId); else sel.add(itemId);
    atualizar();
  }

  function limparTudo() {
    GRUPOS.forEach(function (g) { escolhidos[g.id].clear(); });
    atualizar();
  }


  /* =======================================================
     6. FILTROS NO ENDEREÇO (URL)
     ======================================================= */
  function guardarNaURL() {
    var params = new URLSearchParams();
    GRUPOS.forEach(function (g) {
      if (escolhidos[g.id].size) params.set(g.id, Array.from(escolhidos[g.id]).join(','));
    });
    var q = params.toString().replace(/%2C/g, ',');
    try {
      history.replaceState(null, '', q ? '?' + q : location.pathname);
    } catch (e) {
      /* alguns browsers não deixam alterar o endereço em ficheiros locais: ignora */
    }
  }

  // Lê o endereço e devolve o primeiro grupo que tiver filtros (ou null)
  function lerDaURL() {
    var params = new URLSearchParams(location.search);
    var primeiro = null;
    GRUPOS.forEach(function (g) {
      var valor = params.get(g.id);
      if (!valor) return;
      valor.split(',').forEach(function (id) {
        if (itemPorChave[g.id + '/' + id]) { // ignora ids que não existem
          escolhidos[g.id].add(id);
          if (!primeiro) primeiro = g.id;
        }
      });
    });
    return primeiro;
  }


  /* =======================================================
     7. EVENTOS
     ======================================================= */

  // Clique num separador
  elTabs.addEventListener('click', function (e) {
    var tab = e.target.closest('.group-tab');
    if (tab) mostrarGrupo(tab.dataset.grupo, false);
  });

  // Setas do teclado entre separadores
  elTabs.addEventListener('keydown', function (e) {
    var atual = GRUPOS.findIndex(function (g) { return 'tab-' + g.id === document.activeElement.id; });
    if (atual < 0) return;
    var novo = null;
    if (e.key === 'ArrowRight') novo = (atual + 1) % GRUPOS.length;
    else if (e.key === 'ArrowLeft') novo = (atual - 1 + GRUPOS.length) % GRUPOS.length;
    else if (e.key === 'Home') novo = 0;
    else if (e.key === 'End') novo = GRUPOS.length - 1;
    if (novo === null) return;
    e.preventDefault();
    mostrarGrupo(GRUPOS[novo].id, true);
  });

  // Clique num cartão de categoria
  elPaineis.addEventListener('click', function (e) {
    var cartao = e.target.closest('.cat-card');
    if (cartao) alternar(cartao.dataset.grupo, cartao.dataset.id);
  });

  // Clique numa etiqueta de filtro ativo (remove esse filtro)
  elChips.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (chip) alternar(chip.dataset.grupo, chip.dataset.id);
  });

  elLimpar.addEventListener('click', limparTudo);
  elLimparVazio.addEventListener('click', limparTudo);


  /* =======================================================
     8. BARRA "VER RECEITAS" (só aparece no telemóvel)
     Mostra quantas receitas há e leva até à lista.
     Esconde-se quando a lista ou o rodapé já estão a ser vistos.
     ======================================================= */
  var vendoResultados = false;
  var vendoRodape = false;

  function atualizarBarra() {
    elBarra.hidden = !(totalEscolhidos() > 0 && !vendoResultados && !vendoRodape);
  }

  function observarSecoes() {
    if (!('IntersectionObserver' in window)) return;

    // Considera a lista "vista" quando passa pela zona central do ecrã
    new IntersectionObserver(function (entradas) {
      vendoResultados = entradas[0].isIntersecting;
      atualizarBarra();
    }, { rootMargin: '-35% 0px -35% 0px' }).observe(elResultados);

    new IntersectionObserver(function (entradas) {
      vendoRodape = entradas[0].isIntersecting;
      atualizarBarra();
    }).observe(elRodape);
  }


  /* =======================================================
     9. ARRANQUE
     ======================================================= */
  criarInterface();
  var grupoInicial = lerDaURL() || GRUPOS[0].id;
  mostrarGrupo(grupoInicial, false);
  atualizar();
  observarSecoes();

})();
