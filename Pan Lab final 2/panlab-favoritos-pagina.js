/* =========================================================
   PAN LAB - panlab-favoritos-pagina.js
   Lógica da página favoritos.html: mostra as receitas que o
   utilizador guardou (a lista vem do panlab-favoritos.js / localStorage).

   Precisa destes ficheiros carregados antes (ver favoritos.html):
   - panlab-dados.js      as categorias (GRUPOS)
   - panlab-receitas.js   as receitas (RECEITAS)
   - panlab-favoritos.js  o sistema de favoritos (objeto Favoritos)

   O botão de coração de cada cartão é juntado automaticamente pelo
   panlab-favoritos.js. Quando se remove uma receita, a lista redesenha-se sozinha.

   ÍNDICE
   1. Preparação
   2. Desenhar a página
   3. Eventos e arranque
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* =======================================================
     1. PREPARAÇÃO
     ======================================================= */
  function $(seletor) { return document.querySelector(seletor); }

  function esc(texto) {
    return String(texto).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // 75 -> "1 h 15 min"
  function formatarTempo(minutos) {
    return PL.tempo(minutos); // 75 -> "1 h 15 min" (muda com o idioma)
  }

  // Pesquisa rápida: nomeDe('pais', 'italiana') -> 'Italiana'
  var itemDe = {};
  GRUPOS.forEach(function (g) {
    itemDe[g.id] = {};
    g.itens.forEach(function (it) { itemDe[g.id][it.id] = it; });
  });
  function nomeDe(grupoId, itemId) {
    return itemDe[grupoId] && itemDe[grupoId][itemId] ? itemDe[grupoId][itemId].nome : '';
  }

  function receitaPorId(id) {
    return RECEITAS.find(function (r) { return r.id === id; }) || null;
  }

  var elGrelha = $('#grelha');
  var elVazio = $('#vazio');
  var elContagem = $('#contagem');
  var elLimpar = $('#limpar-tudo');
  var elCabecalhoLista = $('#cabecalho-lista');


  /* =======================================================
     2. DESENHAR A PÁGINA
     ======================================================= */

  // HTML de um cartão (as mesmas classes dos cartões do resto do site)
  function htmlCartao(r) {
    return '' +
      '<article class="recipe-card">' +
        '<div class="recipe-card__media tint-' + esc(r.tom) + '" aria-hidden="true">' + r.icone + '</div>' +
        '<div class="recipe-card__body">' +
          '<span class="recipe-card__category">' + esc(nomeDe('refeicao', r.refeicao)) + '</span>' +
          '<h3 class="recipe-card__title"><a href="receita.html?id=' + encodeURIComponent(r.id) + '">' + esc(r.titulo) + '</a></h3>' +
          '<div class="meta">' +
            '<span>' + formatarTempo(r.tempo) + '</span>' +
            '<span>' + esc(nomeDe('dificuldade', r.dificuldade)) + '</span>' +
            '<span>' + esc(nomeDe('pais', r.pais)) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function desenhar() {
    // Mais recentes primeiro (a lista guarda-se pela ordem em que foram adicionadas)
    var receitas = Favoritos.ids().reverse().map(receitaPorId).filter(Boolean);
    var n = receitas.length;

    elGrelha.innerHTML = receitas.map(htmlCartao).join('');
    elGrelha.hidden = n === 0;
    elVazio.hidden = n !== 0;
    elCabecalhoLista.hidden = n === 0;
    elLimpar.hidden = n === 0;
    elContagem.textContent = PL.n('{n} receita guardada|{n} receitas guardadas', n);
    document.title = (n ? PL.t('Favoritos') + ' (' + n + ')' : PL.t('Favoritos')) + ' | Pan Lab';
  }


  /* =======================================================
     3. EVENTOS E ARRANQUE
     ======================================================= */
  elLimpar.addEventListener('click', function () {
    var n = Favoritos.contar();
    if (!n) return;
    var pergunta = PL.n('Remover a receita guardada dos favoritos?|Remover as {n} receitas guardadas dos favoritos?', n);
    if (window.confirm(pergunta)) Favoritos.limparTudo();
  });

  // Redesenha sempre que a lista muda (aqui, ou noutro separador do browser)
  Favoritos.aoAlterar(desenhar);

  // Ids que já não existem no site são limpos antes do primeiro desenho
  Favoritos.manterApenas(function (id) { return !!receitaPorId(id); });
  desenhar();

})();
