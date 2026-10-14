/* =========================================================
   PAN LAB - panlab-favoritos.js
   Sistema de favoritos, partilhado por TODAS as páginas.
   Guarda os favoritos no localStorage do browser: não precisa de conta,
   e continuam guardados depois de fechar o browser (no mesmo dispositivo
   e no mesmo browser).

   COMO FUNCIONA
   1. Os favoritos são uma lista de ids de receitas, guardada no
      localStorage com a chave "panlab:favoritos". Ex.: ["tiramisu","gazpacho"]
   2. Qualquer elemento com o atributo  data-fav="id-da-receita"  passa a ser
      um botão de favorito: ao clicar, a receita é guardada ou removida, e o
      botão muda de estado (coração vazio / coração preenchido).
   3. Os cartões de receita das páginas (.recipe-card, .recipe-row, .feature)
      recebem um botão de coração automaticamente. Isto também funciona nos
      cartões que o JavaScript desenha mais tarde (pesquisa, categorias...).
   4. O número no menu ("Favoritos 3") atualiza-se sozinho, e também quando
      alteras favoritos noutro separador do browser.

   PARA USAR NUMA PÁGINA NOVA
       <script src="panlab-favoritos.js"></script>        (no fim do <body>)
   e, se quiseres um botão teu:
       <button type="button" data-fav="tiramisu" data-fav-titulo="Tiramisù">...</button>
   Se o botão tiver dentro um elemento com  data-fav-texto , o texto dele muda
   entre "Adicionar aos favoritos" e "Remover dos favoritos".

   FUNÇÕES DISPONÍVEIS (objeto global Favoritos)
   - Favoritos.ids()              lista de ids guardados (do mais antigo ao mais recente)
   - Favoritos.tem(id)            true / false
   - Favoritos.adicionar(id)      true se guardou
   - Favoritos.remover(id)        true se guardou a alteração
   - Favoritos.alternar(id)       { ok, ativo }
   - Favoritos.contar()           quantos favoritos
   - Favoritos.limparTudo()
   - Favoritos.manterApenas(fn)   remove os ids para os quais fn(id) é falso
   - Favoritos.aoAlterar(fn)      chama fn(ids) sempre que a lista muda
   - Favoritos.sincronizar()      volta a atualizar todos os botões da página
   - Favoritos.aviso(texto, acao) mostra uma mensagem curta em baixo

   ÍNDICE
   1. Guardar e ler (localStorage)
   2. Operações (adicionar, remover, alternar...)
   3. Atualizar os botões e o número no menu
   4. Mensagens curtas (toast)
   5. Cartões: botão de coração automático
   6. Cliques e arranque
   ========================================================= */
(function () {
  'use strict';

  var CHAVE = 'panlab:favoritos';
  var ID_VALIDO = /^[a-z0-9-]{1,80}$/;
  var ouvintes = [];


  /* =======================================================
     1. GUARDAR E LER (localStorage)
     Tudo dentro de try/catch: o browser pode bloquear o
     armazenamento (por exemplo em separadores privados).
     ======================================================= */
  function lerLista() {
    try {
      // Migração única: quem usou a versão antiga ("tacho:favoritos") não perde a lista
      if (localStorage.getItem(CHAVE) === null && localStorage.getItem('tacho:favoritos') !== null) {
        localStorage.setItem(CHAVE, localStorage.getItem('tacho:favoritos'));
        localStorage.removeItem('tacho:favoritos');
      }
      var bruta = JSON.parse(localStorage.getItem(CHAVE));
      if (!Array.isArray(bruta)) return [];
      var vistos = {};
      // Só aceita ids bem formados e sem repetições (e no máximo 500, para a lista
      // nunca crescer sem controlo, mesmo que alguém altere o localStorage à mão)
      return bruta.slice(0, 500).filter(function (id) {
        if (typeof id !== 'string' || !ID_VALIDO.test(id) || vistos[id]) return false;
        vistos[id] = true;
        return true;
      });
    } catch (e) {
      return [];
    }
  }

  function guardarLista(lista) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
      return true;
    } catch (e) {
      return false;
    }
  }


  /* =======================================================
     2. OPERAÇÕES
     ======================================================= */
  function ids() { return lerLista(); }
  function tem(id) { return lerLista().indexOf(id) !== -1; }
  function contar() { return lerLista().length; }

  // Depois de cada alteração: atualiza a página e avisa quem estiver à escuta
  function notificar() {
    sincronizar(document);
    var lista = lerLista();
    ouvintes.forEach(function (fn) { fn(lista); });
  }

  function adicionar(id) {
    if (!ID_VALIDO.test(id)) return false;
    var lista = lerLista();
    if (lista.indexOf(id) === -1) lista.push(id);
    if (!guardarLista(lista)) return false;
    notificar();
    return true;
  }

  function remover(id) {
    var lista = lerLista().filter(function (x) { return x !== id; });
    if (!guardarLista(lista)) return false;
    notificar();
    return true;
  }

  function alternar(id) {
    var ativo = !tem(id);
    var ok = ativo ? adicionar(id) : remover(id);
    return { ok: ok, ativo: ok ? ativo : !ativo };
  }

  function limparTudo() {
    if (!guardarLista([])) return false;
    notificar();
    return true;
  }

  // Remove ids que já não existem (ex.: receitas apagadas do site)
  function manterApenas(fn) {
    var lista = lerLista();
    var boa = lista.filter(fn);
    if (boa.length !== lista.length && guardarLista(boa)) notificar();
  }

  function aoAlterar(fn) { ouvintes.push(fn); }


  /* =======================================================
     3. ATUALIZAR OS BOTÕES E O NÚMERO NO MENU
     ======================================================= */
  function sincronizar(raiz) {
    raiz = raiz || document;
    var lista = lerLista();
    var guardados = {};
    lista.forEach(function (id) { guardados[id] = true; });

    raiz.querySelectorAll('[data-fav]').forEach(function (el) {
      var id = el.getAttribute('data-fav');
      var ativo = !!guardados[id];
      var titulo = el.getAttribute('data-fav-titulo');
      var texto = ativo ? PL.t('Remover dos favoritos') : PL.t('Adicionar aos favoritos');

      el.setAttribute('data-ativo', ativo ? 'true' : 'false');

      var rotulo = el.querySelector('[data-fav-texto]');
      if (rotulo) {
        // Botão com texto visível: o texto diz o que o clique vai fazer
        if (rotulo.textContent !== texto) rotulo.textContent = texto;
      } else {
        // Botão só com ícone: o nome acessível diz a ação e a receita
        var nome = titulo
          ? (ativo ? PL.t('Remover {titulo} dos favoritos', { titulo: titulo }) : PL.t('Adicionar {titulo} aos favoritos', { titulo: titulo }))
          : texto;
        el.setAttribute('aria-label', nome);
        el.setAttribute('title', texto);
      }
    });

    // Número ao lado de "Favoritos" no menu
    document.querySelectorAll('[data-fav-count]').forEach(function (el) {
      var n = lista.length;
      var texto = n > 99 ? '99+' : String(n);
      if (el.textContent !== texto) el.textContent = texto;
      el.hidden = n === 0;
      var ligacao = el.closest('a');
      if (ligacao) {
        ligacao.setAttribute('aria-label', n ? PL.t('Favoritos') + ', ' + PL.n('{n} receita guardada|{n} receitas guardadas', n) : PL.t('Favoritos'));
      }
    });
  }


  /* =======================================================
     4. MENSAGENS CURTAS (TOAST)
     Uma região fixa em baixo, anunciada pelos leitores de ecrã.
     "acao" é opcional: { texto, href } para um link ou { texto, fn } para
     um botão (usado no "Anular").
     ======================================================= */
  var regiao = null;
  var temporizador = null;

  function criarRegiao() {
    if (regiao) return regiao;
    regiao = document.createElement('div');
    regiao.className = 'toast-region';
    regiao.setAttribute('role', 'status');
    regiao.setAttribute('aria-live', 'polite');
    document.body.appendChild(regiao);
    return regiao;
  }

  function aviso(texto, acao) {
    var r = criarRegiao();
    r.textContent = '';

    var caixa = document.createElement('p');
    caixa.className = 'toast toast--acao';

    var span = document.createElement('span');
    span.textContent = texto;
    caixa.appendChild(span);

    if (acao) {
      var el = document.createElement(acao.href ? 'a' : 'button');
      el.className = 'toast__acao';
      el.textContent = acao.texto;
      if (acao.href) {
        el.href = acao.href;
      } else {
        el.type = 'button';
        el.addEventListener('click', function () {
          acao.fn();
          r.textContent = '';
        });
      }
      caixa.appendChild(el);
    }

    r.appendChild(caixa);
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { r.textContent = ''; }, acao ? 6000 : 3000);
  }


  /* =======================================================
     5. CARTÕES: BOTÃO DE CORAÇÃO AUTOMÁTICO
     Procura cartões de receita (que tenham um link receita.html?id=...) e
     junta-lhes um botão de coração. Não mexe nos que já o têm.
     ======================================================= */
  var CARTOES = '.recipe-card, .recipe-row, .feature';
  var ICONE_CORACAO =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>' +
    '</svg>';

  function idDoLink(ligacao) {
    try {
      return new URL(ligacao.getAttribute('href'), location.href).searchParams.get('id');
    } catch (e) {
      return null;
    }
  }

  function melhorarCartoes(raiz) {
    (raiz || document).querySelectorAll(CARTOES).forEach(function (cartao) {
      if (cartao.querySelector('[data-fav]')) return;
      var ligacao = cartao.querySelector('a[href*="receita.html?id="]');
      if (!ligacao) return;
      var id = idDoLink(ligacao);
      if (!id || !ID_VALIDO.test(id)) return;

      var botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'fav-btn';
      botao.setAttribute('data-fav', id);
      botao.setAttribute('data-fav-titulo', ligacao.textContent.trim());
      botao.innerHTML = ICONE_CORACAO;

      cartao.classList.add('has-fav');
      cartao.appendChild(botao);
    });
  }


  /* =======================================================
     6. CLIQUES E ARRANQUE
     ======================================================= */

  // Um só "ouvinte" para todos os botões, mesmo os criados mais tarde
  document.addEventListener('click', function (e) {
    var botao = e.target.closest('[data-fav]');
    if (!botao) return;

    var id = botao.getAttribute('data-fav');
    var titulo = botao.getAttribute('data-fav-titulo');
    var resultado = alternar(id);

    if (!resultado.ok) {
      aviso(PL.t('Não foi possível guardar. O browser pode estar a bloquear o armazenamento do site.'));
      return;
    }

    // Pequena animação do coração (só ao clicar, não ao abrir a página)
    botao.classList.remove('fav-pop');
    if (resultado.ativo) {
      void botao.offsetWidth; // reinicia a animação
      botao.classList.add('fav-pop');
    }

    var nome = titulo ? '«' + titulo + '»' : PL.t('Receita');
    if (resultado.ativo) {
      var naPaginaDeFavoritos = document.body.getAttribute('data-pagina') === 'favoritos';
      aviso(PL.t('{nome} adicionada aos favoritos.', { nome: nome }), naPaginaDeFavoritos ? null : { texto: PL.t('Ver favoritos'), href: 'favoritos.html' });
    } else {
      aviso(PL.t('{nome} removida dos favoritos.', { nome: nome }), { texto: PL.t('Anular'), fn: function () { adicionar(id); } });
    }
  });

  // Alterações feitas noutro separador do browser
  window.addEventListener('storage', function (e) {
    if (e.key === CHAVE || e.key === null) notificar();
  });

  // Cartões desenhados mais tarde pelo JavaScript (pesquisa, categorias, relacionadas...)
  var pendente = false;
  function observarPagina() {
    if (!('MutationObserver' in window)) return;
    new MutationObserver(function () {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(function () {
        pendente = false;
        melhorarCartoes(document);
        sincronizar(document);
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  function iniciar() {
    melhorarCartoes(document);
    sincronizar(document);
    observarPagina();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  window.Favoritos = {
    ids: ids, tem: tem, adicionar: adicionar, remover: remover, alternar: alternar,
    contar: contar, limparTudo: limparTudo, manterApenas: manterApenas,
    aoAlterar: aoAlterar, sincronizar: sincronizar, aviso: aviso
  };

})();
