/* =========================================================
   PAN LAB - panlab-pesquisa.js
   Pesquisa em tempo real + filtros avançados da página receitas.html.
   JavaScript puro, sem bibliotecas.

   Precisa destes ficheiros carregados antes (ver receitas.html):
   - panlab-dados.js     nomes e ícones das categorias (GRUPOS) e faixaDeTempo()
   - panlab-receitas.js  as receitas (BASE_DE_RECEITAS)

   COMO FUNCIONA, EM POUCAS PALAVRAS
   1. Ao abrir a página, cada receita é "indexada" uma vez: guardamos o
      título, os ingredientes e os nomes das categorias já sem acentos
      e em minúsculas.
   2. A cada letra escrita (ou filtro marcado) recalculamos tudo:
        pesquisa   -> cada palavra escrita tem de existir no título,
                      nos ingredientes ou nas categorias (palavra A E palavra B)
        filtros    -> dentro de um filtro vale QUALQUER opção marcada (OU);
                      entre filtros a receita tem de cumprir TODOS (E)
        ordenação  -> por relevância, tempo ou título
   3. Redesenhamos só os cartões e os números ao lado de cada filtro.
   4. A pesquisa e os filtros ficam guardados no endereço (URL).

   ÍNDICE
   1. Configuração dos filtros
   2. Preparação (índice das receitas)
   3. Pesquisa de texto
   4. Filtros, ordenação e contagens
   5. Desenhar a página
   6. Endereço (URL)
   7. Eventos
   8. Arranque
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* =======================================================
     1. CONFIGURAÇÃO DOS FILTROS
     Cada filtro diz como obter, de uma receita, os ids que a descrevem.
     Os ids são os mesmos de panlab-dados.js (GRUPOS) e do endereço
     (ex.: receitas.html?pais=italiana&dieta=sem-gluten).
     Para acrescentar um filtro novo, acrescenta uma linha aqui
     (e o grupo correspondente em panlab-dados.js).
     ======================================================= */
  var FILTROS = [
    { id: 'pais',        titulo: PL.t('País'),                valores: function (r) { return [r.categoria.pais]; } },
    { id: 'refeicao',    titulo: 'Tipo de refeição',    valores: function (r) { return [r.categoria.tipo]; } },
    { id: 'alimento',    titulo: 'Tipo de alimento',    valores: function (r) { return r.alimento || []; } },
    { id: 'tempo',       titulo: 'Tempo de preparação', valores: function (r) { return [faixaDeTempo(r.preparacao + r.cozedura)]; } },
    { id: 'dificuldade', titulo: 'Dificuldade',         valores: function (r) { return [r.dificuldade]; } },
    { id: 'dieta',       titulo: 'Dieta',               valores: function (r) { return r.dieta || []; } }
  ];

  // Filtros cujos nomes também entram na pesquisa de texto ("categorias")
  // Os títulos dos filtros vêm dos nomes (já traduzidos) dos grupos de categorias
  FILTROS.forEach(function (f) { f.titulo = GRUPOS.find(function (g) { return g.id === f.id; }).nome; });

  var FILTROS_NA_PESQUISA = ['pais', 'refeicao', 'alimento', 'dieta'];

  var ORDEM_PADRAO = 'relevancia';
  var ORDENS_VALIDAS = ['relevancia', 'rapidas', 'titulo'];


  /* =======================================================
     2. PREPARAÇÃO
     ======================================================= */
  function $(seletor) { return document.querySelector(seletor); }

  // Protege o texto antes de o pôr dentro de HTML
  function esc(texto) {
    return String(texto).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Tira acentos e maiúsculas: "Tiramisù" -> "tiramisu", "Glúten" -> "gluten"
  function normalizar(texto) {
    return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  // 75 -> "1 h 15 min"
  function formatarTempo(minutos) {
    return PL.tempo(minutos); // 75 -> "1 h 15 min" (muda com o idioma)
  }

  function textoReceitas(n) { return PL.n('{n} receita|{n} receitas', n); }

  // "bacalhau demolhado, em lombos" -> "bacalhau demolhado"
  function nomeCurto(texto) {
    return texto.split(',')[0].replace(/\s*\(.*?\)/g, '').trim();
  }

  // Pesquisa rápida das categorias: itemDe.pais.italiana -> { nome, icone, detalhe }
  var itemDe = {};
  GRUPOS.forEach(function (g) {
    itemDe[g.id] = {};
    g.itens.forEach(function (it) { itemDe[g.id][it.id] = it; });
  });

  function nomeDaCategoria(filtroId, valorId) {
    return itemDe[filtroId] && itemDe[filtroId][valorId] ? itemDe[filtroId][valorId].nome : valorId;
  }

  // Índice: uma entrada por receita, com o texto já preparado para pesquisar
  var indice = BASE_DE_RECEITAS.map(function (r) {
    var ingredientes = [];
    r.ingredientes.forEach(function (grupo) {
      grupo.itens.forEach(function (ing) {
        var nome = nomeCurto(ing.ns || ing.n);
        ingredientes.push({
          texto: normalizar(ing.n + ' ' + (ing.ns || '')),
          nome: nome,
          nomeNorm: normalizar(nome),
          completo: (ing.ns || ing.n).split(',')[0].trim() // mantém o que vem entre parênteses
        });
      });
    });

    var valores = {};
    FILTROS.forEach(function (f) { valores[f.id] = f.valores(r); });

    var categorias = [];
    FILTROS_NA_PESQUISA.forEach(function (id) {
      valores[id].forEach(function (v) { categorias.push(normalizar(nomeDaCategoria(id, v))); });
    });

    return {
      r: r,
      titulo: normalizar(r.titulo),
      ingredientes: ingredientes,
      categorias: categorias,
      valores: valores,
      tempo: r.preparacao + r.cozedura
    };
  });

  // Quantas receitas existem no total em cada opção (para esconder opções vazias)
  var totalPorOpcao = {};
  indice.forEach(function (item) {
    FILTROS.forEach(function (f) {
      item.valores[f.id].forEach(function (v) {
        totalPorOpcao[f.id + '/' + v] = (totalPorOpcao[f.id + '/' + v] || 0) + 1;
      });
    });
  });

  // Estado atual
  var consulta = '';
  var ordem = ORDEM_PADRAO;
  var escolhidos = {};
  FILTROS.forEach(function (f) { escolhidos[f.id] = new Set(); });

  // Referências à página
  var elQ = $('#q');
  var elQCabecalho = $('#pesquisa');
  var elOrdem = $('#ordem');
  var elGrelha = $('#grelha');
  var elVazio = $('#vazio');
  var elVazioTexto = $('#vazio-texto');
  var elLimparFiltrosVazio = $('#vazio-limpar-filtros');
  var elLimparPesquisaVazio = $('#vazio-limpar-pesquisa');
  var elContagem = $('#contagem');
  var elChips = $('#chips');
  var elFiltrosAtivos = $('#filtros-ativos');
  var elListaFiltros = $('#lista-filtros');
  var elPainel = $('#painel-filtros');
  var elBotaoFiltros = $('#btn-filtros');
  var elBotaoFiltrosTexto = $('#btn-filtros-texto');
  var elBotaoVer = $('#filtros-ver');
  var elLimparPainel = $('#limpar-painel');

  // Elementos de cada opção de filtro (preenchidos em desenharFiltros)
  var opcoes = {}; // "pais/italiana" -> { caixa, rotulo, contador }
  var distintivos = {}; // id do filtro -> bolinha com o número de escolhas


  /* =======================================================
     3. PESQUISA DE TEXTO
     ======================================================= */

  // "Arroz  de PATO" -> ['arroz', 'de', 'pato'] (sem acentos, sem repetidas)
  function termosDa(texto) {
    var vistos = {};
    return normalizar(texto).split(/\s+/).filter(function (t) {
      if (!t || vistos[t]) return false;
      vistos[t] = true;
      return true;
    });
  }

  // "massas" também procura "massa" (plural simples)
  function variantes(termo) {
    return (termo.length > 3 && termo.charAt(termo.length - 1) === 's') ? [termo, termo.slice(0, -1)] : [termo];
  }

  function contem(texto, vars) {
    for (var i = 0; i < vars.length; i++) {
      if (texto.indexOf(vars[i]) !== -1) return true;
    }
    return false;
  }

  /* Pesquisa uma receita. Devolve null se alguma palavra não aparecer em
     lado nenhum; senão devolve { score, onde }:
       score  pontuação de relevância (título pesa mais que ingredientes,
              e estes mais que categorias)
       onde   ingredientes que explicam o resultado, quando o título
              não os menciona (mostrados no cartão) */
  function pesquisar(item, termos) {
    if (!termos.length) return { score: 0, onde: [] };

    var score = 0;
    var onde = [];

    for (var t = 0; t < termos.length; t++) {
      var vars = variantes(termos[t]);
      var noTitulo = contem(item.titulo, vars);
      var nosIngredientes = item.ingredientes.filter(function (i) { return contem(i.texto, vars); });
      var nasCategorias = item.categorias.some(function (c) { return contem(c, vars); });

      if (!noTitulo && !nosIngredientes.length && !nasCategorias) return null;

      if (noTitulo) score += item.titulo.indexOf(vars[0]) === 0 ? 13 : 10;
      if (nosIngredientes.length) score += 4;
      if (nasCategorias) score += 3;

      if (!noTitulo && nosIngredientes.length) {
        // Mostra o nome completo se a palavra só aparece entre parênteses
        // (ex.: "mirin (vinho de arroz doce)" quando se pesquisa "arroz")
        var ing = nosIngredientes[0];
        var nomeAMostrar = contem(ing.nomeNorm, vars) ? ing.nome : ing.completo;
        if (onde.indexOf(nomeAMostrar) === -1) onde.push(nomeAMostrar);
      }
    }
    return { score: score, onde: onde };
  }


  /* =======================================================
     4. FILTROS, ORDENAÇÃO E CONTAGENS
     ======================================================= */

  // A receita cumpre o filtro? (sem nada marcado = cumpre sempre)
  function passaFiltro(item, filtro) {
    var marcados = escolhidos[filtro.id];
    if (marcados.size === 0) return true;
    return item.valores[filtro.id].some(function (v) { return marcados.has(v); });
  }

  function totalEscolhidos() {
    return FILTROS.reduce(function (soma, f) { return soma + escolhidos[f.id].size; }, 0);
  }

  function ordenar(lista, temPesquisa) {
    lista.sort(function (a, b) {
      if (ordem === 'rapidas' && a.item.tempo !== b.item.tempo) return a.item.tempo - b.item.tempo;
      if (ordem === 'titulo') return a.item.r.titulo.localeCompare(b.item.r.titulo, PL.lang);
      if (ordem === 'relevancia' && temPesquisa && a.score !== b.score) return b.score - a.score;
      if (ordem === 'relevancia' && !temPesquisa) return a.pos - b.pos;
      return a.item.r.titulo.localeCompare(b.item.r.titulo, PL.lang);
    });
  }


  /* =======================================================
     5. DESENHAR A PÁGINA
     ======================================================= */

  // HTML de um cartão de receita (usa as classes .recipe-card do panlab-style.css)
  function htmlCartao(res) {
    var r = res.item.r;
    var nota = res.onde.length
      ? '<p class="recipe-card__match">' + PL.t('Ingrediente:') + ' <strong>' + esc(res.onde.slice(0, 2).join(', ')) + '</strong></p>'
      : '';
    return '' +
      '<article class="recipe-card">' +
        '<div class="recipe-card__media tint-' + esc(r.tom) + '">' +
          '<img src="' + esc(r.imagem.src) + '" alt="' + esc(r.imagem.alt) + '" loading="lazy">' +
        '</div>' +
        '<div class="recipe-card__body">' +
          '<span class="recipe-card__category">' + esc(nomeDaCategoria('refeicao', r.categoria.tipo)) + '</span>' +
          '<h3 class="recipe-card__title"><a href="receita.html?id=' + encodeURIComponent(r.id) + '">' + esc(r.titulo) + '</a></h3>' +
          '<div class="meta">' +
            '<span>' + formatarTempo(res.item.tempo) + '</span>' +
            '<span>' + esc(nomeDaCategoria('dificuldade', r.dificuldade)) + '</span>' +
            '<span>' + esc(nomeDaCategoria('pais', r.categoria.pais)) + '</span>' +
          '</div>' +
          nota +
        '</div>' +
      '</article>';
  }

  // Constrói UMA vez o painel de filtros. Depois só se atualizam os números.
  function desenharFiltros() {
    elListaFiltros.innerHTML = '';

    FILTROS.forEach(function (f) {
      var grupo = GRUPOS.find(function (g) { return g.id === f.id; });
      var itens = grupo.itens.filter(function (it) { return totalPorOpcao[f.id + '/' + it.id]; });
      if (!itens.length) return;

      var detalhes = document.createElement('details');
      detalhes.className = 'filter-group';
      detalhes.open = true;

      var resumo = document.createElement('summary');
      resumo.innerHTML = '<span>' + esc(f.titulo) + '</span><span class="filter-group__badge" hidden></span>';
      detalhes.appendChild(resumo);
      distintivos[f.id] = resumo.querySelector('.filter-group__badge');

      var lista = document.createElement('ul');
      lista.className = 'filter-group__list';

      itens.forEach(function (it) {
        var li = document.createElement('li');
        li.innerHTML =
          '<label class="opt">' +
            '<input type="checkbox" data-grupo="' + f.id + '" data-id="' + it.id + '">' +
            '<span class="opt__icon" aria-hidden="true">' + it.icone + '</span>' +
            '<span class="opt__name">' + esc(it.nome) +
              (it.detalhe ? ' <small>' + esc(it.detalhe) + '</small>' : '') + '</span>' +
            '<span class="opt__count"></span>' +
          '</label>';
        lista.appendChild(li);
        opcoes[f.id + '/' + it.id] = {
          caixa: li.querySelector('input'),
          rotulo: li.querySelector('.opt'),
          contador: li.querySelector('.opt__count')
        };
      });

      detalhes.appendChild(lista);
      elListaFiltros.appendChild(detalhes);
    });
  }

  /* Função principal: recalcula e redesenha tudo.
     Chamada sempre que a pesquisa, um filtro ou a ordem mudam. */
  function atualizar() {
    var termos = termosDa(consulta);
    var temPesquisa = termos.length > 0;
    var nFiltros = totalEscolhidos();

    // 5.1 Pesquisa de texto em todas as receitas
    var resultadoPesquisa = indice.map(function (item) { return pesquisar(item, termos); });

    // 5.2 Resultados = pesquisa + todos os filtros
    var resultados = [];
    indice.forEach(function (item, pos) {
      var p = resultadoPesquisa[pos];
      if (!p) return;
      if (!FILTROS.every(function (f) { return passaFiltro(item, f); })) return;
      resultados.push({ item: item, score: p.score, onde: p.onde, pos: pos });
    });
    ordenar(resultados, temPesquisa);

    // 5.3 Cartões ou mensagem de "sem resultados"
    elGrelha.innerHTML = resultados.map(htmlCartao).join('');
    elGrelha.hidden = resultados.length === 0;
    elVazio.hidden = resultados.length !== 0;

    if (resultados.length === 0) {
      var texto;
      if (temPesquisa && nFiltros) texto = PL.t('Não encontrámos receitas para «{q}» com estes filtros.', { q: consulta.trim() });
      else if (temPesquisa) texto = PL.t('Não encontrámos receitas para «{q}».', { q: consulta.trim() });
      else texto = PL.t('Nenhuma receita corresponde a esta combinação de filtros.');
      elVazioTexto.textContent = texto;
      elLimparFiltrosVazio.hidden = nFiltros === 0;
      elLimparPesquisaVazio.hidden = !temPesquisa;
    }

    // 5.4 Contagens
    var textoContagem = (temPesquisa || nFiltros)
      ? PL.n('{n} receita encontrada|{n} receitas encontradas', resultados.length)
      : textoReceitas(resultados.length);
    elContagem.textContent = textoContagem;
    elBotaoVer.textContent = resultados.length === 0 ? PL.t('Sem receitas') : PL.n('Ver {n} receita|Ver {n} receitas', resultados.length);
    elBotaoFiltrosTexto.textContent = nFiltros ? PL.t('Filtros ({n})', { n: nFiltros }) : PL.t('Filtros');

    // 5.5 Números ao lado de cada opção: quantas receitas teria ao marcá-la
    //     (considerando a pesquisa e os OUTROS filtros). Opções a 0 ficam inativas.
    FILTROS.forEach(function (f) {
      var base = indice.filter(function (item, pos) {
        return resultadoPesquisa[pos] && FILTROS.every(function (g) { return g.id === f.id || passaFiltro(item, g); });
      });
      GRUPOS.find(function (g) { return g.id === f.id; }).itens.forEach(function (it) {
        var op = opcoes[f.id + '/' + it.id];
        if (!op) return;
        var n = base.filter(function (item) { return item.valores[f.id].indexOf(it.id) !== -1; }).length;
        var marcada = escolhidos[f.id].has(it.id);
        op.caixa.checked = marcada;
        op.contador.textContent = n;
        var inativa = n === 0 && !marcada;
        op.caixa.disabled = inativa;
        op.rotulo.classList.toggle('opt--off', inativa);
      });
      var d = distintivos[f.id];
      if (d) {
        d.hidden = escolhidos[f.id].size === 0;
        d.textContent = escolhidos[f.id].size;
      }
    });

    // 5.6 Etiquetas dos filtros ativos
    elFiltrosAtivos.hidden = nFiltros === 0;
    elChips.innerHTML = FILTROS.map(function (f) {
      return Array.from(escolhidos[f.id]).map(function (id) {
        var it = itemDe[f.id][id];
        return '<li><button type="button" class="chip" data-grupo="' + f.id + '" data-id="' + id + '"' +
               ' aria-label="' + esc(PL.t('Remover filtro {nome}', { nome: it.nome })) + '">' +
               '<span aria-hidden="true">' + it.icone + '</span> ' + esc(it.nome) +
               '<span class="chip__x" aria-hidden="true">×</span></button></li>';
      }).join('');
    }).join('');
    elLimparPainel.hidden = nFiltros === 0;

    guardarNaURL();
  }


  /* =======================================================
     6. ENDEREÇO (URL)
     Ex.: receitas.html?q=arroz&dieta=sem-gluten,low-carb&ordem=rapidas
     ======================================================= */
  function guardarNaURL() {
    var params = new URLSearchParams();
    if (consulta.trim()) params.set('q', consulta.trim());
    if (ordem !== ORDEM_PADRAO) params.set('ordem', ordem);
    FILTROS.forEach(function (f) {
      if (escolhidos[f.id].size) params.set(f.id, Array.from(escolhidos[f.id]).join(','));
    });
    var texto = params.toString().replace(/%2C/g, ',');
    try {
      history.replaceState(null, '', texto ? '?' + texto : location.pathname);
    } catch (e) {
      /* em ficheiros locais alguns browsers não deixam alterar o endereço: ignora */
    }
  }

  function lerDaURL() {
    var params = new URLSearchParams(location.search);
    consulta = params.get('q') || '';
    var o = params.get('ordem');
    if (ORDENS_VALIDAS.indexOf(o) !== -1) ordem = o;
    FILTROS.forEach(function (f) {
      var valor = params.get(f.id);
      if (!valor) return;
      valor.split(',').forEach(function (id) {
        if (itemDe[f.id] && itemDe[f.id][id]) escolhidos[f.id].add(id); // ignora ids que não existem
      });
    });
  }


  /* =======================================================
     7. EVENTOS
     ======================================================= */

  // Muda o texto da pesquisa (a barra grande e a do cabeçalho andam juntas)
  function definirConsulta(texto) {
    consulta = texto;
    if (elQ.value !== texto) elQ.value = texto;
    if (elQCabecalho && elQCabecalho.value !== texto) elQCabecalho.value = texto;
    atualizar();
  }

  function limparFiltros() {
    FILTROS.forEach(function (f) { escolhidos[f.id].clear(); });
    atualizar();
  }

  function alternar(grupoId, itemId) {
    var sel = escolhidos[grupoId];
    if (sel.has(itemId)) sel.delete(itemId); else sel.add(itemId);
    atualizar();
  }

  function abrirPainel(abrir) {
    elPainel.classList.toggle('filters--open', abrir);
    elBotaoFiltros.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  }

  function ligarEventos() {
    // Escrever: resultados em tempo real
    elQ.addEventListener('input', function () { definirConsulta(elQ.value); });
    if (elQCabecalho) {
      elQCabecalho.addEventListener('input', function () { definirConsulta(elQCabecalho.value); });
      // Neste página a pesquisa já é em tempo real: não recarrega
      elQCabecalho.form.addEventListener('submit', function (e) {
        e.preventDefault();
        $('#resultados').scrollIntoView();
      });
    }
    elQ.form.addEventListener('submit', function (e) { e.preventDefault(); });

    // Sugestões de pesquisa
    document.querySelectorAll('.suggest').forEach(function (b) {
      b.addEventListener('click', function () {
        definirConsulta(b.dataset.q);
        elQ.focus();
      });
    });

    // Marcar e desmarcar filtros
    elListaFiltros.addEventListener('change', function (e) {
      var caixa = e.target.closest('input[type="checkbox"]');
      if (caixa) alternar(caixa.dataset.grupo, caixa.dataset.id);
    });

    // Etiquetas dos filtros ativos
    elChips.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (chip) alternar(chip.dataset.grupo, chip.dataset.id);
    });

    // Ordenação
    elOrdem.addEventListener('change', function () {
      ordem = ORDENS_VALIDAS.indexOf(elOrdem.value) !== -1 ? elOrdem.value : ORDEM_PADRAO;
      atualizar();
    });

    // Botões de limpar
    $('#limpar').addEventListener('click', limparFiltros);
    elLimparPainel.addEventListener('click', limparFiltros);
    elLimparFiltrosVazio.addEventListener('click', limparFiltros);
    elLimparPesquisaVazio.addEventListener('click', function () { definirConsulta(''); elQ.focus(); });

    // Painel de filtros no telemóvel
    elBotaoFiltros.addEventListener('click', function () {
      abrirPainel(!elPainel.classList.contains('filters--open'));
    });
    elBotaoVer.addEventListener('click', function () {
      abrirPainel(false);
      $('#resultados').scrollIntoView();
    });
  }


  /* =======================================================
     8. ARRANQUE
     ======================================================= */
  lerDaURL();
  desenharFiltros();
  elQ.value = consulta;
  if (elQCabecalho) elQCabecalho.value = consulta;
  elOrdem.value = ordem;
  ligarEventos();
  atualizar();

})();
