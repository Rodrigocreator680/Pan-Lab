/* PAN LAB - panlab-fotos.js
   Fotos das receitas (Unsplash). Ordem de procura de cada foto:
     1) ficheiro local imagens/<id-da-receita>.jpg (se o descarregaste, o site fica 100% independente);
     2) o CDN do Unsplash (images.unsplash.com), que é o método recomendado pelo Unsplash;
     3) o emoji da receita, se nenhum dos anteriores existir: nada parte.
   Para acrescentar uma foto: acrescenta uma linha em FOTOS
   (f = código da foto no Unsplash, n = nome do fotógrafo, u = utilizador no Unsplash). */
(function () {
  'use strict';

  var FOTOS = {
  "acai-na-tigela": {
    "f": "photo-1654923064926-be7e64267a31",
    "n": "Eiliv Aceron",
    "u": "shootdelicious"
  },
  "affogato": {
    "f": "photo-1598268121084-c8f7126e0cef",
    "n": "SLNC",
    "u": "riverse"
  },
  "agua-fresca-de-melancia": {
    "f": "photo-1527661591475-527312dd65f5",
    "n": "ShengGeng Lin",
    "u": "dibaglin"
  },
  "arroz-de-pato-no-forno": {
    "f": "photo-1749640566096-5d8098d452b4",
    "n": "Chan Yong Sheng",
    "u": "chanys1999"
  },
  "arroz-de-tomate": {
    "f": "photo-1665332195309-9d75071138f0",
    "n": "Keesha's Kitchen",
    "u": "keeshasskitchen"
  },
  "arroz-doce": {
    "f": "photo-1665529545347-8eac2abf7f41",
    "n": "Wil Carranza",
    "u": "wilcrza"
  },
  "bacalhau-a-bras": {
    "f": "photo-1764333580731-0465788362c1",
    "n": "David Magalhães",
    "u": "speeddragon35"
  },
  "bacalhau-com-natas": {
    "f": "photo-1764333580740-b327847301b1",
    "n": "David Magalhães",
    "u": "speeddragon35"
  },
  "bifanas": {
    "f": "photo-1650525121862-8336b2a96e7f",
    "n": "Llio Angharad",
    "u": "llioangharad"
  },
  "biryani-de-frango": {
    "f": "photo-1631515243349-e0cb75fb8d3a",
    "n": "Mario Raj",
    "u": "chefmariii"
  },
  "bolo-de-bolacha": {
    "f": "photo-1571115177098-24ec42ed204d",
    "n": "Anthony Espinosa",
    "u": "thony_espi"
  },
  "bolo-de-cenoura-com-chocolate": {
    "f": "photo-1622419015886-5e773bf6006e",
    "n": "Seb Reivers",
    "u": "sebbiepie"
  },
  "bolo-de-chocolate-humido": {
    "f": "photo-1607257882338-70f7dd2ae344",
    "n": "Ayesha Firdaus",
    "u": "ayeshafirdaus"
  },
  "bolo-de-laranja": {
    "f": "photo-1642069251474-5cc71cfdf49b",
    "n": "Elle inlom",
    "u": "elliethailand64"
  },
  "brigadeiro": {
    "f": "photo-1702982852429-e0d0b27eb990",
    "n": "Felippe Lopes",
    "u": "pires128"
  },
  "broa-de-milho": {
    "f": "photo-1603279126476-93ce8278312c",
    "n": "Rafael Cisneros Méndez",
    "u": "ralppie"
  },
  "bruschetta": {
    "f": "photo-1594978583693-8dfdfc93f052",
    "n": "Mike van den Bos",
    "u": "mike_van_den_bos"
  },
  "burrito-de-feijao": {
    "f": "photo-1731090389603-d63060ee08a6",
    "n": "Snappr",
    "u": "snappr"
  },
  "cacio-e-pepe": {
    "f": "photo-1707274244607-4eb1ee33116c",
    "n": "Inna Safa",
    "u": "innasafa"
  },
  "caldeirada-de-peixe": {
    "f": "photo-1651915850076-f505183fba1b",
    "n": "Marcus Yoshida",
    "u": "x_marcus_x"
  },
  "caldo-verde": {
    "f": "photo-1766375888707-7c918059f64b",
    "n": "Lee Milo",
    "u": "miloleetw"
  },
  "caril-de-grao-e-espinafres": {
    "f": "photo-1536304575888-ccb70eeef59b",
    "n": "Pille R. Priske",
    "u": "pillepriske"
  },
  "chana-masala": {
    "f": "photo-1582576163090-09d3b6f8a969",
    "n": "Daniela",
    "u": "daniela_curly"
  },
  "chilli-con-carne": {
    "f": "photo-1729450412050-6c00ec592e34",
    "n": "Maria Klichik",
    "u": "switchinglanes"
  },
  "chocolate-quente-a-espanhola": {
    "f": "photo-1517578239113-b03992dcdd25",
    "n": "Giancarlo Duarte",
    "u": "giancarloduarte"
  },
  "churros": {
    "f": "photo-1590872809871-8a1602d5842d",
    "n": "Rosy Ko",
    "u": "rosy_"
  },
  "coxinhas": {
    "f": "photo-1740578745201-5e0554ca25f8",
    "n": "Haberdoedas",
    "u": "haberdoedas"
  },
  "crema-catalana": {
    "f": "photo-1615235739538-95040f341ba8",
    "n": "Max Griss",
    "u": "grissphoto"
  },
  "creme-brulee": {
    "f": "photo-1615235739538-95040f341ba8",
    "n": "Max Griss",
    "u": "grissphoto"
  },
  "crepes": {
    "f": "photo-1565087170449-fa23854a6100",
    "n": "Austin P",
    "u": "pqt"
  },
  "croque-monsieur": {
    "f": "photo-1647505794572-0a6d945d664d",
    "n": "Glenn Diaz",
    "u": "glenndiaz"
  },
  "croquetas-de-jamon": {
    "f": "photo-1713517915303-ae3b3429f939",
    "n": "Poul Hoang",
    "u": "poulhoang"
  },
  "dal-de-lentilhas": {
    "f": "photo-1626500154744-e4b394ffea16",
    "n": "VD Photography",
    "u": "vdphotography"
  },
  "enchiladas-de-frango": {
    "f": "photo-1534352956036-cd81e27dd615",
    "n": "Alexandra Golovac",
    "u": "atasteofwellbeing"
  },
  "feijoada-brasileira": {
    "f": "photo-1647545401750-6dd5539879ac",
    "n": "Mikey Frost",
    "u": "frostyfilmsandphoto"
  },
  "focaccia": {
    "f": "photo-1593629718888-9009c55e6cad",
    "n": "Quin Engle",
    "u": "twistsandzests"
  },
  "francesinha": {
    "f": "photo-1700937314577-898450cafe35",
    "n": "Crunch",
    "u": "crunch_london"
  },
  "frango-piri-piri": {
    "f": "photo-1643594462181-7667928d072e",
    "n": "Thembi Johnson",
    "u": "tastytin"
  },
  "frango-teriyaki": {
    "f": "photo-1636401870585-a8852371e84a",
    "n": "Fernando Aguilar",
    "u": "feraguilar"
  },
  "frango-tikka-masala": {
    "f": "photo-1603894584373-5ac82b2ae398",
    "n": "Raman",
    "u": "potofgold07"
  },
  "gambas-al-ajillo": {
    "f": "photo-1625943553852-781c6dd46faa",
    "n": "Farhad Ibrahimzade",
    "u": "ferhadd"
  },
  "gazpacho": {
    "f": "photo-1589187154184-995b8a4e740a",
    "n": "Nadya Filatova",
    "u": "dabyki"
  },
  "gnocchi-de-batata": {
    "f": "photo-1630444098747-2afd213cb945",
    "n": "Lorenzo Rui",
    "u": "lorenzorui"
  },
  "guacamole": {
    "f": "photo-1680992071073-cb1696ba8d3e",
    "n": "Zoshua Colah",
    "u": "zoshuacolah"
  },
  "gyozas": {
    "f": "photo-1496116218417-1a781b1c416c",
    "n": "charlesdeluvio",
    "u": "charlesdeluvio"
  },
  "lasanha-de-carne": {
    "f": "photo-1709429790175-b02bb1b19207",
    "n": "Emanuel Ekström",
    "u": "emanuelekstrom"
  },
  "lassi-de-manga": {
    "f": "photo-1553279768-865429fa0078",
    "n": "Becky Mattson",
    "u": "bombaybecky2019"
  },
  "leite-creme": {
    "f": "photo-1702728109878-c61a98d80491",
    "n": "Felippe Lopes",
    "u": "pires128"
  },
  "matcha-latte": {
    "f": "photo-1515823064-d6e0c04616a7",
    "n": "Jason Leung",
    "u": "ninjason"
  },
  "minestrone": {
    "f": "photo-1611068120813-eca5a8cbf793",
    "n": "Nathan Dumlao",
    "u": "nate_dumlao"
  },
  "moqueca-de-peixe": {
    "f": "photo-1620894580123-466ad3a0ca06",
    "n": "Vinitha V",
    "u": "vinitha_v"
  },
  "mousse-de-chocolate": {
    "f": "photo-1770376696443-336413d581b2",
    "n": "Foodie Flavours",
    "u": "foodieflavours"
  },
  "nachos-com-queijo": {
    "f": "photo-1582169296194-e4d644c48063",
    "n": "Coffeefy Workafe",
    "u": "coffeefyworkafe"
  },
  "omelete-de-espinafres": {
    "f": "photo-1665206231479-6bff0bdcd51d",
    "n": "Anirudh",
    "u": "lanirudhreddy"
  },
  "onigiri": {
    "f": "photo-1603245460565-5a7b42a6a6f4",
    "n": "Bruce Tang",
    "u": "brucetml"
  },
  "paella-valenciana": {
    "f": "photo-1623961990059-28356e226a77",
    "n": "Douglas Lopez",
    "u": "dougglaslopez"
  },
  "palak-paneer": {
    "f": "photo-1589647363585-f4a7d3877b10",
    "n": "Kanwardeep Kaur",
    "u": "kavar05"
  },
  "pan-con-tomate": {
    "f": "photo-1506280754576-f6fa8a873550",
    "n": "Calum Lewis",
    "u": "calumlewis"
  },
  "panna-cotta": {
    "f": "photo-1603236268617-d023914d9416",
    "n": "Alexey Khaneft",
    "u": "akhaneft"
  },
  "panzanella": {
    "f": "photo-1592417817098-8fd3d9eb14a5",
    "n": "Luisa Brimble",
    "u": "luisabrimble"
  },
  "pao-caseiro": {
    "f": "photo-1549931319-a545dcf3bc73",
    "n": "Jude Infantini",
    "u": "judowoodo_"
  },
  "pao-de-queijo": {
    "f": "photo-1559141680-d0bd7bc5af84",
    "n": "rodolfo allen_",
    "u": "rodolfoallen"
  },
  "pao-naan": {
    "f": "photo-1697155406014-04dc649b0953",
    "n": "Rashpal Singh",
    "u": "rashpalsingh"
  },
  "pasteis-de-bacalhau": {
    "f": "photo-1565733618599-cb82f14f34ac",
    "n": "Antonio Mendes",
    "u": "asmendes92"
  },
  "pastel-de-nata": {
    "f": "photo-1698414639176-2fb25b481239",
    "n": "Andy Kennedy",
    "u": "packetdiscards"
  },
  "patatas-bravas": {
    "f": "photo-1565599837634-134bc3aadce8",
    "n": "Nacho Carretero Molero",
    "u": "carreteromolero"
  },
  "penne-arrabbiata": {
    "f": "photo-1621996346565-e3dbc646d9a9",
    "n": "Ben Lei",
    "u": "bleiplays33"
  },
  "pesto-genovese": {
    "f": "photo-1538596313828-41d729090199",
    "n": "Alissa De Leva",
    "u": "alissadeleva"
  },
  "pico-de-gallo": {
    "f": "photo-1572319236705-fef19d70e0c9",
    "n": "Jamie Coupaud",
    "u": "jlcoupaud"
  },
  "pizza-margherita": {
    "f": "photo-1574071318508-1cdbab80d002",
    "n": "Aurélien Lemasson-Théobald",
    "u": "aurel__lens"
  },
  "polvo-a-lagareiro": {
    "f": "photo-1535980156496-87fc2cfcb832",
    "n": "Nikita Tikhomirov",
    "u": "niki_mir"
  },
  "pudim-de-leite": {
    "f": "photo-1702728109878-c61a98d80491",
    "n": "Felippe Lopes",
    "u": "pires128"
  },
  "quesadillas-de-queijo": {
    "f": "photo-1618040996337-56904b7850b9",
    "n": "Lottie Griffiths",
    "u": "lottiegriffiths"
  },
  "quiche-lorraine": {
    "f": "photo-1456014673271-90b7fddf2eea",
    "n": "Timothy Muza",
    "u": "timothymuza"
  },
  "rabanadas": {
    "f": "photo-1595044643502-616eeebbdff3",
    "n": "Crystal Jo",
    "u": "crystalsjo"
  },
  "ramen-caseiro": {
    "f": "photo-1697652974652-a2336106043b",
    "n": "Caleb Wright",
    "u": "calecrunchy"
  },
  "ratatouille": {
    "f": "photo-1572453800999-e8d2d1589b7c",
    "n": "amirali mirhashemian",
    "u": "amir_v_ali"
  },
  "risotto-de-cogumelos": {
    "f": "photo-1633964913295-ceb43826e7c9",
    "n": "Rob Wicks",
    "u": "robwicks"
  },
  "salada-caprese": {
    "f": "photo-1622637103261-ae624e188bd0",
    "n": "Grooveland Designs",
    "u": "groovelanddesigns"
  },
  "salada-de-grao-com-atum": {
    "f": "photo-1697155836261-f7afd5353e64",
    "n": "Rashpal Singh",
    "u": "rashpalsingh"
  },
  "salada-de-polvo": {
    "f": "photo-1731601816614-2423297fe97b",
    "n": "Antonio Araujo",
    "u": "antonioaaaraujo"
  },
  "salada-nicoise": {
    "f": "photo-1578687388049-079580e6eb2d",
    "n": "Fallon Michael",
    "u": "fallonmichaeltx"
  },
  "salmorejo": {
    "f": "photo-1529566186297-155c18f9a434",
    "n": "Sara Dubler",
    "u": "ahungryblonde_"
  },
  "samosas": {
    "f": "photo-1601050690597-df0568f70950",
    "n": "kabir cheema",
    "u": "kabircheema"
  },
  "sardinhas-assadas": {
    "f": "photo-1600699899970-b1c9fadd8f9e",
    "n": "Alex Teixeira",
    "u": "alex_wsul"
  },
  "sopa-de-cebola-gratinada": {
    "f": "photo-1589563766992-49797b1148a2",
    "n": "Leila Issa",
    "u": "leila_myphotography"
  },
  "sopa-de-legumes": {
    "f": "photo-1643786661490-966f1877effa",
    "n": "Elena Leya",
    "u": "foodistika"
  },
  "sopa-de-miso": {
    "f": "photo-1763470260582-894ae15f43bb",
    "n": "note thanun",
    "u": "notethanun"
  },
  "spaghetti-carbonara": {
    "f": "photo-1633337474564-1d9478ca4e2e",
    "n": "Rob Wicks",
    "u": "robwicks"
  },
  "sumo-de-maracuja": {
    "f": "photo-1621248472004-6f966857d368",
    "n": "Lottie Griffiths",
    "u": "lottiegriffiths"
  },
  "sushi-de-salmao": {
    "f": "photo-1617196034738-26c5f7c977ce",
    "n": "Mahmoud Fawzy",
    "u": "mahmoud_fawzy100"
  },
  "tacos-de-frango": {
    "f": "photo-1660180750968-4fbc84789a96",
    "n": "Federico Ramirez",
    "u": "peryco"
  },
  "tarte-de-limao": {
    "f": "photo-1543508185-225c92847541",
    "n": "an_vision",
    "u": "anvision"
  },
  "tarte-de-maca": {
    "f": "photo-1621743478914-cc8a86d7e7b5",
    "n": "Kavya P K",
    "u": "_kavya_p_k_"
  },
  "tarte-tatin": {
    "f": "photo-1624299831638-82c15fcafd2b",
    "n": "Deborah Rainford",
    "u": "debsrainford"
  },
  "tempura-de-legumes": {
    "f": "photo-1666599207746-0868c6a556d2",
    "n": "Yosuke Ota",
    "u": "yosuke_ota"
  },
  "tiramisu": {
    "f": "photo-1724116379273-ba32b70d112c",
    "n": "Gina's Auckland",
    "u": "ginasauckland"
  },
  "torrada-francesa": {
    "f": "photo-1620921575116-fb8902865f81",
    "n": "Vicky Ng",
    "u": "vickyng"
  },
  "tortilha-espanhola": {
    "f": "photo-1607877200978-3cab430e00cd",
    "n": "Carlos Perales",
    "u": "karloswayne"
  },
  "yakisoba": {
    "f": "photo-1680675494363-75bbf9838a09",
    "n": "R Eris",
    "u": "eprayatama"
  }
};
  var PASTA = 'imagens/';
  var UTM = '?utm_source=pan_lab&utm_medium=referral';

  var CDN = 'https://images.unsplash.com/';
  var PARAMS = '?auto=format&fit=max&fm=jpg&q=75&w=1000';

  function caminho(id) { return PASTA + id + '.jpg'; }
  function remoto(id) { return CDN + FOTOS[id].f + PARAMS; }

  /* Tenta o ficheiro local; se falhar tenta o CDN; se falhar também, chama nada(). */
  function carregar(img, id, bom, nada) {
    var fase = 0;
    img.addEventListener('load', function () { if (bom) bom(img.src); });
    img.addEventListener('error', function () {
      if (fase === 0) { fase = 1; img.src = remoto(id); }
      else if (nada) nada();
    });
    img.src = caminho(id);
  }

  /* ---- Cartões de receita (início, pesquisa, categorias, favoritos, relacionadas) ---- */
  function idDoCartao(media) {
    var cartao = media.closest('.recipe-card, .recipe-row');
    var a = cartao && cartao.querySelector('a[href*="receita.html?id="]');
    var m = a && /[?&]id=([^&#"]+)/.exec(a.getAttribute('href'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function melhorarCartoes() {
    document.querySelectorAll('.recipe-card__media:not([data-foto]), .recipe-row__media:not([data-foto])').forEach(function (media) {
      media.setAttribute('data-foto', '1');
      var id = idDoCartao(media);
      if (!id || !FOTOS[id]) return;
      var img = new Image();
      img.className = 'recipe-card__foto';
      img.alt = '';
      img.decoding = 'async';
      media.appendChild(img);
      carregar(img, id, function () { img.classList.add('ok'); }, function () { img.remove(); }); // sem foto: fica o emoji
    });
  }

  var agendado = false;
  function agendar() {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(function () { agendado = false; melhorarCartoes(); });
  }

  function arrancar() {
    melhorarCartoes();
    if (window.MutationObserver) {
      new MutationObserver(agendar).observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();

  /* ---- Página da receita: galeria + crédito ---- */
  function sonda(id, alt, cb) {
    if (!FOTOS[id]) return;
    var im = new Image();
    carregar(im, id, function (src) {
      cb({ src: src, alt: alt, foto: FOTOS[id] });
    }, null); // se tudo falhar, não acontece nada
  }

  function ligacao(texto, href) {
    var a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = texto;
    return a;
  }

  function credito(el, item) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    if (!item || !item.foto) { el.hidden = true; return; }
    var modelo = PL.t('Foto: {autor} / {site}', { autor: '\u0001', site: '\u0002' });
    modelo.split(/(\u0001|\u0002)/).forEach(function (p) {
      if (p === '\u0001') el.appendChild(ligacao(item.foto.n, 'https://unsplash.com/@' + item.foto.u + UTM));
      else if (p === '\u0002') el.appendChild(ligacao('Unsplash', 'https://unsplash.com/' + UTM));
      else if (p) el.appendChild(document.createTextNode(p));
    });
    el.hidden = false;
  }

  /* Elementos [data-foto-id]: <img> ou contentor que recebe um <img> */
  function fotosMarcadas() {
    document.querySelectorAll('[data-foto-id]:not([data-ok])').forEach(function (el) {
      el.setAttribute('data-ok', '1');
      var id = el.getAttribute('data-foto-id');
      if (!FOTOS[id]) return;
      var img = el.tagName === 'IMG' ? el : new Image();
      if (img !== el) { img.alt = ''; el.appendChild(img); }
      img.classList.add('foto-marcada');
      img.decoding = 'async';
      carregar(img, id, function () { img.classList.add('ok'); }, function () { img.remove(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fotosMarcadas);
  else fotosMarcadas();

  window.PanLabFotos = { sonda: sonda, credito: credito };
})();
