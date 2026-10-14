/* =========================================================
   PAN LAB - panlab-i18n.js
   Motor de idiomas do site. Carrega ANTES dos outros scripts.

   COMO FUNCIONA
   - O português (pt-PT) é o texto que está escrito nas páginas e nos scripts.
   - Para outro idioma, este ficheiro carrega o dicionário panlab-lang-XX.js
     (en, es, fr, de, it) e troca os textos. Se faltar uma tradução, aparece o
     texto em português (nunca fica nada em branco).
   - O idioma escolhe-se no seletor do cabeçalho. A escolha fica guardada no
     localStorage ("panlab:idioma") e a página recarrega.
   - Ordem de decisão: ?lang=xx no endereço > escolha guardada > idioma do
     browser > inglês (se o browser estiver noutro idioma não suportado).

   NAS PÁGINAS (HTML)
   - data-i18n                 o conteúdo do elemento é traduzido
   - data-i18n-attr="a,b"      os atributos a, b (aria-label, placeholder...) são traduzidos
   - A chave é o próprio texto em português (sem espaços a mais).

   NOS SCRIPTS
   - PL.t('Texto em português {x}', { x: 3 })    texto simples
   - PL.n('{n} receita|{n} receitas', n)          singular | plural
   - PL.tempo(75)  ->  "1 h 15 min"               PL.num(1.5)  ->  "1,5" ou "1.5"

   PARA ACRESCENTAR UM IDIOMA
   1. Copia panlab-lang-en.js para panlab-lang-XX.js e traduz os valores.
   2. Acrescenta o código em IDIOMAS (abaixo) e uma <option> no seletor.
   ========================================================= */
(function () {
  'use strict';

  var IDIOMAS = ['pt-PT', 'en', 'es', 'fr', 'de', 'it'];
  var CHAVE = 'panlab:idioma';

  function normalizar(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  // Converte "pt", "pt-BR", "en-GB"... num dos idiomas suportados (ou null)
  function suportado(codigo) {
    if (!codigo) return null;
    var c = String(codigo).toLowerCase();
    if (c.indexOf('pt') === 0) return 'pt-PT';
    for (var i = 1; i < IDIOMAS.length; i++) {
      if (c === IDIOMAS[i] || c.indexOf(IDIOMAS[i] + '-') === 0) return IDIOMAS[i];
    }
    return null;
  }

  function lerGuardado() {
    try { return suportado(localStorage.getItem(CHAVE)); } catch (e) { return null; }
  }

  function detetar() {
    try {
      var q = suportado(new URLSearchParams(location.search).get('lang'));
      if (q) return q;
    } catch (e) { /* sem URLSearchParams: ignora */ }
    var g = lerGuardado();
    if (g) return g;
    var lista = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < lista.length; i++) {
      var s = suportado(lista[i]);
      if (s) return s;
    }
    return 'en'; // idioma do browser não suportado: inglês
  }

  var lang = detetar();
  var curto = lang === 'pt-PT' ? 'pt' : lang;

  var PL = {
    lang: lang,
    curto: curto,
    ui: {},          // textos (a chave é o texto em português)
    grupos: null,    // nomes das categorias
    receitas: null,  // receitas traduzidas
    unidades: {},    // unidades dos ingredientes
    lig: null,       // como ligar a unidade ao ingrediente ("de ...")
    decimal: ',',
    registar: function (k, dados) {
      if (k !== curto) return;
      PL.ui = dados.ui || {};
      PL.grupos = dados.grupos || null;
      PL.receitas = dados.receitas || null;
      PL.unidades = dados.unidades || {};
      PL.lig = dados.lig || null;
      if (dados.decimal) PL.decimal = dados.decimal;
    }
  };
  window.PL = PL;

  // Carrega o dicionário do idioma escolhido (síncrono: fica pronto antes dos outros scripts)
  if (curto !== 'pt') {
    document.write('<script src="panlab-lang-' + curto + '.js"><\/script>');
  }
  document.documentElement.lang = lang;


  /* =======================================================
     TEXTOS
     ======================================================= */
  PL.t = function (pt, params) {
    var v = PL.ui[pt];
    if (v === undefined) v = pt;
    if (params) {
      v = v.replace(/\{(\w+)\}/g, function (m, k) { return params[k] !== undefined ? params[k] : m; });
    }
    return v;
  };

  // Singular | plural. O francês trata 0 e 1 como singular.
  PL.n = function (pt, n, params) {
    var v = PL.ui[pt];
    if (v === undefined) v = pt;
    var partes = v.split('|');
    var singular = curto === 'fr' ? n < 2 : n === 1;
    var texto = (singular || partes.length < 2) ? partes[0] : partes[1];
    var p = params || {};
    return texto.replace(/\{(\w+)\}/g, function (m, k) {
      if (k === 'n') return n;
      return p[k] !== undefined ? p[k] : m;
    });
  };

  // Procura a tradução de um texto das páginas. Além do dicionário, sabe traduzir
  // sozinha tempos ("1 h 30 min") e contagens ("18 receitas").
  PL.buscar = function (chave) {
    var v = PL.ui[chave];
    if (v !== undefined) return v;
    var m = /^(\d+) receitas?$/.exec(chave);
    if (m) return PL.n('{n} receita|{n} receitas', parseInt(m[1], 10));
    m = /^(?:(\d+) h)?(?: ?(\d+) min)?$/.exec(chave);
    if (m && chave) return PL.tempo((parseInt(m[1], 10) || 0) * 60 + (parseInt(m[2], 10) || 0));
    return undefined;
  };

  // 75 -> "1 h 15 min"
  PL.tempo = function (minutos) {
    if (minutos < 60) return PL.t('{m} min', { m: minutos });
    var h = Math.floor(minutos / 60);
    var m = minutos % 60;
    return m ? PL.t('{h} h {m} min', { h: h, m: m }) : PL.t('{h} h', { h: h });
  };

  // 1.5 -> "1,5" (ou "1.5" em inglês)
  PL.num = function (n) { return String(n).replace('.', PL.decimal); };

  // Junta a unidade ao nome (a função lig do idioma decide): "de azeite" (pt, es), "d’huile" (fr), "di olio" (it) ou só "azeite" (en, de)
  PL.ligar = function (nome, unidade) { return PL.lig ? PL.lig(nome, unidade) : 'de ' + nome; };

  PL.ordenar = function (a, b) { return a.localeCompare(b, lang); };


  /* =======================================================
     DADOS: categorias e receitas
     (chamado por panlab-dados.js e panlab-receitas.js)
     ======================================================= */
  PL.traduzirGrupos = function (GRUPOS) {
    var T = PL.grupos;
    if (!T) return;
    GRUPOS.forEach(function (g) {
      var tg = T[g.id];
      if (!tg) return;
      if (tg.nome) g.nome = tg.nome;
      if (tg.descricao) g.descricao = tg.descricao;
      g.itens.forEach(function (it) {
        var ti = tg.itens && tg.itens[it.id];
        if (!ti) return;
        if (typeof ti === 'string') { it.nome = ti; return; }
        if (ti.nome) it.nome = ti.nome;
        if (ti.detalhe) it.detalhe = ti.detalhe;
      });
    });
  };

  PL.traduzirReceitas = function (BASE) {
    var T = PL.receitas;
    if (!T) return;
    var U = PL.unidades;
    BASE.forEach(function (r) {
      var o = T[r.id];
      if (!o) { if (window.console) console.warn('Pan Lab: falta a tradução da receita ' + r.id); return; }
      if (o.t) r.titulo = o.t;
      if (o.d) r.descricao = o.d;
      if (o.pn) r.porcaoNome = o.pn;
      if (o.a) {
        if (r.imagem && o.a[0]) r.imagem.alt = o.a[0];
        (r.galeria || []).forEach(function (gi, n) { if (o.a[n]) gi.alt = o.a[n]; });
      }
      (r.ingredientes || []).forEach(function (grupo, gi) {
        var og = o.i && o.i[gi];
        if (!og) return;
        if (og[0] && grupo.titulo) grupo.titulo = og[0];
        grupo.itens.forEach(function (ing, ii) {
          var oi = og[1][ii];
          if (oi === undefined) return;
          // unidade traduzida (a não ser que a tradução do ingrediente a defina)
          if (ing.u && U[ing.u] !== undefined) ing.u = U[ing.u];
          if (ing.up && U[ing.up] !== undefined) ing.up = U[ing.up];
          if (typeof oi === 'string') { ing.n = oi; delete ing.ns; }
          else if (Array.isArray(oi)) { ing.n = oi[0]; if (oi[1]) ing.ns = oi[1]; else delete ing.ns; }
          else {
            ing.n = oi.n;
            if (oi.ns) ing.ns = oi.ns; else delete ing.ns;
            if (oi.u !== undefined) ing.u = oi.u;
            if (oi.up !== undefined) ing.up = oi.up;
          }
        });
      });
      (r.passos || []).forEach(function (p, n) {
        var op = o.p && o.p[n];
        if (op) { p.t = op[0]; p.x = op[1]; }
      });
      (r.dicas || []).forEach(function (d, n) {
        var od = o.s && o.s[n];
        if (od) { d.t = od[0]; d.x = od[1]; }
      });
    });
  };


  /* =======================================================
     DADOS DO SITE (panlab-config.js)
     Troca os espaços [entre parênteses retos] pelos dados reais, em todos
     os idiomas, para os preencheres num só sítio.
     ======================================================= */
  function substituirDados() {
    var c = window.PANLAB_CONFIG;
    if (!c) return;
    var mapa = {
      '[email-de-contacto]': c.email,
      '[nome do responsável / entidade]': c.responsavel,
      '[morada]': c.morada,
      '[número de identificação fiscal]': c.nif,
      '[nome do prestador de alojamento]': c.alojamento,
      '[país / Espaço Económico Europeu]': c.paisAlojamento
    };
    var ativos = Object.keys(mapa).filter(function (k) { return mapa[k]; });
    if (!ativos.length) return;
    function trocar(texto) {
      ativos.forEach(function (k) { texto = texto.split(k).join(mapa[k]); });
      return texto;
    }
    var caminho = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var nos = [];
    while (caminho.nextNode()) {
      if (caminho.currentNode.nodeValue.indexOf('[') !== -1) nos.push(caminho.currentNode);
    }
    nos.forEach(function (n) { n.nodeValue = trocar(n.nodeValue); });
    // Ligações mailto:[email-de-contacto]
    var hrefs = document.querySelectorAll('a[href*="["], a[href*="%5B"]');
    for (var i = 0; i < hrefs.length; i++) {
      var h = decodeURIComponent(hrefs[i].getAttribute('href'));
      hrefs[i].setAttribute('href', trocar(h));
    }
  }


  /* =======================================================
     PÁGINA: troca os textos marcados e liga o seletor
     ======================================================= */
  function traduzirPagina() {
    if (PL.aplicado) return;
    PL.aplicado = true;
    if (curto !== 'pt') {
      var marcados = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < marcados.length; i++) {
        var el = marcados[i];
        var v = PL.buscar(normalizar(el.textContent));
        if (v !== undefined) el.innerHTML = v;
      }
      var comAttr = document.querySelectorAll('[data-i18n-attr]');
      for (var j = 0; j < comAttr.length; j++) {
        var e2 = comAttr[j];
        e2.getAttribute('data-i18n-attr').split(',').forEach(function (a) {
          var t = PL.buscar(normalizar(e2.getAttribute(a) || ''));
          if (t !== undefined) e2.setAttribute(a, t);
        });
      }
      var tit = PL.buscar(normalizar(document.title));
      if (tit !== undefined) document.title = tit;
      var meta = document.querySelector('meta[name="description"]');
      if (meta) {
        var d = PL.buscar(normalizar(meta.getAttribute('content') || ''));
        if (d !== undefined) meta.setAttribute('content', d);
      }
      // Aviso nas páginas legais (o texto completo só existe em português)
      var notas = document.querySelectorAll('[data-i18n-nota]');
      for (var k = 0; k < notas.length; k++) {
        var tn = PL.buscar(normalizar(notas[k].textContent));
        if (tn !== undefined) notas[k].textContent = tn;
        notas[k].hidden = false;
      }
    }

    substituirDados();

    var seletor = document.getElementById('idioma');
    if (seletor) {
      seletor.value = lang;
      seletor.addEventListener('change', function () {
        var novo = suportado(seletor.value);
        if (!novo) return;
        try { localStorage.setItem(CHAVE, novo); } catch (e) { /* sem armazenamento: usa só o endereço */ }
        var url = new URL(location.href);
        url.searchParams.delete('lang');
        // Se o browser não deixar guardar, passa o idioma no endereço
        if (lerGuardado() !== novo) url.searchParams.set('lang', novo);
        location.href = url.toString();
      });
    }
  }
  PL.aplicar = traduzirPagina;

  // O dicionário (panlab-lang-XX.js) chama PL.aplicar() assim que carrega, ainda antes dos outros
  // scripts da página. Em português não há dicionário: aplica já (só liga o seletor).
  PL.aplicado = false;
  if (curto === 'pt') { traduzirPagina(); }
  // Rede de segurança: se o dicionário não carregar, o seletor funciona na mesma
  document.addEventListener('DOMContentLoaded', function () {
    if (!PL.aplicado) traduzirPagina();
  });
})();
