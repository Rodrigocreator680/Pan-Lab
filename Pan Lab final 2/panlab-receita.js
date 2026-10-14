/* =========================================================
   PAN LAB - panlab-receita.js
   Lógica da página receita.html.
   Lê o id do endereço (receita.html?id=bacalhau-com-natas), procura a
   receita em panlab-receitas.js (BASE_DE_RECEITAS) e preenche a página.

   ÍNDICE
   1. Preparação (qual é a receita?)
   2. Funções de apoio
   3. Topo: título, tempos, etiquetas
   4. Galeria de imagens
   5. Ingredientes (com ajuste de porções)
   6. Passos, dicas e nutrição
   7. Receitas relacionadas
   8. Botões: favoritos, imprimir, partilhar
   9. Arranque
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');


  /* =======================================================
     1. PREPARAÇÃO
     ======================================================= */
  var id = new URLSearchParams(location.search).get('id');
  var base = RECEITAS.find(function (r) { return r.id === id; }) || null; // resumo
  var det = base ? obterReceita(id) : null; // receita completa (null = sem conteúdo)

  function $(seletor) { return document.querySelector(seletor); }

  // Pesquisa rápida das categorias: "pais/italiana" -> { nome, ... }
  var itemPorChave = {};
  GRUPOS.forEach(function (g) {
    g.itens.forEach(function (it) { itemPorChave[g.id + '/' + it.id] = it; });
  });
  function nomeDe(grupoId, itemId) { return itemPorChave[grupoId + '/' + itemId].nome; }


  /* =======================================================
     2. FUNÇÕES DE APOIO
     ======================================================= */

  // Protege o texto antes de o pôr dentro de HTML
  function esc(texto) {
    return String(texto).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // 75 -> "1 h 15 min"
  function formatarTempo(minutos) {
    return PL.tempo(minutos); // 75 -> "1 h 15 min" (muda com o idioma)
  }

  // 1.5 -> "1,5"
  function numeroPT(n) { return PL.num(n); }

  // Mensagem curta que desaparece sozinha
  var temporizadorAviso = null;
  function aviso(texto) {
    var el = $('#aviso');
    el.textContent = texto;
    el.hidden = false;
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () { el.hidden = true; }, 2800);
  }


  /* =======================================================
     3. TOPO: TÍTULO, TEMPOS, ETIQUETAS
     ======================================================= */
  function renderTopo() {
    document.title = base.titulo + ' | Pan Lab';
    $('#titulo').textContent = base.titulo;

    if (det) {
      $('#descricao').textContent = det.descricao;
      $('#descricao').hidden = false;
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', det.descricao);
    }

    // Caminho: Início / Categorias / Tipo de refeição / Receita
    $('#breadcrumb').innerHTML =
      '<li><a href="index.html">' + PL.t('Início') + '</a></li>' +
      '<li><a href="categorias.html">' + PL.t('Categorias') + '</a></li>' +
      '<li><a href="categorias.html?refeicao=' + base.refeicao + '">' + esc(nomeDe('refeicao', base.refeicao)) + '</a></li>' +
      '<li><span aria-current="page">' + esc(base.titulo) + '</span></li>';

    // Os 4 dados principais
    var factos = [];
    if (det) {
      factos.push([PL.t('Preparação'), formatarTempo(det.preparacao), '']);
      factos.push([PL.t('Cozedura'), det.cozedura ? formatarTempo(det.cozedura) : PL.t('Sem cozedura'), '']);
      // Frio, demolha ou marinada: só aparece nas receitas que o têm
      if (det.repouso) factos.push([PL.t('Repouso'), formatarTempo(det.repouso), '']);
      factos.push([PL.t('Porções'), String(det.porcoes), 'fact-porcoes']);
      factos.push([PL.t('Dificuldade'), nomeDe('dificuldade', base.dificuldade), '']);
      $('#tempo-total').innerHTML = PL.t('Pronto em {t}', { t: '<strong>' + formatarTempo(tempoTotal(det)) + '</strong>' });
      $('#tempo-total').hidden = false;
    } else {
      factos.push([PL.t('Tempo total'), formatarTempo(base.tempo), '']);
      factos.push([PL.t('Dificuldade'), nomeDe('dificuldade', base.dificuldade), '']);
    }
    $('#factos').innerHTML = factos.map(function (f) {
      return '<div class="fact"><dt>' + f[0] + '</dt><dd' + (f[2] ? ' id="' + f[2] + '"' : '') + '>' + esc(f[1]) + '</dd></div>';
    }).join('');

    // Etiquetas (país, refeição, alimentos, dietas): cada uma abre a página de categorias filtrada
    var etiquetas = [['pais', base.pais], ['refeicao', base.refeicao]]
      .concat(base.alimento.map(function (a) { return ['alimento', a]; }))
      .concat(base.dieta.map(function (d) { return ['dieta', d]; }));
    $('#etiquetas').innerHTML = etiquetas.map(function (e) {
      return '<li><a class="tag" href="categorias.html?' + e[0] + '=' + e[1] + '">' + esc(nomeDe(e[0], e[1])) + '</a></li>';
    }).join('');
  }


  /* =======================================================
     4. GALERIA DE IMAGENS
     Uma imagem grande + miniaturas. Sem o campo "galeria", usa só o emoji.
     ======================================================= */
  var galeria = [];
  var imagemAtual = 0;

  function htmlImagem(item) {
    if (item.src) {
      return '<img src="' + esc(item.src) + '" alt="' + esc(item.alt || base.titulo) + '">';
    }
    return '<div class="gallery__placeholder tint-' + (item.tom || base.tom) + '" role="img" aria-label="' +
           esc(item.alt || base.titulo) + '">' + '</div>';
  }

  function htmlMiniatura(item) {
    if (item.src) return '<img src="' + esc(item.src) + '" alt="">';
    return '<span class="tint-' + (item.tom || base.tom) + '" aria-hidden="true">' + (item.emoji || base.icone) + '</span>';
  }

  function mostrarImagem(i) {
    imagemAtual = (i + galeria.length) % galeria.length;
    $('#galeria-imagem').innerHTML = htmlImagem(galeria[imagemAtual]);
    $('#galeria-contador').textContent = PL.t('{n} de {total}', { n: imagemAtual + 1, total: galeria.length });
    if (window.PanLabFotos) PanLabFotos.credito($('#galeria-credito'), galeria[imagemAtual]);
    document.querySelectorAll('.gallery__thumb').forEach(function (b, n) {
      b.setAttribute('aria-current', n === imagemAtual ? 'true' : 'false');
    });
  }

  function renderGaleria() {
    galeria = [{ tom: base.tom, alt: base.titulo }]; // só a foto real (chega já a seguir)

    var varias = false;
    $('#galeria-anterior').hidden = !varias;
    $('#galeria-seguinte').hidden = !varias;
    $('#galeria-contador').hidden = !varias;
    $('#galeria-miniaturas').hidden = !varias;

    if (varias) {
      $('#galeria-miniaturas').innerHTML = galeria.map(function (item, n) {
        return '<li><button type="button" class="gallery__thumb" data-n="' + n + '" aria-label="' +
               esc(PL.t('Ver imagem {n} de {total}', { n: n + 1, total: galeria.length })) + '">' + htmlMiniatura(item) + '</button></li>';
      }).join('');
    }
    mostrarImagem(0);

    $('#galeria-anterior').addEventListener('click', function () { mostrarImagem(imagemAtual - 1); });
    $('#galeria-seguinte').addEventListener('click', function () { mostrarImagem(imagemAtual + 1); });
    $('#galeria-miniaturas').addEventListener('click', function (e) {
      var b = e.target.closest('.gallery__thumb');
      if (b) mostrarImagem(Number(b.dataset.n));
    });
    // Setas do teclado quando o foco está na galeria
    $('#galeria').addEventListener('keydown', function (e) {
      if (galeria.length < 2) return;
      if (e.key === 'ArrowLeft') { mostrarImagem(imagemAtual - 1); }
      else if (e.key === 'ArrowRight') { mostrarImagem(imagemAtual + 1); }
    });
  }


  /* =======================================================
     5. INGREDIENTES (COM AJUSTE DE PORÇÕES)
     As quantidades são multiplicadas por (porções atuais / porções da receita).
     ======================================================= */
  var PORCOES_MIN = 1;
  var PORCOES_MAX = 12;
  var porcoesAtuais = 0;
  var marcados = new Set(); // ingredientes riscados (guardam-se ao mudar as porções)

  // Arredonda para valores "de cozinha": múltiplos de 5 acima de 100, inteiros acima de 10, quartos abaixo
  function arredondar(q) {
    if (q >= 100) return Math.round(q / 5) * 5;
    if (q >= 10) return Math.round(q);
    return Math.max(0.25, Math.round(q * 4) / 4);
  }

  // 1.5 -> "1 ½"   0.25 -> "¼"   4 -> "4"
  function formatarQuantidade(n) {
    var inteiro = Math.floor(n);
    var quarto = Math.round((n - inteiro) * 4) / 4;
    if (quarto === 1) { inteiro += 1; quarto = 0; }
    var simbolo = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' }[quarto];
    if (!simbolo) return String(inteiro);
    return inteiro ? inteiro + ' ' + simbolo : simbolo;
  }

  // Devolve as duas partes de uma linha de ingrediente: a quantidade (a negrito) e o resto
  function partesIngrediente(ing, fator) {
    if (ing.q === null || ing.q === undefined) {
      return { forte: '', resto: ing.n, qb: true };
    }
    var q = ing.q * fator;
    q = ing.inteiro ? Math.max(1, Math.round(q)) : arredondar(q);

    var plural = q > 1;
    var unidade = ing.u ? ((plural && ing.up) ? ing.up : ing.u) : '';
    var nome = (!plural && ing.ns) ? ing.ns : ing.n;

    return {
      forte: formatarQuantidade(q) + (unidade ? ' ' + unidade : ''),
      resto: unidade ? PL.ligar(nome, unidade) : nome,
      qb: false
    };
  }

  function renderIngredientes() {
    var fator = porcoesAtuais / det.porcoes;

    $('#lista-ingredientes').innerHTML = det.ingredientes.map(function (grupo, gi) {
      var titulo = grupo.titulo ? '<h3 class="ingredients__group">' + esc(grupo.titulo) + '</h3>' : '';
      var itens = grupo.itens.map(function (ing, ii) {
        var chave = gi + '-' + ii;
        var p = partesIngrediente(ing, fator);
        var texto = p.qb
          ? esc(p.resto) + ' <span class="ingredient__qb">' + esc(PL.t('q.b.')) + '</span>'
          : '<strong>' + esc(p.forte) + '</strong> ' + esc(p.resto);
        return '<li><label class="ingredient">' +
                 '<input type="checkbox" data-chave="' + chave + '"' + (marcados.has(chave) ? ' checked' : '') + '>' +
                 '<span class="ingredient__text">' + texto + '</span>' +
               '</label></li>';
      }).join('');
      return titulo + '<ul class="ingredients__list">' + itens + '</ul>';
    }).join('');

    // Textos que dependem do número de porções
    $('#porcoes-valor').textContent = porcoesAtuais;
    $('#porcoes-impressao').textContent = PL.n('Quantidades para {n} porção.|Quantidades para {n} porções.', porcoesAtuais);
    $('#porcoes-menos').disabled = porcoesAtuais <= PORCOES_MIN;
    $('#porcoes-mais').disabled = porcoesAtuais >= PORCOES_MAX;
    var factoPorcoes = $('#fact-porcoes');
    if (factoPorcoes) factoPorcoes.textContent = porcoesAtuais;
  }

  function mudarPorcoes(delta) {
    var novo = Math.min(PORCOES_MAX, Math.max(PORCOES_MIN, porcoesAtuais + delta));
    if (novo === porcoesAtuais) return;
    porcoesAtuais = novo;
    renderIngredientes();
  }

  function ligarIngredientes() {
    porcoesAtuais = det.porcoes;
    renderIngredientes();
    $('#porcoes-menos').addEventListener('click', function () { mudarPorcoes(-1); });
    $('#porcoes-mais').addEventListener('click', function () { mudarPorcoes(1); });
    $('#lista-ingredientes').addEventListener('change', function (e) {
      var caixa = e.target.closest('input[type="checkbox"]');
      if (!caixa) return;
      if (caixa.checked) marcados.add(caixa.dataset.chave); else marcados.delete(caixa.dataset.chave);
    });
  }


  /* =======================================================
     6. PASSOS, DICAS E NUTRIÇÃO
     ======================================================= */
  function renderPassos() {
    $('#passos').innerHTML = det.passos.map(function (p) {
      return '<li class="step"><div class="step__body">' +
               '<h3 class="step__title">' + esc(p.t) + '</h3>' +
               '<p>' + esc(p.x) + '</p>' +
             '</div></li>';
    }).join('');
  }

  function renderDicas() {
    $('#dicas-lista').innerHTML = det.dicas.map(function (d) {
      return '<li class="tip"><h3>' + esc(d.t) + '</h3><p>' + esc(d.x) + '</p></li>';
    }).join('');
  }

  // [campo, nome a mostrar, unidade]
  var NUTRIENTES = [
    ['calorias', PL.t('Energia'), 'kcal'],
    ['proteina', PL.t('Proteína'), 'g'],
    ['hidratos', PL.t('Hidratos de carbono'), 'g'],
    ['acucares', PL.t('dos quais açúcares'), 'g'],
    ['gordura', PL.t('Gordura'), 'g'],
    ['saturada', PL.t('dos quais saturada'), 'g'],
    ['fibra', PL.t('Fibra'), 'g'],
    ['sal', PL.t('Sal'), 'g']
  ];

  function renderNutricao() {
    var porcao = det.porcaoNome || PL.t('porção');
    $('#nutricao-nota').textContent =
      PL.t('Valores estimados por {porcao}. Podem variar consoante as marcas e as quantidades usadas.', { porcao: porcao });
    $('#nutricao-lista').innerHTML = NUTRIENTES.map(function (n, i) {
      var valor = det.nutricao[n[0]];
      return '<div class="nutrition__item' + (i === 0 ? ' nutrition__item--main' : '') + '">' +
               '<dt>' + n[1] + '</dt>' +
               '<dd>' + numeroPT(valor) + ' <small>' + n[2] + '</small></dd>' +
             '</div>';
    }).join('');
  }


  /* =======================================================
     7. RECEITAS RELACIONADAS
     Pontuação: ingredientes principais em comum (2 pontos cada),
     mesmo país (2), mesma refeição (1), dietas em comum (0,5 cada).
     ======================================================= */
  function relacionadas() {
    return RECEITAS
      .filter(function (r) { return r.id !== base.id; })
      .map(function (r) {
        var pontos = 0;
        pontos += 2 * r.alimento.filter(function (a) { return base.alimento.indexOf(a) !== -1; }).length;
        if (r.pais === base.pais) pontos += 2;
        if (r.refeicao === base.refeicao) pontos += 1;
        pontos += 0.5 * r.dieta.filter(function (d) { return base.dieta.indexOf(d) !== -1; }).length;
        return { receita: r, pontos: pontos };
      })
      .sort(function (a, b) { return b.pontos - a.pontos; })
      .slice(0, 4)
      .map(function (x) { return x.receita; });
  }

  function htmlCartao(r) {
    return '<article class="recipe-card">' +
             '<div class="recipe-card__media tint-' + r.tom + '" aria-hidden="true">' + r.icone + '</div>' +
             '<div class="recipe-card__body">' +
               '<span class="recipe-card__category">' + esc(nomeDe('refeicao', r.refeicao)) + '</span>' +
               '<h3 class="recipe-card__title"><a href="receita.html?id=' + r.id + '">' + esc(r.titulo) + '</a></h3>' +
               '<div class="meta">' +
                 '<span>' + formatarTempo(r.tempo) + '</span>' +
                 '<span>' + esc(nomeDe('dificuldade', r.dificuldade)) + '</span>' +
                 '<span>' + esc(nomeDe('pais', r.pais)) + '</span>' +
               '</div>' +
             '</div>' +
           '</article>';
  }

  function renderRelacionadas() {
    $('#relacionadas-grelha').innerHTML = relacionadas().map(htmlCartao).join('');
  }


  /* =======================================================
     8. BOTÕES: FAVORITOS, IMPRIMIR, PARTILHAR
     ======================================================= */

  // --- Favoritos ---
  // Toda a lógica está no panlab-favoritos.js. Aqui só dizemos ao botão de que receita é;
  // o panlab-favoritos.js trata dos cliques, do coração e das mensagens.
  function ligarFavorito() {
    var botao = $('#btn-guardar');
    botao.setAttribute('data-fav', base.id);
    botao.setAttribute('data-fav-titulo', base.titulo);
    if (window.Favoritos) Favoritos.sincronizar();
  }

  // --- Partilhar ---
  function enderecoDaReceita() { return location.href.split('#')[0]; }

  function copiarLink() {
    var url = enderecoDaReceita();
    function alternativa() {
      var campo = document.createElement('textarea');
      campo.value = url;
      campo.setAttribute('readonly', '');
      campo.style.position = 'fixed';
      campo.style.opacity = '0';
      document.body.appendChild(campo);
      campo.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(campo);
      aviso(ok ? PL.t('Link copiado.') : PL.t('Não foi possível copiar o link.'));
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { aviso(PL.t('Link copiado.')); }, alternativa);
    } else {
      alternativa();
    }
  }

  function fecharMenuPartilha() {
    $('#menu-partilhar').hidden = true;
    $('#btn-partilhar').setAttribute('aria-expanded', 'false');
  }

  function partilhar() {
    var url = enderecoDaReceita();
    // Telemóveis e alguns computadores têm a janela de partilha do sistema
    if (navigator.share) {
      navigator.share({ title: base.titulo, text: base.titulo + ' | Pan Lab', url: url }).catch(function () {
        /* o utilizador cancelou: não fazemos nada */
      });
      return;
    }
    // Caso contrário, abre o menu
    var menu = $('#menu-partilhar');
    var abrir = menu.hidden;
    menu.hidden = !abrir;
    $('#btn-partilhar').setAttribute('aria-expanded', abrir ? 'true' : 'false');
  }

  function ligarBotoes() {
    var url = enderecoDaReceita();
    $('#partilhar-whatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(base.titulo + ' ' + url);
    $('#partilhar-email').href = 'mailto:?subject=' + encodeURIComponent(base.titulo) +
                                 '&body=' + encodeURIComponent(PL.t('Vê esta receita:') + ' ' + url);

    $('#btn-imprimir').addEventListener('click', function () { window.print(); });
    $('#btn-partilhar').addEventListener('click', partilhar);
    $('#partilhar-copiar').addEventListener('click', function () { copiarLink(); fecharMenuPartilha(); });
    $('#partilhar-whatsapp').addEventListener('click', fecharMenuPartilha);
    $('#partilhar-email').addEventListener('click', fecharMenuPartilha);

    // Fecha o menu ao clicar fora ou ao carregar em Esc
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.share')) fecharMenuPartilha();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#menu-partilhar').hidden) {
        fecharMenuPartilha();
        $('#btn-partilhar').focus();
      }
    });

    ligarFavorito();
  }


  /* =======================================================
     9. ARRANQUE
     ======================================================= */
  if (!base) {
    document.title = PL.t('Receita não encontrada') + ' | Pan Lab';
    $('#erro').hidden = false;
    return;
  }

  $('#receita').hidden = false;
  renderTopo();
  renderGaleria();

  // Se existir a foto real da receita, passa a ser a primeira imagem da galeria
  if (window.PanLabFotos) {
    PanLabFotos.sonda(base.id, base.titulo, function (item) {
      galeria = [item];
      mostrarImagem(0);
    });
  }
  ligarBotoes();
  renderRelacionadas();

  if (det) {
    ligarIngredientes();
    renderPassos();
    renderDicas();
    if (det.nutricao) renderNutricao(); else $('#nutricao').hidden = true; // a nutrição é opcional
    $('#sem-detalhes').hidden = true;
  } else {
    // Receita sem conteúdo completo: esconde as secções vazias e mostra o aviso
    ['#corpo', '#dicas', '#nutricao', '#atalhos'].forEach(function (s) { $(s).hidden = true; });
    $('#sem-detalhes').hidden = false;
  }

})();
