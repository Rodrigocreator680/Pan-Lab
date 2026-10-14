/* =========================================================
   PAN LAB - panlab-receitas.js
   Base de dados de receitas completas.
   Cada receita é um objeto dentro da lista BASE_DE_RECEITAS.

   Este é o ÚNICO ficheiro com as receitas do site: tudo sobre cada receita
   num só sítio. Os ids de categorias são os de panlab-dados.js (GRUPOS).
   Em cada página, carrega primeiro panlab-dados.js e depois este ficheiro:
       <script src="panlab-dados.js"></script>
       <script src="panlab-receitas.js"></script>
   O ficheiro cria BASE_DE_RECEITAS (receitas completas) e RECEITAS (resumo,
   gerado a partir da anterior, para cartões e filtros).

   CAMPOS DE CADA RECEITA
   - id            único, sem acentos nem espaços (vai para o endereço)
   - titulo        nome da receita
   - descricao     frase curta
   - categoria     { pais, tipo }  (ids válidos abaixo)
   - alimento      lista de ids do tipo de alimento (pode ser vazia)
   - dieta         lista de ids de dieta (pode ser vazia)
   - imagem        { src, alt }. Hoje é uma ilustração provisória. Para usar uma
                   foto real, troca por { src: 'img/bacalhau.jpg', alt: '...' }
                   ou por um link do Unsplash
   - galeria       (opcional) lista de { emoji, tom, alt } ou { src, alt } com as
                   imagens da página da receita. Sem isto, usa só "imagem"
   - icone, tom    emoji e cor dos cartões sem foto
   - preparacao    minutos
   - cozedura      minutos (0 = sem cozedura)
   - repouso       (opcional) minutos de frio ou descanso, fora dos tempos acima
   - porcoes       número de porções da receita base
   - porcaoNome    (opcional) como chamar à porção. Por defeito "porção"
   - dificuldade   'facil' | 'medio' | 'dificil'
   - ingredientes  lista de grupos { titulo, itens }. Cada ingrediente:
                     q        quantidade (número) ou null para "q.b."
                     u / up   unidade no singular / plural
                     n / ns   nome no plural (ou normal) / nome no singular
                     inteiro  true para o que não se parte (ovos, dentes de alho)
   - passos        lista de { t: título, x: texto }
   - dicas         lista de { t: título, x: texto }
   - nutricao      (opcional) valores ESTIMADOS por porção
                   (calorias em kcal, o resto em gramas)

   IDS VÁLIDOS
   - pais:        portuguesa, italiana, brasileira, japonesa, mexicana,
                  indiana, espanhola, francesa
   - tipo:        pequeno-almoco, entradas, pratos-principais, sobremesas, bebidas
   - alimento:    carne, aves, peixe-e-marisco, massas, arroz, sopas, saladas,
                  vegetariano, vegan
   - dieta:       sem-gluten, sem-lactose, low-carb, fitness, rica-em-proteina
   - dificuldade: facil, medio, dificil

   AVISOS
   - As imagens são ilustrações provisórias geradas aqui mesmo (não dependem
     de nenhum site). Troca-as por fotos tuas ou com licença.
   - Os valores nutricionais são estimativas. Confirma-os antes de publicar.
   - As etiquetas de dieta dependem das marcas usadas. Confirma os rótulos.
   ========================================================= */


/* ---------------------------------------------------------
   IMAGENS PROVISÓRIAS
   Cria uma imagem (SVG) com o emoji da receita sobre uma cor suave.
   Devolve { src, alt } e funciona dentro de um <img src="...">.
   --------------------------------------------------------- */
const COR_DO_TOM = {
  tomato: '#FDE1DC',
  lemon:  '#FCF0BF',
  basil:  '#DAEADB',
  sky:    '#D9E8F2',
  plum:   '#EBDCEB',
  orange: '#FFE0C2'
};

function criarImagem(emoji, tom, alt) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
    '<rect width="800" height="600" fill="' + (COR_DO_TOM[tom] || '#F2F6F0') + '"/>' +
    '<text x="400" y="300" font-size="260" text-anchor="middle" dy=".35em">' + emoji + '</text>' +
    '</svg>';
  return { src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), alt: alt };
}


/* =========================================================
   AS RECEITAS
   ========================================================= */
const BASE_DE_RECEITAS = [

  /* 1. BACALHAU COM NATAS (portuguesa, pratos principais) */
  {
    id: 'bacalhau-com-natas',
    titulo: 'Bacalhau com natas',
    descricao: 'Lascas de bacalhau, batata dourada e cebola doce, cobertas com um molho cremoso e gratinadas no forno.',
    categoria: { pais: 'portuguesa', tipo: 'pratos-principais' },
    alimento: ['peixe-e-marisco'],
    dieta: [],
    imagem: criarImagem('🐟', 'lemon', 'Bacalhau com natas gratinado na travessa'),
    galeria: [
      { emoji: '🐟', tom: 'lemon', alt: 'Bacalhau com natas gratinado na travessa' },
      { emoji: '🥔', tom: 'orange', alt: 'Batata em cubos, dourada' },
      { emoji: '🧅', tom: 'plum', alt: 'Cebola e alho refogados' }
    ],
    icone: '🐟',
    tom: 'lemon',
    preparacao: 30,
    cozedura: 25,
    porcoes: 4,
    dificuldade: 'facil',
    ingredientes: [
      { titulo: 'Bacalhau e base', itens: [
        { q: 600, u: 'g', n: 'bacalhau demolhado, em lombos' },
        { q: 500, u: 'g', n: 'batata' },
        { q: 2, u: '', n: 'cebolas médias', ns: 'cebola média', inteiro: true },
        { q: 2, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite' },
        { q: 1, u: 'folha', up: 'folhas', n: 'louro', inteiro: true },
        { q: null, n: 'óleo para fritar' }
      ]},
      { titulo: 'Molho de natas', itens: [
        { q: 40, u: 'g', n: 'manteiga' },
        { q: 30, u: 'g', n: 'farinha' },
        { q: 500, u: 'ml', n: 'leite' },
        { q: 200, u: 'ml', n: 'natas' },
        { q: null, n: 'noz-moscada' },
        { q: null, n: 'pimenta' }
      ]},
      { titulo: 'Para gratinar', itens: [
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'queijo ralado' },
        { q: null, n: 'salsa picada' }
      ]}
    ],
    passos: [
      { t: 'Cozer o bacalhau',
        x: 'Coloca o bacalhau numa panela com água fria e a folha de louro. Leva ao lume e retira assim que levantar fervura. Tapa e deixa repousar 5 minutos. Escorre, tira as peles e as espinhas e separa o peixe em lascas.' },
      { t: 'Dourar a batata',
        x: 'Corta a batata em cubos pequenos e frita em óleo quente durante 8 a 10 minutos, até ficar dourada. Escorre em papel absorvente e salga ligeiramente.' },
      { t: 'Refogar a cebola',
        x: 'Num tacho, refoga a cebola em meias-luas e o alho picado no azeite, em lume brando, durante 10 minutos, até ficarem macios e sem cor.' },
      { t: 'Fazer o molho',
        x: 'Derrete a manteiga, junta a farinha e mexe durante 1 minuto. Junta o leite aos poucos, sempre a mexer, até engrossar. Acrescenta as natas, a noz-moscada e a pimenta. Prova antes de salgar, porque o bacalhau já traz sal.' },
      { t: 'Montar',
        x: 'Pré-aquece o forno a 200 °C. Mistura o bacalhau, a cebola e a batata e espalha tudo numa travessa. Cobre com o molho.' },
      { t: 'Gratinar',
        x: 'Polvilha com o queijo ralado e leva ao forno 20 a 25 minutos, até gratinar. Serve com salsa picada.' }
    ],
    dicas: [
      { t: 'Demolha bem', x: 'Se demolhares em casa, deixa o bacalhau 48 horas no frigorífico e muda a água 3 a 4 vezes. Podes também comprar já demolhado.' },
      { t: 'Molho sem grumos', x: 'Junta o leite aos poucos, sempre a mexer, à mistura de manteiga e farinha. Se aparecerem grumos, passa a varinha mágica.' },
      { t: 'Cuidado com o sal', x: 'O bacalhau e o queijo já levam sal. Prova o molho no fim e só então corrige.' },
      { t: 'Prepara de véspera', x: 'Podes montar a travessa no dia anterior e gratinar só na altura de servir. Acrescenta uns 10 minutos de forno.' }
    ],
    nutricao: { calorias: 650, proteina: 38, hidratos: 42, acucares: 9, gordura: 34, saturada: 15, fibra: 4, sal: 2.4 }
  },

  /* 2. ARROZ DE PATO NO FORNO (portuguesa, pratos principais) */
  {
    id: 'arroz-de-pato-no-forno',
    titulo: 'Arroz de pato no forno',
    descricao: 'Arroz malandrinho cozido no caldo do pato, com carne desfiada e chouriço, terminado no forno até ficar com uma crosta dourada.',
    categoria: { pais: 'portuguesa', tipo: 'pratos-principais' },
    alimento: ['aves', 'arroz'],
    dieta: ['sem-gluten'],
    imagem: criarImagem('🦆', 'orange', 'Arroz de pato dourado no tabuleiro'),
    galeria: [
      { emoji: '🦆', tom: 'orange', alt: 'Arroz de pato dourado no tabuleiro' },
      { emoji: '🍚', tom: 'lemon', alt: 'Arroz cozido no caldo do pato' },
      { emoji: '🌶️', tom: 'tomato', alt: 'Rodelas de chouriço' }
    ],
    icone: '🦆',
    tom: 'orange',
    preparacao: 20,
    cozedura: 70,
    porcoes: 4,
    dificuldade: 'medio',
    ingredientes: [
      { titulo: 'Para cozer o pato', itens: [
        { q: 4, u: '', n: 'coxas de pato', ns: 'coxa de pato', inteiro: true },
        { q: 1, u: '', n: 'cebolas', ns: 'cebola', inteiro: true },
        { q: 1, u: '', n: 'cenouras', ns: 'cenoura', inteiro: true },
        { q: 3, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: 1, u: 'folha', up: 'folhas', n: 'louro', inteiro: true },
        { q: 1200, u: 'ml', n: 'água' },
        { q: null, n: 'sal' }
      ]},
      { titulo: 'Para o arroz', itens: [
        { q: 300, u: 'g', n: 'arroz carolino' },
        { q: 1, u: '', n: 'cebolas', ns: 'cebola', inteiro: true },
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite' },
        { q: 100, u: 'ml', n: 'vinho branco' },
        { q: 700, u: 'ml', n: 'caldo da cozedura do pato' },
        { q: 120, u: 'g', n: 'chouriço de carne, em rodelas' }
      ]}
    ],
    passos: [
      { t: 'Cozer o pato',
        x: 'Coloca as coxas num tacho com a cebola, a cenoura, o alho, o louro, sal e a água. Cozinha em lume médio-baixo durante 40 minutos, até a carne se soltar do osso.' },
      { t: 'Desfiar a carne',
        x: 'Retira o pato e coa o caldo, reservando 700 ml. Separa a carne dos ossos e desfia-a grosseiramente. A pele pode ser guardada para pôr por cima do arroz.' },
      { t: 'Cozer o arroz',
        x: 'Refoga a cebola picada no azeite até ficar translúcida. Junta o arroz e mexe 1 minuto. Deita o vinho e deixa evaporar. Junta o caldo a ferver e cozinha 12 minutos em lume médio. O arroz deve ficar ainda um pouco firme.' },
      { t: 'Montar no tabuleiro',
        x: 'Pré-aquece o forno a 220 °C. Num tabuleiro largo, espalha metade do arroz, cobre com o pato e termina com o resto do arroz. Distribui as rodelas de chouriço por cima.' },
      { t: 'Levar ao forno',
        x: 'Coze 18 minutos, até a superfície ficar dourada e estaladiça. Deixa repousar 5 minutos antes de servir.' }
    ],
    dicas: [
      { t: 'Caldo bem temperado', x: 'O sabor do arroz vem do caldo. Prova-o antes de o juntar ao arroz e corrige o sal.' },
      { t: 'Arroz ainda firme', x: 'Tira o arroz do lume um pouco antes de estar cozido. Vai acabar de cozer no forno e fica no ponto certo.' },
      { t: 'Tabuleiro largo', x: 'Quanto mais larga a travessa, mais crosta tem o arroz. Evita camadas com mais de 4 cm de altura.' }
    ],
    nutricao: { calorias: 720, proteina: 38, hidratos: 62, acucares: 3, gordura: 33, saturada: 10, fibra: 3, sal: 2.1 }
  },

  /* 3. SOPA DE LEGUMES DA AVÓ (portuguesa, entradas) */
  {
    id: 'sopa-de-legumes',
    titulo: 'Sopa de legumes da avó',
    descricao: 'A sopa de todos os dias: legumes simples, bem cozidos e triturados, com um fio de azeite no fim.',
    categoria: { pais: 'portuguesa', tipo: 'entradas' },
    alimento: ['sopas', 'vegetariano', 'vegan'],
    dieta: ['sem-gluten', 'sem-lactose'],
    imagem: criarImagem('🥣', 'orange', 'Prato de sopa de legumes'),
    galeria: [
      { emoji: '🥣', tom: 'orange', alt: 'Prato de sopa de legumes' },
      { emoji: '🥕', tom: 'lemon', alt: 'Cenouras e batatas cortadas' },
      { emoji: '🥬', tom: 'basil', alt: 'Couve cortada em tiras finas' }
    ],
    icone: '🥣',
    tom: 'orange',
    preparacao: 15,
    cozedura: 20,
    porcoes: 4,
    dificuldade: 'facil',
    ingredientes: [
      { titulo: '', itens: [
        { q: 400, u: 'g', n: 'batata' },
        { q: 2, u: '', n: 'cenouras', ns: 'cenoura', inteiro: true },
        { q: 1, u: '', n: 'cebolas', ns: 'cebola', inteiro: true },
        { q: 1, u: '', n: 'alho-francês', inteiro: true },
        { q: 1, u: '', n: 'courgettes', ns: 'courgette', inteiro: true },
        { q: 1000, u: 'ml', n: 'água' },
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite' },
        { q: 4, u: '', n: 'folhas de couve-galega', ns: 'folha de couve-galega', inteiro: true },
        { q: null, n: 'sal' }
      ]}
    ],
    passos: [
      { t: 'Preparar os legumes',
        x: 'Descasca a batata, a cenoura e a cebola. Corta tudo, incluindo o alho-francês e a courgette, em pedaços pequenos para cozerem depressa.' },
      { t: 'Cozer',
        x: 'Coloca os legumes numa panela com a água e sal. Tapa e cozinha 15 minutos a contar do momento em que ferver, até tudo ficar macio.' },
      { t: 'Triturar',
        x: 'Retira do lume, junta o azeite e tritura com a varinha mágica até ficar liso. Se estiver muito espessa, junta um pouco de água quente.' },
      { t: 'Juntar a couve',
        x: 'Corta a couve em tiras muito finas, junta à sopa e deixa ferver 5 minutos. Prova e acerta o sal.' }
    ],
    dicas: [
      { t: 'Azeite no fim', x: 'Juntar o azeite depois de tirar do lume mantém o sabor mais fresco e frutado.' },
      { t: 'Mais cremosa', x: 'Se a queres mais espessa, acrescenta mais uma batata. Para uma versão mais leve, usa menos.' },
      { t: 'Para congelar', x: 'Congela sem a couve, em porções. Aquece devagar e junta a couve fresca no momento.' }
    ],
    nutricao: { calorias: 150, proteina: 3, hidratos: 21, acucares: 5, gordura: 6, saturada: 1, fibra: 5, sal: 1 }
  },

  /* 4. SALADA DE GRÃO COM ATUM (portuguesa, pratos principais) */
  {
    id: 'salada-de-grao-com-atum',
    titulo: 'Salada de grão com atum',
    descricao: 'Uma salada fresca e saciante, pronta em 15 minutos e sem ligar o fogão.',
    categoria: { pais: 'portuguesa', tipo: 'pratos-principais' },
    alimento: ['saladas', 'peixe-e-marisco'],
    dieta: ['sem-gluten', 'sem-lactose', 'fitness', 'rica-em-proteina'],
    imagem: criarImagem('🥗', 'basil', 'Salada de grão com atum numa taça'),
    galeria: [
      { emoji: '🥗', tom: 'basil', alt: 'Salada de grão com atum numa taça' },
      { emoji: '🍅', tom: 'tomato', alt: 'Tomate cherry cortado' },
      { emoji: '🍋', tom: 'lemon', alt: 'Limão para o molho' }
    ],
    icone: '🥗',
    tom: 'basil',
    preparacao: 15,
    cozedura: 0,
    porcoes: 2,
    dificuldade: 'facil',
    ingredientes: [
      { titulo: 'Salada', itens: [
        { q: 400, u: 'g', n: 'grão-de-bico cozido, escorrido' },
        { q: 1, u: 'lata', up: 'latas', n: 'atum ao natural (120 g)', inteiro: true },
        { q: 150, u: 'g', n: 'tomate cherry' },
        { q: 0.5, u: '', n: 'pepino' },
        { q: 0.5, u: '', n: 'cebola roxa' },
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'salsa picada' }
      ]},
      { titulo: 'Molho', itens: [
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite' },
        { q: 1, u: '', n: 'limões (sumo)', ns: 'limão (sumo)', inteiro: true },
        { q: null, n: 'sal' },
        { q: null, n: 'pimenta' }
      ]}
    ],
    passos: [
      { t: 'Preparar o grão',
        x: 'Passa o grão por água fria e deixa escorrer bem.' },
      { t: 'Cortar os legumes',
        x: 'Corta os tomates ao meio, o pepino em cubos pequenos e a cebola roxa em meias-luas finas.' },
      { t: 'Misturar',
        x: 'Numa taça grande, junta o grão, os legumes, a salsa e o atum escorrido e desfiado.' },
      { t: 'Temperar',
        x: 'Mistura o azeite com o sumo do limão, sal e pimenta. Rega a salada, mexe bem e deixa repousar 10 minutos antes de servir.' }
    ],
    dicas: [
      { t: 'Cebola mais suave', x: 'Deixa a cebola 10 minutos em água fria antes de a usar. Fica menos forte e mais estaladiça.' },
      { t: 'Para saciar mais', x: 'Acrescenta ovo cozido ou abacate às fatias.' },
      { t: 'Guardar', x: 'Aguenta 2 dias no frigorífico. Se for preparar de véspera, junta o tomate só no momento de servir.' }
    ],
    nutricao: { calorias: 410, proteina: 29, hidratos: 34, acucares: 7, gordura: 17, saturada: 2.5, fibra: 9, sal: 1.3 }
  },

  /* 5. PÃO CASEIRO SIMPLES (portuguesa, pequeno-almoço) */
  {
    id: 'pao-caseiro',
    titulo: 'Pão caseiro simples',
    descricao: 'Um pão de miolo macio e côdea estaladiça, feito com quatro ingredientes e muita paciência.',
    categoria: { pais: 'portuguesa', tipo: 'pequeno-almoco' },
    alimento: ['vegan'],
    dieta: ['sem-lactose'],
    imagem: criarImagem('🍞', 'lemon', 'Pão caseiro acabado de sair do forno'),
    galeria: [
      { emoji: '🍞', tom: 'lemon', alt: 'Pão caseiro acabado de sair do forno' },
      { emoji: '🌾', tom: 'orange', alt: 'Farinha de trigo' },
      { emoji: '🥖', tom: 'plum', alt: 'Pão cortado em fatias' }
    ],
    icone: '🍞',
    tom: 'lemon',
    preparacao: 135,
    cozedura: 45,
    porcoes: 10,
    porcaoNome: 'fatia',
    dificuldade: 'medio',
    ingredientes: [
      { titulo: '', itens: [
        { q: 500, u: 'g', n: 'farinha de trigo' },
        { q: 350, u: 'ml', n: 'água morna' },
        { q: 7, u: 'g', n: 'fermento de padeiro seco (1 saqueta)' },
        { q: 10, u: 'g', n: 'sal' },
        { q: 1, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite' }
      ]}
    ],
    passos: [
      { t: 'Misturar',
        x: 'Numa taça grande, mistura a farinha, o sal e o fermento. Junta a água e o azeite e mexe até formar uma massa pegajosa.' },
      { t: 'Amassar',
        x: 'Amassa durante 10 minutos numa superfície enfarinhada, até a massa ficar lisa e elástica.' },
      { t: 'Primeira levedação',
        x: 'Coloca a massa numa taça untada, tapa com um pano e deixa levedar 1 hora a 1 hora e meia, até duplicar de volume.' },
      { t: 'Dar forma',
        x: 'Dá forma de pão e coloca num tabuleiro forrado com papel vegetal. Deixa levedar mais 30 minutos. Entretanto, pré-aquece o forno a 220 °C, com um tabuleiro com água no fundo.' },
      { t: 'Cozer',
        x: 'Faz um corte no topo com uma faca bem afiada e coze 35 a 40 minutos, até ficar dourado e soar a oco quando bates na base. Deixa arrefecer numa grelha pelo menos 30 minutos antes de cortar.' }
    ],
    dicas: [
      { t: 'Água morna, não quente', x: 'A água deve estar à temperatura do corpo. Se estiver quente demais, mata o fermento e o pão não levedará.' },
      { t: 'Côdea estaladiça', x: 'O vapor do tabuleiro com água no forno ajuda a côdea a ficar fina e crocante.' },
      { t: 'Espera para cortar', x: 'Cortar o pão quente liberta o vapor e deixa o miolo gomoso. Deixa arrefecer primeiro.' },
      { t: 'Conservar', x: 'Guarda embrulhado num pano de algodão. Dura 2 dias bem fresco.' }
    ],
    nutricao: { calorias: 160, proteina: 5, hidratos: 33, acucares: 0.5, gordura: 1.5, saturada: 0.2, fibra: 1.5, sal: 1 }
  },

  /* 6. BOLO DE CHOCOLATE HÚMIDO (portuguesa, sobremesas) */
  {
    id: 'bolo-de-chocolate-humido',
    titulo: 'Bolo de chocolate húmido',
    descricao: 'Um bolo escuro e húmido por dentro, com poucos ingredientes e pronto em menos de uma hora.',
    categoria: { pais: 'portuguesa', tipo: 'sobremesas' },
    alimento: ['vegetariano'],
    dieta: [],
    imagem: criarImagem('🍫', 'plum', 'Bolo de chocolate húmido cortado em fatias'),
    galeria: [
      { emoji: '🍫', tom: 'plum', alt: 'Bolo de chocolate húmido cortado em fatias' },
      { emoji: '🥚', tom: 'lemon', alt: 'Ovos e açúcar batidos' },
      { emoji: '🍓', tom: 'tomato', alt: 'Framboesas para acompanhar' }
    ],
    icone: '🍫',
    tom: 'plum',
    preparacao: 15,
    cozedura: 30,
    porcoes: 8,
    porcaoNome: 'fatia',
    dificuldade: 'facil',
    ingredientes: [
      { titulo: '', itens: [
        { q: 200, u: 'g', n: 'chocolate culinário (pelo menos 50% de cacau)' },
        { q: 150, u: 'g', n: 'manteiga' },
        { q: 180, u: 'g', n: 'açúcar' },
        { q: 4, u: '', n: 'ovos', ns: 'ovo', inteiro: true },
        { q: 90, u: 'g', n: 'farinha' },
        { q: 25, u: 'g', n: 'cacau em pó' },
        { q: 0.5, u: 'colher de chá', up: 'colheres de chá', n: 'fermento em pó' },
        { q: 1, u: 'pitada', up: 'pitadas', n: 'sal', inteiro: true }
      ]}
    ],
    passos: [
      { t: 'Preparar a forma',
        x: 'Pré-aquece o forno a 180 °C. Unta uma forma redonda de 22 cm e forra o fundo com papel vegetal.' },
      { t: 'Derreter o chocolate',
        x: 'Derrete o chocolate com a manteiga em banho-maria, ou no micro-ondas em intervalos de 30 segundos, mexendo entre cada um. Deixa arrefecer 5 minutos.' },
      { t: 'Bater os ovos',
        x: 'Bate os ovos com o açúcar durante 3 a 4 minutos, até a mistura ficar clara e espessa.' },
      { t: 'Juntar tudo',
        x: 'Junta o chocolate morno aos ovos. Peneira por cima a farinha, o cacau, o fermento e o sal. Envolve com uma espátula, com movimentos suaves, só até não se verem farinha nem riscas.' },
      { t: 'Cozer',
        x: 'Deita na forma e coze 28 a 30 minutos. A superfície deve ficar firme e o centro ainda ligeiramente húmido. Deixa arrefecer 10 minutos antes de desenformar.' }
    ],
    dicas: [
      { t: 'Não cozas demais', x: 'Um palito deve sair com algumas migalhas húmidas, nunca completamente limpo. O bolo continua a cozer com o calor da forma.' },
      { t: 'Chocolate de qualidade', x: 'Com poucos ingredientes, o chocolate faz toda a diferença. Escolhe um que gostes de comer sozinho.' },
      { t: 'Para servir', x: 'Fica ótimo morno, com gelado de baunilha ou framboesas. Guarda bem tapado até 3 dias.' }
    ],
    nutricao: { calorias: 380, proteina: 6, hidratos: 40, acucares: 26, gordura: 22, saturada: 13, fibra: 2.5, sal: 0.2 }
  },

  /* 7. LASANHA DE CARNE (italiana, pratos principais) */
  {
    id: 'lasanha-de-carne',
    titulo: 'Lasanha de carne',
    descricao: 'Camadas de massa, molho de carne e bechamel, gratinadas com queijo até borbulharem nas bordas.',
    categoria: { pais: 'italiana', tipo: 'pratos-principais' },
    alimento: ['carne', 'massas'],
    dieta: [],
    imagem: criarImagem('🍝', 'tomato', 'Fatia de lasanha de carne'),
    galeria: [
      { emoji: '🍝', tom: 'tomato', alt: 'Fatia de lasanha de carne' },
      { emoji: '🍅', tom: 'orange', alt: 'Molho de tomate e carne' },
      { emoji: '🧀', tom: 'lemon', alt: 'Queijo ralado por cima' }
    ],
    icone: '🍝',
    tom: 'tomato',
    preparacao: 40,
    cozedura: 35,
    porcoes: 6,
    dificuldade: 'medio',
    ingredientes: [
      { titulo: 'Molho de carne', itens: [
        { q: 500, u: 'g', n: 'carne picada' },
        { q: 1, u: '', n: 'cebolas', ns: 'cebola', inteiro: true },
        { q: 2, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite' },
        { q: 400, u: 'g', n: 'tomate pelado em lata' },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'concentrado de tomate' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'orégãos secos' },
        { q: null, n: 'sal' },
        { q: null, n: 'pimenta' }
      ]},
      { titulo: 'Bechamel', itens: [
        { q: 50, u: 'g', n: 'manteiga' },
        { q: 50, u: 'g', n: 'farinha' },
        { q: 700, u: 'ml', n: 'leite' },
        { q: null, n: 'noz-moscada' }
      ]},
      { titulo: 'Montagem', itens: [
        { q: 250, u: 'g', n: 'placas de lasanha' },
        { q: 150, u: 'g', n: 'mozzarella ralada' },
        { q: 50, u: 'g', n: 'parmesão ralado' }
      ]}
    ],
    passos: [
      { t: 'Fazer o molho de carne',
        x: 'Refoga a cebola e o alho picados no azeite durante 5 minutos. Junta a carne e desfaz-a com uma colher até perder a cor, uns 8 minutos. Acrescenta o tomate, o concentrado, os orégãos, sal e pimenta. Cozinha em lume brando 20 minutos.' },
      { t: 'Fazer a bechamel',
        x: 'Derrete a manteiga, junta a farinha e mexe 1 minuto. Junta o leite aos poucos, a mexer, e cozinha cerca de 8 minutos até engrossar. Tempera com noz-moscada e sal.' },
      { t: 'Montar as camadas',
        x: 'Pré-aquece o forno a 180 °C. Barra o fundo de uma travessa com um pouco de molho. Alterna camadas de placas, carne e bechamel, e termina com bechamel.' },
      { t: 'Cobrir com queijo',
        x: 'Espalha a mozzarella e o parmesão por cima, até cobrir toda a superfície.' },
      { t: 'Levar ao forno',
        x: 'Coze 30 a 35 minutos, até estar dourada e a borbulhar nas bordas. Deixa repousar 10 minutos antes de cortar.' }
    ],
    dicas: [
      { t: 'Deixa repousar', x: 'Os 10 minutos de descanso fora do forno fazem as fatias manterem a forma ao servir.' },
      { t: 'Molho mais líquido', x: 'Se usares placas que não precisam de pré-cozedura, deixa o molho um pouco mais líquido. As placas absorvem parte dele no forno.' },
      { t: 'Monta de véspera', x: 'Podes montar a lasanha no dia anterior e guardá-la no frigorífico. Acrescenta uns 10 minutos de forno.' }
    ],
    nutricao: { calorias: 560, proteina: 32, hidratos: 42, acucares: 9, gordura: 29, saturada: 14, fibra: 3, sal: 1.6 }
  },

  /* 8. RISOTTO DE COGUMELOS (italiana, pratos principais) */
  {
    id: 'risotto-de-cogumelos',
    titulo: 'Risotto de cogumelos',
    descricao: 'Arroz cremoso cozido devagar em caldo, com cogumelos dourados e parmesão.',
    categoria: { pais: 'italiana', tipo: 'pratos-principais' },
    alimento: ['arroz', 'vegetariano'],
    dieta: ['sem-gluten'],
    imagem: criarImagem('🍄', 'basil', 'Prato fundo de risotto de cogumelos com parmesão'),
    icone: '🍄',
    tom: 'basil',
    preparacao: 15,
    cozedura: 25,
    porcoes: 4,
    dificuldade: 'medio',
    ingredientes: [
      { titulo: '', itens: [
        { q: 320, u: 'g', n: 'arroz arbóreo' },
        { q: 300, u: 'g', n: 'cogumelos castanhos, laminados' },
        { q: 1, u: '', n: 'cebolas', ns: 'cebola', inteiro: true },
        { q: 2, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite' },
        { q: 50, u: 'g', n: 'manteiga' },
        { q: 100, u: 'ml', n: 'vinho branco seco' },
        { q: 1000, u: 'ml', n: 'caldo de legumes quente' },
        { q: 50, u: 'g', n: 'parmesão ralado' },
        { q: null, n: 'sal' },
        { q: null, n: 'pimenta' },
        { q: null, n: 'salsa picada' }
      ]}
    ],
    passos: [
      { t: 'Saltear os cogumelos',
        x: 'Aquece uma colher de sopa de azeite numa frigideira larga, em lume forte. Salteia os cogumelos 5 minutos, sem mexer muito, até dourarem. Tempera com sal e reserva.' },
      { t: 'Refogar a base',
        x: 'Num tacho largo, refoga a cebola picada e o alho no resto do azeite e em metade da manteiga, em lume médio, durante 4 minutos, até a cebola ficar translúcida.' },
      { t: 'Tostar o arroz',
        x: 'Junta o arroz e mexe 1 a 2 minutos, até as pontas dos grãos ficarem translúcidas. Deita o vinho e deixa evaporar por completo.' },
      { t: 'Cozer aos poucos',
        x: 'Vai juntando o caldo quente, uma concha de cada vez, mexendo com frequência. Só acrescentas mais quando o anterior estiver quase absorvido. Demora cerca de 18 minutos.' },
      { t: 'Finalizar',
        x: 'Quando o arroz estiver cremoso e ainda ligeiramente firme no centro, retira do lume. Junta os cogumelos, o resto da manteiga e o parmesão e mexe com energia. Tapa e deixa repousar 2 minutos. Serve com pimenta e salsa.' }
    ],
    dicas: [
      { t: 'Caldo sempre quente', x: 'Mantém o caldo a fumegar num tacho ao lado. Caldo frio pára a cozedura e o arroz fica irregular.' },
      { t: 'Não laves o arroz', x: 'O amido à superfície dos grãos é o que torna o risotto cremoso.' },
      { t: 'Cogumelos em lume forte', x: 'Se a frigideira for pequena, salteia em duas vezes. Cogumelos amontoados cozem em água e não dourem.' },
      { t: 'Textura certa', x: 'O risotto deve ficar fluido, a espalhar-se lentamente no prato. Se secar, junta uma pitada de caldo no fim.' }
    ],
    nutricao: { calorias: 560, proteina: 14, hidratos: 74, acucares: 4, gordura: 22, saturada: 10, fibra: 3, sal: 1.4 }
  },

  /* 9. TIRAMISÙ (italiana, sobremesas) */
  {
    id: 'tiramisu',
    titulo: 'Tiramisù',
    descricao: 'Camadas de biscoito molhado em café e creme de mascarpone, polvilhadas com cacau.',
    categoria: { pais: 'italiana', tipo: 'sobremesas' },
    alimento: ['vegetariano'],
    dieta: [],
    imagem: criarImagem('🍰', 'plum', 'Quadrado de tiramisù polvilhado com cacau'),
    icone: '🍰',
    tom: 'plum',
    preparacao: 30,
    cozedura: 0,
    repouso: 240,
    porcoes: 6,
    dificuldade: 'facil',
    ingredientes: [
      { titulo: 'Creme', itens: [
        { q: 3, u: '', n: 'ovos muito frescos', ns: 'ovo muito fresco', inteiro: true },
        { q: 90, u: 'g', n: 'açúcar' },
        { q: 400, u: 'g', n: 'mascarpone' }
      ]},
      { titulo: 'Montagem', itens: [
        { q: 250, u: 'ml', n: 'café expresso forte, frio' },
        { q: 200, u: 'g', n: 'biscoitos savoiardi (língua-de-gato italianos)' },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'amaretto ou marsala (opcional)' },
        { q: null, n: 'cacau em pó' }
      ]}
    ],
    passos: [
      { t: 'Preparar o café',
        x: 'Faz o café e deixa-o arrefecer por completo num prato fundo. Se quiseres, junta o amaretto ou o marsala.' },
      { t: 'Fazer o creme de gemas',
        x: 'Separa os ovos. Bate as gemas com o açúcar durante 4 a 5 minutos, até ficarem claras e cremosas. Junta o mascarpone e mistura até ficar liso.' },
      { t: 'Juntar as claras',
        x: 'Bate as claras em castelo firme e envolve-as no creme, com movimentos suaves de baixo para cima, para não perderes o ar.' },
      { t: 'Montar as camadas',
        x: 'Passa cada biscoito rapidamente pelo café, de cada lado, sem os deixar embeber, e forra o fundo de uma travessa de cerca de 20 x 20 cm. Cobre com metade do creme. Repete com mais uma camada de biscoitos e o resto do creme.' },
      { t: 'Repousar no frio',
        x: 'Tapa e leva ao frigorífico no mínimo 4 horas, de preferência de um dia para o outro.' },
      { t: 'Servir',
        x: 'Peneira cacau em pó por cima só no momento de servir, para não humedecer.' }
    ],
    dicas: [
      { t: 'Um mergulho basta', x: 'Se os biscoitos embeberem demasiado, o tiramisù fica aguado. Passa-os pelo café num segundo.' },
      { t: 'Mascarpone à temperatura ambiente', x: 'Tira-o do frigorífico 20 minutos antes. Mistura-se melhor e não faz grumos.' },
      { t: 'O descanso faz o tiramisù', x: 'É no frigorífico que os biscoitos amolecem e os sabores se juntam. O tempo de repouso não está incluído na preparação.' },
      { t: 'Atenção ao ovo cru', x: 'Esta receita leva ovos crus. Não é indicada para grávidas, crianças pequenas, idosos ou pessoas com defesas baixas. Podes usar ovos pasteurizados.' }
    ],
    nutricao: { calorias: 510, proteina: 9, hidratos: 41, acucares: 26, gordura: 31, saturada: 18, fibra: 0.8, sal: 0.2 }
  },

  /* 10. PÃO DE QUEIJO (brasileira, pequeno-almoço) */
  {
    id: 'pao-de-queijo',
    titulo: 'Pão de queijo',
    descricao: 'Pãezinhos brasileiros de polvilho: crocantes por fora, macios e elásticos por dentro, e naturalmente sem glúten.',
    categoria: { pais: 'brasileira', tipo: 'pequeno-almoco' },
    alimento: ['vegetariano'],
    dieta: ['sem-gluten'],
    imagem: criarImagem('🧀', 'lemon', 'Pães de queijo dourados num tabuleiro'),
    icone: '🧀',
    tom: 'lemon',
    preparacao: 20,
    cozedura: 30,
    porcoes: 4,
    porcaoNome: '4 pães',
    dificuldade: 'facil',
    ingredientes: [
      { titulo: '', itens: [
        { q: 250, u: 'g', n: 'polvilho azedo (ou fécula de mandioca)' },
        { q: 125, u: 'ml', n: 'leite' },
        { q: 4, u: 'colher de sopa', up: 'colheres de sopa', n: 'óleo' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'sal' },
        { q: 1, u: '', n: 'ovos', ns: 'ovo', inteiro: true },
        { q: 100, u: 'g', n: 'queijo curado ralado (tipo parmesão)' }
      ]}
    ],
    passos: [
      { t: 'Escaldar o polvilho',
        x: 'Pré-aquece o forno a 200 °C. Coloca o polvilho numa taça. Leva o leite ao lume com o óleo e o sal até ferver e deita de uma vez sobre o polvilho, mexendo com uma colher até ficar farinhento.' },
      { t: 'Juntar o ovo e o queijo',
        x: 'Deixa arrefecer 5 minutos para o ovo não cozer. Junta o ovo e o queijo e amassa com as mãos até obter uma massa lisa e macia. Se estiver seca, junta 1 a 2 colheres de sopa de leite.' },
      { t: 'Dar forma',
        x: 'Com as mãos untadas com óleo, faz bolinhas do tamanho de uma noz (cerca de 30 g) e coloca-as num tabuleiro forrado com papel vegetal, com espaço entre elas.' },
      { t: 'Cozer',
        x: 'Coze 25 a 30 minutos, até inflarem e ficarem douradas. Serve ainda quentes.' }
    ],
    dicas: [
      { t: 'O polvilho certo', x: 'O polvilho azedo dá o sabor e a elasticidade típicos. Encontras em lojas de produtos brasileiros. Com fécula de mandioca doce também funciona, mas o pão fica menos azedinho.' },
      { t: 'Congela cru', x: 'Congela as bolinhas num tabuleiro e passa-as depois para um saco. Vão ao forno sem descongelar, com mais uns 5 minutos de cozedura.' },
      { t: 'Come quente', x: 'Perdem a textura em poucas horas. Se ficarem para o dia seguinte, aquece-os uns minutos no forno.' }
    ],
    nutricao: { calorias: 310, proteina: 8, hidratos: 36, acucares: 1, gordura: 15, saturada: 5, fibra: 0.5, sal: 0.9 }
  },

  /* 11. CARIL DE GRÃO E ESPINAFRES (indiana, pratos principais) */
  {
    id: 'caril-de-grao-e-espinafres',
    titulo: 'Caril de grão e espinafres',
    descricao: 'Um caril vegetal, cremoso e aromático, pronto em 35 minutos com ingredientes de despensa.',
    categoria: { pais: 'indiana', tipo: 'pratos-principais' },
    alimento: ['vegetariano', 'vegan'],
    dieta: ['sem-gluten', 'sem-lactose', 'rica-em-proteina'],
    imagem: criarImagem('🍛', 'orange', 'Caril de grão-de-bico e espinafres numa tigela'),
    icone: '🍛',
    tom: 'orange',
    preparacao: 10,
    cozedura: 25,
    porcoes: 4,
    dificuldade: 'facil',
    ingredientes: [
      { titulo: '', itens: [
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite' },
        { q: 1, u: '', n: 'cebolas', ns: 'cebola', inteiro: true },
        { q: 3, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: 2, u: 'cm', n: 'gengibre fresco, ralado' },
        { q: 2, u: 'colher de chá', up: 'colheres de chá', n: 'garam masala' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'cúrcuma' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'cominhos moídos' },
        { q: 400, u: 'g', n: 'tomate pelado em lata' },
        { q: 480, u: 'g', n: 'grão-de-bico cozido, escorrido' },
        { q: 200, u: 'ml', n: 'leite de coco' },
        { q: 200, u: 'g', n: 'espinafres frescos' },
        { q: 0.5, u: '', n: 'limão (sumo)' },
        { q: null, n: 'sal' },
        { q: null, n: 'coentros frescos' }
      ]}
    ],
    passos: [
      { t: 'Refogar a base',
        x: 'Aquece o azeite e refoga a cebola picada durante 5 minutos, até ficar macia. Junta o alho e o gengibre e mexe 1 minuto.' },
      { t: 'Tostar as especiarias',
        x: 'Junta o garam masala, a cúrcuma e os cominhos e mexe 30 segundos, até libertarem aroma. Se pegarem ao fundo, junta um pouco de água.' },
      { t: 'Cozinhar o molho',
        x: 'Acrescenta o tomate, esmagando-o com a colher, o grão e o leite de coco. Tempera com sal e deixa ferver em lume brando 12 a 15 minutos, até o molho engrossar.' },
      { t: 'Juntar os espinafres',
        x: 'Junta os espinafres aos poucos e mexe até murcharem, cerca de 2 minutos.' },
      { t: 'Finalizar',
        x: 'Retira do lume, junta o sumo de limão, prova e acerta o sal. Serve com coentros picados.' }
    ],
    dicas: [
      { t: 'Com o quê servir', x: 'Fica ótimo com arroz basmati. Para uma refeição sem glúten, evita o pão naan.' },
      { t: 'Mais picante', x: 'Acrescenta meia pimenta fresca picada com o alho, ou uma pitada de piri-piri em pó com as especiarias.' },
      { t: 'Melhor no dia seguinte', x: 'Os sabores assentam durante a noite. Guarda no frigorífico até 3 dias ou congela em porções.' }
    ],
    nutricao: { calorias: 380, proteina: 15, hidratos: 38, acucares: 8, gordura: 19, saturada: 11, fibra: 11, sal: 1 }
  },

  /* 12. RAMEN CASEIRO (japonesa, pratos principais) */
  {
    id: 'ramen-caseiro',
    titulo: 'Ramen caseiro',
    descricao: 'Caldo de porco longo e perfumado com gengibre e alho, noodles, ovo mole e cebola de primavera.',
    categoria: { pais: 'japonesa', tipo: 'pratos-principais' },
    alimento: ['sopas', 'massas', 'carne'],
    dieta: ['sem-lactose'],
    imagem: criarImagem('🍜', 'orange', 'Taça de ramen com porco, ovo e cebola de primavera'),
    icone: '🍜',
    tom: 'orange',
    preparacao: 30,
    cozedura: 90,
    porcoes: 4,
    dificuldade: 'dificil',
    ingredientes: [
      { titulo: 'Caldo e porco', itens: [
        { q: 500, u: 'g', n: 'entremeada de porco, num só pedaço' },
        { q: 2000, u: 'ml', n: 'água' },
        { q: 1, u: '', n: 'cebolas', ns: 'cebola', inteiro: true },
        { q: 4, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: 4, u: 'cm', n: 'gengibre fresco' },
        { q: 4, u: '', n: 'cebolas de primavera (brancas para o caldo, verdes para servir)', ns: 'cebola de primavera (branca para o caldo, verde para servir)', inteiro: true },
        { q: 5, u: 'colher de sopa', up: 'colheres de sopa', n: 'molho de soja' },
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'mirin (vinho de arroz doce)' }
      ]},
      { titulo: 'Para servir', itens: [
        { q: 400, u: 'g', n: 'noodles de ramen' },
        { q: 4, u: '', n: 'ovos', ns: 'ovo', inteiro: true },
        { q: 2, u: 'colher de chá', up: 'colheres de chá', n: 'óleo de sésamo' }
      ]}
    ],
    passos: [
      { t: 'Cozer o porco no caldo',
        x: 'Coloca a entremeada, a cebola cortada ao meio, o alho esmagado, o gengibre em fatias e as partes brancas das cebolas de primavera num tacho largo. Cobre com a água, leva a ferver e retira a espuma que se formar. Baixa o lume e cozinha, semitapado, durante 75 minutos, até a carne estar muito tenra.' },
      { t: 'Cozer os ovos',
        x: 'Enquanto o caldo coze, coloca os ovos em água a ferver durante 7 minutos para a gema ficar mole. Passa por água gelada e descasca.' },
      { t: 'Temperar o caldo',
        x: 'Retira a carne e coa o caldo, que deve render cerca de 1,5 litros. Volta a pô-lo ao lume e tempera com o molho de soja e o mirin. Prova: deve estar bem saboroso e um pouco salgado, porque os noodles vão diluí-lo. Corta a carne em fatias.' },
      { t: 'Cozer os noodles',
        x: 'Coze os noodles em água a ferver, sem sal, durante o tempo indicado na embalagem (2 a 4 minutos). Escorre bem.' },
      { t: 'Montar as taças',
        x: 'Reparte os noodles por 4 taças fundas e cobre com o caldo a ferver. Junta as fatias de porco, os ovos cortados ao meio e as partes verdes das cebolas de primavera finamente cortadas. Termina com umas gotas de óleo de sésamo.' }
    ],
    dicas: [
      { t: 'Noodles à parte', x: 'Coze sempre os noodles numa água à parte. Cozidos no caldo, turvam-no e absorvem-no.' },
      { t: 'Caldo de véspera', x: 'Se o fizeres no dia anterior, guarda no frigorífico e retira a gordura solidificada à superfície. Aquece antes de servir.' },
      { t: 'Ovo marinado', x: 'Para um ovo com mais sabor, deixa-o 2 horas numa mistura de molho de soja e água em partes iguais.' }
    ],
    nutricao: { calorias: 720, proteina: 36, hidratos: 68, acucares: 6, gordura: 34, saturada: 12, fibra: 3, sal: 3.6 }
  },

  /* 13. TACOS DE FRANGO (mexicana, pratos principais) */
  {
    id: 'tacos-de-frango',
    titulo: 'Tacos de frango',
    descricao: 'Frango temperado e grelhado em tortilhas de milho, com abacate, tomate e lima.',
    categoria: { pais: 'mexicana', tipo: 'pratos-principais' },
    alimento: ['aves'],
    dieta: ['sem-lactose'],
    imagem: criarImagem('🌮', 'orange', 'Tacos de frango com abacate e coentros'),
    icone: '🌮',
    tom: 'orange',
    preparacao: 15,
    cozedura: 15,
    porcoes: 4,
    porcaoNome: '2 tacos',
    dificuldade: 'facil',
    ingredientes: [
      { titulo: 'Frango', itens: [
        { q: 500, u: 'g', n: 'peito de frango, em tiras finas' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'paprika' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'cominhos moídos' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'orégãos secos' },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite' },
        { q: 1, u: '', n: 'limas (sumo)', ns: 'lima (sumo)', inteiro: true },
        { q: null, n: 'sal' }
      ]},
      { titulo: 'Para montar', itens: [
        { q: 8, u: '', n: 'tortilhas de milho pequenas', ns: 'tortilha de milho pequena', inteiro: true },
        { q: 1, u: '', n: 'abacates maduros', ns: 'abacate maduro', inteiro: true },
        { q: 2, u: '', n: 'tomates médios', ns: 'tomate médio', inteiro: true },
        { q: 0.5, u: '', n: 'cebola roxa' },
        { q: null, n: 'coentros frescos' },
        { q: null, n: 'lima, para servir' }
      ]}
    ],
    passos: [
      { t: 'Marinar o frango',
        x: 'Mistura o frango com o paprika, os cominhos, os orégãos, o sumo de lima, uma colher de sopa de azeite e sal. Deixa marinar enquanto preparas o resto, pelo menos 10 minutos.' },
      { t: 'Preparar os acompanhamentos',
        x: 'Corta o tomate em cubos pequenos e a cebola roxa em tiras finas. Esmaga o abacate com um garfo, com sal e um fio de sumo de lima. Pica os coentros.' },
      { t: 'Grelhar o frango',
        x: 'Aquece o resto do azeite numa frigideira larga, em lume forte. Grelha o frango 6 a 8 minutos, virando, até ficar dourado e cozinhado por dentro.' },
      { t: 'Aquecer as tortilhas',
        x: 'Aquece cada tortilha 20 a 30 segundos de cada lado numa frigideira seca. Mantém-nas embrulhadas num pano até servir.' },
      { t: 'Montar',
        x: 'Barra cada tortilha com abacate, junta o frango, o tomate, a cebola e os coentros. Serve com lima para cada um espremer.' }
    ],
    dicas: [
      { t: 'Aquece as tortilhas', x: 'Tortilhas de milho frias partem-se. Aquecidas, ficam flexíveis e com melhor sabor.' },
      { t: 'Frango em tiras finas', x: 'Tiras finas cozem depressa e ficam suculentas. Se a frigideira for pequena, grelha em duas vezes para não cozer a vapor.' },
      { t: 'Para picar mais', x: 'Acrescenta jalapeños em conserva ou molho picante à tua escolha na montagem.' }
    ],
    nutricao: { calorias: 450, proteina: 38, hidratos: 34, acucares: 4, gordura: 18, saturada: 3, fibra: 8, sal: 0.8 }
  },

  /* 14. GAZPACHO (espanhola, entradas) */
  {
    id: 'gazpacho',
    titulo: 'Gazpacho',
    descricao: 'Sopa fria de tomate, pepino e pimento, batida com azeite, ideal para dias de calor.',
    categoria: { pais: 'espanhola', tipo: 'entradas' },
    alimento: ['sopas', 'vegetariano', 'vegan'],
    dieta: ['sem-gluten', 'sem-lactose', 'low-carb'],
    imagem: criarImagem('🥣', 'tomato', 'Taça de gazpacho com um fio de azeite'),
    icone: '🥣',
    tom: 'tomato',
    preparacao: 15,
    cozedura: 0,
    repouso: 120,
    porcoes: 4,
    dificuldade: 'facil',
    ingredientes: [
      { titulo: '', itens: [
        { q: 1000, u: 'g', n: 'tomate muito maduro' },
        { q: 1, u: '', n: 'pepinos pequenos', ns: 'pepino pequeno', inteiro: true },
        { q: 1, u: '', n: 'pimentos verdes pequenos', ns: 'pimento verde pequeno', inteiro: true },
        { q: 1, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: 4, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite virgem extra' },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'vinagre de vinho' },
        { q: null, n: 'sal' }
      ]}
    ],
    passos: [
      { t: 'Cortar os legumes',
        x: 'Lava o tomate e corta em pedaços. Descasca o pepino e tira as sementes ao pimento. Corta tudo em pedaços grandes, juntamente com o alho.' },
      { t: 'Triturar',
        x: 'Bate tudo com o vinagre e uma pitada de sal até ficar liso, em duas vezes se necessário. Com a trituradora ligada, junta o azeite em fio, para emulsionar e deixar a sopa mais cremosa e clara.' },
      { t: 'Coar',
        x: 'Passa por um passador fino para uma textura mais sedosa. Este passo é opcional.' },
      { t: 'Arrefecer e servir',
        x: 'Leva ao frigorífico no mínimo 2 horas. Prova e acerta o sal e o vinagre. Serve bem frio, com um fio de azeite.' }
    ],
    dicas: [
      { t: 'Tomate maduro de verdade', x: 'É o ingrediente que manda. Com tomates sem sabor, o gazpacho fica sem alma. Se for preciso, junta uma pitada de açúcar.' },
      { t: 'Bem frio', x: 'O gazpacho serve-se gelado. Podes juntar um cubo de gelo a cada taça.' },
      { t: 'Para acompanhar', x: 'Serve com cubinhos de pepino e pimento por cima. Se quiseres mais corpo, bate uma fatia de pão do dia anterior com os legumes. O pão leva glúten.' }
    ],
    nutricao: { calorias: 150, proteina: 2.5, hidratos: 12, acucares: 9, gordura: 11, saturada: 1.6, fibra: 4, sal: 0.6 }
  },

  /* 15. TARTE DE MAÇÃ (francesa, sobremesas) */
  {
    id: 'tarte-de-maca',
    titulo: 'Tarte de maçã',
    descricao: 'Fatias finas de maçã em espiral sobre massa estaladiça, com canela e um brilho de compota.',
    categoria: { pais: 'francesa', tipo: 'sobremesas' },
    alimento: ['vegetariano'],
    dieta: [],
    imagem: criarImagem('🍎', 'tomato', 'Tarte de maçã com fatias dispostas em círculo'),
    icone: '🍎',
    tom: 'tomato',
    preparacao: 25,
    cozedura: 35,
    porcoes: 8,
    dificuldade: 'facil',
    ingredientes: [
      { titulo: 'Massa e recheio', itens: [
        { q: 1, u: '', n: 'rolos de massa quebrada (cerca de 230 g)', ns: 'rolo de massa quebrada (cerca de 230 g)', inteiro: true },
        { q: 4, u: '', n: 'maçãs Golden ou Reineta', ns: 'maçã Golden ou Reineta', inteiro: true },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'açúcar mascavado' },
        { q: 1, u: 'colher de sopa', up: 'colheres de sopa', n: 'sumo de limão' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'canela em pó' },
        { q: 30, u: 'g', n: 'manteiga, em cubos pequenos' }
      ]},
      { titulo: 'Para brilhar', itens: [
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'compota de alperce' },
        { q: 1, u: 'colher de sopa', up: 'colheres de sopa', n: 'água' }
      ]}
    ],
    passos: [
      { t: 'Forrar a forma',
        x: 'Pré-aquece o forno a 190 °C. Forra uma forma de tarte de 24 cm com a massa, pressionando bem nos cantos. Pica o fundo com um garfo.' },
      { t: 'Preparar as maçãs',
        x: 'Descasca as maçãs, tira o centro e corta em fatias finas, com cerca de 3 mm. Mistura com o sumo de limão, o açúcar e a canela.' },
      { t: 'Dispor as fatias',
        x: 'Arruma as fatias ligeiramente sobrepostas, em círculos, começando pela borda e terminando no centro. Espalha os cubinhos de manteiga por cima.' },
      { t: 'Cozer',
        x: 'Coze 35 minutos, até as maçãs estarem macias e a massa dourada.' },
      { t: 'Dar brilho',
        x: 'Aquece a compota com a água e pincela a tarte ainda quente. Deixa arrefecer 15 minutos antes de desenformar.' }
    ],
    dicas: [
      { t: 'A maçã certa', x: 'Escolhe variedades firmes, como Golden, Reineta ou Granny Smith. Maçãs farinhentas desfazem-se no forno.' },
      { t: 'Fatias iguais', x: 'Fatias com a mesma espessura cozem por igual. Uma mandolina ajuda, mas com uma faca afiada também se consegue.' },
      { t: 'Bordas a escurecer', x: 'Se a massa dourar depressa demais, cobre as bordas com tiras de folha de alumínio.' },
      { t: 'Para servir', x: 'Fica ótima morna, com uma bola de gelado de baunilha.' }
    ],
    nutricao: { calorias: 260, proteina: 2, hidratos: 36, acucares: 17, gordura: 12, saturada: 6, fibra: 2.5, sal: 0.3 }
  },

  /* 16. FRANCESINHA À MODA DO PORTO (portuguesa, pratos principais) */
  {
    id: 'francesinha',
    titulo: 'Francesinha à moda do Porto',
    descricao: 'Sanduíche recheada de carnes, coberta com queijo derretido, ovo estrelado e um molho de cerveja e tomate.',
    categoria: { pais: 'portuguesa', tipo: 'pratos-principais' },
    alimento: ['carne'],
    dieta: [],
    imagem: criarImagem('🥪', 'lemon', 'Francesinha com queijo derretido e ovo estrelado'),
    galeria: [
      { emoji: '🥪', tom: 'lemon',  alt: 'Francesinha com queijo derretido e ovo estrelado' },
      { emoji: '🍺', tom: 'orange', alt: 'Cerveja para o molho' },
      { emoji: '🍳', tom: 'tomato', alt: 'Ovo estrelado para cobrir' }
    ],
    icone: '🥪',
    tom: 'lemon',
    preparacao: 45,
    cozedura: 60,
    porcoes: 4,
    dificuldade: 'dificil',
    ingredientes: [
      { titulo: 'Sanduíches', itens: [
        { q: 8, u: 'fatia', up: 'fatias', n: 'pão de forma', inteiro: true },
        { q: 4, u: '', n: 'bifes de vaca finos (cerca de 400 g)', ns: 'bife de vaca fino (cerca de 400 g)', inteiro: true },
        { q: 2, u: '', n: 'linguiças frescas', ns: 'linguiça fresca', inteiro: true },
        { q: 4, u: 'fatia', up: 'fatias', n: 'fiambre', inteiro: true },
        { q: 12, u: 'fatia', up: 'fatias', n: 'queijo flamengo', inteiro: true },
        { q: 4, u: '', n: 'ovos', ns: 'ovo', inteiro: true },
        { q: null, n: 'azeite' },
        { q: null, n: 'sal' }
      ]},
      { titulo: 'Molho', itens: [
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'manteiga' },
        { q: 1, u: '', n: 'cebolas grandes', ns: 'cebola grande', inteiro: true },
        { q: 3, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'farinha' },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'polpa de tomate' },
        { q: 330, u: 'ml', n: 'cerveja' },
        { q: 100, u: 'ml', n: 'vinho do Porto' },
        { q: 300, u: 'ml', n: 'caldo de carne' },
        { q: 1, u: 'folha', up: 'folhas', n: 'louro', inteiro: true },
        { q: null, n: 'piri-piri ou malagueta, a gosto' }
      ]}
    ],
    passos: [
      { t: 'Começar o molho',
        x: 'Derrete a manteiga num tacho e refoga a cebola e o alho picados em lume brando, 10 minutos, até ficarem macios. Junta a farinha e mexe durante 1 minuto.' },
      { t: 'Cozinhar o molho',
        x: 'Acrescenta a polpa de tomate, a cerveja, o vinho do Porto, o caldo, o louro e o piri-piri. Deixa ferver em lume brando 40 minutos, até reduzir e ficar encorpado. Retira o louro e tritura com a varinha mágica.' },
      { t: 'Grelhar as carnes',
        x: 'Tempera os bifes com sal e grelha-os 1 a 2 minutos de cada lado. Grelha as linguiças, cortadas ao meio no comprimento, até ficarem douradas e bem cozidas por dentro.' },
      { t: 'Montar',
        x: 'Pré-aquece o forno a 200 °C. Em cada sanduíche, põe uma fatia de pão, o fiambre, o bife, a linguiça e outra fatia de pão. Cobre com 3 fatias de queijo.' },
      { t: 'Gratinar',
        x: 'Leva ao forno 10 minutos, até o queijo derreter e cobrir bem a sanduíche.' },
      { t: 'Servir',
        x: 'Estrela os ovos em azeite. Coloca cada francesinha num prato fundo, cobre com o ovo e rega com o molho muito quente. Serve com batatas fritas.' }
    ],
    dicas: [
      { t: 'O molho é a alma', x: 'Faz o molho com antecedência: fica ainda melhor no dia seguinte e aguenta 3 dias no frigorífico.' },
      { t: 'Prato a aquecer', x: 'Serve em pratos fundos previamente aquecidos. O molho quente é o que mantém o queijo derretido.' },
      { t: 'Queijo a mais', x: 'Não poupes no queijo. É ele que forma a cobertura que se desfaz com o molho.' },
      { t: 'Para menos picante', x: 'Põe só uma pitada de piri-piri e deixa que cada um acrescente à mesa.' }
    ],
    nutricao: { calorias: 980, proteina: 62, hidratos: 52, acucares: 7, gordura: 56, saturada: 27, fibra: 3, sal: 4.1 }
  },

  /* 17. POLVO À LAGAREIRO (portuguesa, pratos principais) */
  {
    id: 'polvo-a-lagareiro',
    titulo: 'Polvo à lagareiro',
    descricao: 'Polvo cozido e assado no forno, com batatas a murro e muito alho dourado em azeite.',
    categoria: { pais: 'portuguesa', tipo: 'pratos-principais' },
    alimento: ['peixe-e-marisco'],
    dieta: ['sem-gluten', 'sem-lactose'],
    imagem: criarImagem('🐙', 'sky', 'Polvo à lagareiro com batatas a murro'),
    galeria: [
      { emoji: '🐙', tom: 'sky',    alt: 'Polvo à lagareiro com batatas a murro' },
      { emoji: '🥔', tom: 'orange', alt: 'Batatas a murro' },
      { emoji: '🧄', tom: 'lemon',  alt: 'Alho dourado em azeite' }
    ],
    icone: '🐙',
    tom: 'sky',
    preparacao: 20,
    cozedura: 70,
    porcoes: 4,
    dificuldade: 'medio',
    ingredientes: [
      { titulo: 'Polvo e batatas', itens: [
        { q: 1.5, u: 'kg', n: 'polvo, de preferência congelado e descongelado' },
        { q: 800, u: 'g', n: 'batata pequena, com casca' },
        { q: 1, u: '', n: 'cebolas', ns: 'cebola', inteiro: true },
        { q: 1, u: 'folha', up: 'folhas', n: 'louro', inteiro: true },
        { q: null, n: 'sal grosso' }
      ]},
      { titulo: 'Para assar', itens: [
        { q: 200, u: 'ml', n: 'azeite' },
        { q: 8, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: null, n: 'pimenta preta' },
        { q: null, n: 'coentros picados' }
      ]}
    ],
    passos: [
      { t: 'Cozer o polvo',
        x: 'Põe o polvo numa panela larga com a cebola e o louro, sem água. Tapa e cozinha em lume brando cerca de 45 minutos, até o polvo largar a sua própria água e ficar macio ao espetar um garfo. Escorre.' },
      { t: 'Preparar as batatas',
        x: 'Pré-aquece o forno a 200 °C. Coloca as batatas num tabuleiro, tempera com sal grosso e um fio de azeite e leva ao forno 30 minutos, até ficarem macias.' },
      { t: 'Dar o murro',
        x: 'Retira as batatas e dá um murro suave em cada uma, só para abrir, sem as desfazer.' },
      { t: 'Assar',
        x: 'Junta o polvo ao tabuleiro, regado com metade do azeite e a pimenta. Assa 20 minutos, virando uma vez, até dourar.' },
      { t: 'Dourar o alho',
        x: 'Aquece o restante azeite com os dentes de alho laminados em lume médio, até ficarem dourados. Rega o polvo e as batatas e polvilha com coentros. Serve de imediato.' }
    ],
    dicas: [
      { t: 'Polvo congelado', x: 'Congelar o polvo parte as fibras e deixa-o mais tenro. Descongela-o devagar no frigorífico.' },
      { t: 'Sem sal na cozedura', x: 'O polvo já é salgado. Prova antes de juntar sal.' },
      { t: 'Alho sem amargar', x: 'Não deixes o alho escurecer demais, porque amarga. Tira o tacho do lume assim que estiver dourado.' },
      { t: 'Acompanhamento', x: 'Fica muito bem com uma salada de alface e tomate.' }
    ],
    nutricao: { calorias: 610, proteina: 52, hidratos: 33, acucares: 3, gordura: 29, saturada: 4.5, fibra: 4, sal: 2.2 }
  },

  /* 18. SALADA CAPRESE (italiana, entradas) */
  {
    id: 'salada-caprese',
    titulo: 'Salada caprese',
    descricao: 'Tomate maduro, mozzarella fresca e manjericão, só com azeite e sal. A simplicidade italiana no seu melhor.',
    categoria: { pais: 'italiana', tipo: 'entradas' },
    alimento: ['saladas', 'vegetariano'],
    dieta: ['sem-gluten', 'low-carb'],
    imagem: criarImagem('🍅', 'tomato', 'Salada caprese com tomate, mozzarella e manjericão'),
    galeria: [
      { emoji: '🍅', tom: 'tomato', alt: 'Salada caprese com tomate, mozzarella e manjericão' },
      { emoji: '🌿', tom: 'basil',  alt: 'Folhas de manjericão fresco' }
    ],
    icone: '🍅',
    tom: 'tomato',
    preparacao: 10,
    cozedura: 0,
    porcoes: 2,
    dificuldade: 'facil',
    ingredientes: [
      { titulo: '', itens: [
        { q: 3, u: '', n: 'tomates maduros', ns: 'tomate maduro', inteiro: true },
        { q: 250, u: 'g', n: 'mozzarella fresca' },
        { q: 1, u: 'mão-cheia', up: 'mãos-cheias', n: 'folhas de manjericão' },
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite virgem extra' },
        { q: null, n: 'sal em flor' },
        { q: null, n: 'pimenta preta moída na hora' },
        { q: null, n: 'vinagre balsâmico' }
      ]}
    ],
    passos: [
      { t: 'Cortar',
        x: 'Lava os tomates e corta-os em rodelas com cerca de 1 cm. Escorre a mozzarella e corta-a em rodelas da mesma espessura.' },
      { t: 'Montar',
        x: 'Num prato, alterna as rodelas de tomate e de mozzarella, ligeiramente sobrepostas. Intercala com folhas de manjericão.' },
      { t: 'Temperar',
        x: 'Tempera com o sal em flor e a pimenta, e rega com o azeite. Se quiseres, junta umas gotas de vinagre balsâmico. Serve de imediato.' }
    ],
    dicas: [
      { t: 'Tomate à temperatura ambiente', x: 'Não guardes os tomates no frigorífico. O frio tira-lhes o sabor e a doçura.' },
      { t: 'Manjericão inteiro', x: 'Rasga as folhas à mão ou deixa-as inteiras. Cortá-las com faca faz escurecer as bordas.' },
      { t: 'Sal no fim', x: 'Tempera mesmo antes de servir. Se salgares cedo, o tomate larga água e a salada fica aguada.' }
    ],
    nutricao: { calorias: 380, proteina: 22, hidratos: 7, acucares: 5, gordura: 29, saturada: 12, fibra: 2, sal: 0.9 }
  },

  /* 19. FEIJOADA BRASILEIRA (brasileira, pratos principais) */
  {
    id: 'feijoada-brasileira',
    titulo: 'Feijoada brasileira',
    descricao: 'Feijão preto cozinhado lentamente com carnes de porco fumadas, servido com arroz branco e rodelas de laranja.',
    categoria: { pais: 'brasileira', tipo: 'pratos-principais' },
    alimento: ['carne'],
    dieta: ['sem-gluten'],
    imagem: criarImagem('🫘', 'tomato', 'Panela de feijoada brasileira com carnes'),
    galeria: [
      { emoji: '🫘', tom: 'tomato', alt: 'Panela de feijoada brasileira com carnes' },
      { emoji: '🍊', tom: 'orange', alt: 'Rodelas de laranja para acompanhar' },
      { emoji: '🍚', tom: 'lemon',  alt: 'Arroz branco para servir' }
    ],
    icone: '🫘',
    tom: 'tomato',
    preparacao: 30,
    repouso: 720,
    cozedura: 150,
    porcoes: 6,
    dificuldade: 'medio',
    ingredientes: [
      { titulo: 'Feijoada', itens: [
        { q: 500, u: 'g', n: 'feijão preto' },
        { q: 500, u: 'g', n: 'costelinha de porco' },
        { q: 200, u: 'g', n: 'paio' },
        { q: 200, u: 'g', n: 'chouriço de carne' },
        { q: 150, u: 'g', n: 'bacon, em cubos' },
        { q: 2, u: '', n: 'cebolas', ns: 'cebola', inteiro: true },
        { q: 5, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: 3, u: 'folha', up: 'folhas', n: 'louro', inteiro: true },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'azeite' },
        { q: null, n: 'sal e pimenta' }
      ]},
      { titulo: 'Para servir', itens: [
        { q: 300, u: 'g', n: 'arroz branco, cozido à parte' },
        { q: 2, u: '', n: 'laranjas', ns: 'laranja', inteiro: true },
        { q: 1, u: 'molho', up: 'molhos', n: 'couve galega, salteada com alho', inteiro: true }
      ]}
    ],
    passos: [
      { t: 'Demolhar o feijão',
        x: 'Na véspera, deixa o feijão de molho em água fria, cerca de 12 horas. Escorre antes de cozinhar.' },
      { t: 'Cozer o feijão',
        x: 'Põe o feijão numa panela grande, cobre com água fresca, junta o louro e deixa ferver. Baixa o lume e cozinha, parcialmente tapado, 1 hora, juntando água quente sempre que for necessário.' },
      { t: 'Preparar as carnes',
        x: 'Entretanto, frita o bacon no azeite até largar gordura. Junta a costelinha cortada em pedaços e deixa corar. Acrescenta o paio e o chouriço em rodelas.' },
      { t: 'Refogar',
        x: 'Junta a cebola picada e o alho e refoga 5 minutos, até ficarem translúcidos.' },
      { t: 'Juntar tudo',
        x: 'Passa o refogado e as carnes para a panela do feijão. Cozinha mais 1 hora e meia em lume brando, até o feijão estar muito macio e o caldo encorpado. Acerta o sal e a pimenta.' },
      { t: 'Servir',
        x: 'Serve bem quente, com arroz branco, a couve salteada e rodelas de laranja.' }
    ],
    dicas: [
      { t: 'Laranja, não é enfeite', x: 'A laranja é a companheira clássica: a acidez corta a gordura das carnes e ajuda a digestão.' },
      { t: 'Caldo mais espesso', x: 'Esmaga uma concha de feijão com um garfo e volta a juntá-la à panela. O caldo engrossa sem adicionar nada.' },
      { t: 'Melhora no dia seguinte', x: 'Como acontece com muitos estufados, fica ainda mais saborosa reaquecida. Guarda até 3 dias no frigorífico.' },
      { t: 'Demolha de véspera', x: 'As 12 horas são só a demolha do feijão. Deixa-o de molho à noite, ou de manhã, se fores cozinhar ao fim do dia.' }
    ],
    nutricao: { calorias: 820, proteina: 49, hidratos: 62, acucares: 6, gordura: 40, saturada: 14, fibra: 14, sal: 3.2 }
  },

  /* 20. SUMO DE MARACUJÁ (brasileira, bebidas) */
  {
    id: 'sumo-de-maracuja',
    titulo: 'Sumo de maracujá',
    descricao: 'Um sumo refrescante, ácido e perfumado, feito só com a polpa do fruto, água e açúcar.',
    categoria: { pais: 'brasileira', tipo: 'bebidas' },
    alimento: ['vegan'],
    dieta: ['sem-gluten', 'sem-lactose'],
    imagem: criarImagem('🥤', 'orange', 'Copo de sumo de maracujá com gelo'),
    galeria: [
      { emoji: '🥤', tom: 'orange', alt: 'Copo de sumo de maracujá com gelo' },
      { emoji: '🧊', tom: 'sky',    alt: 'Gelo para servir' }
    ],
    icone: '🥤',
    tom: 'orange',
    preparacao: 10,
    cozedura: 0,
    porcoes: 4,
    porcaoNome: 'copo',
    dificuldade: 'facil',
    ingredientes: [
      { titulo: '', itens: [
        { q: 6, u: '', n: 'maracujás maduros', ns: 'maracujá maduro', inteiro: true },
        { q: 750, u: 'ml', n: 'água fria' },
        { q: 4, u: 'colher de sopa', up: 'colheres de sopa', n: 'açúcar' },
        { q: null, n: 'gelo' }
      ]}
    ],
    passos: [
      { t: 'Retirar a polpa',
        x: 'Corta os maracujás ao meio e retira a polpa com uma colher para o copo da liquidificadora.' },
      { t: 'Bater',
        x: 'Junta a água e o açúcar. Bate em velocidade baixa durante 10 a 15 segundos, só para soltar a polpa das sementes sem as partir.' },
      { t: 'Coar e servir',
        x: 'Passa por um passador fino, pressionando com uma colher. Prova e, se for preciso, acrescenta mais açúcar. Serve com gelo.' }
    ],
    dicas: [
      { t: 'Maracujá maduro', x: 'Escolhe frutos pesados e com a casca enrugada. É sinal de que estão doces e cheios de polpa.' },
      { t: 'Sem partir as sementes', x: 'Se baterem demais, as sementes ficam amargas e o sumo escurece.' },
      { t: 'Versão adulta', x: 'Para uma bebida diferente, junta água com gás e umas folhas de hortelã.' },
      { t: 'Para guardar', x: 'Mantém no frigorífico até 2 dias, bem tapado. Mexe antes de servir.' }
    ],
    nutricao: { calorias: 90, proteina: 1.5, hidratos: 21, acucares: 19, gordura: 0.5, saturada: 0, fibra: 3, sal: 0 }
  },

  /* 21. SUSHI DE SALMÃO (japonesa, pratos principais) */
  {
    id: 'sushi-de-salmao',
    titulo: 'Sushi de salmão',
    descricao: 'Rolos e peças de arroz temperado com salmão fresco, pepino e abacate, para fazer em casa.',
    categoria: { pais: 'japonesa', tipo: 'pratos-principais' },
    alimento: ['peixe-e-marisco', 'arroz'],
    dieta: ['sem-lactose'],
    imagem: criarImagem('🍣', 'sky', 'Travessa de sushi de salmão'),
    galeria: [
      { emoji: '🍣', tom: 'sky',    alt: 'Travessa de sushi de salmão' },
      { emoji: '🍚', tom: 'lemon',  alt: 'Arroz de sushi temperado' },
      { emoji: '🥒', tom: 'basil',  alt: 'Pepino e abacate para o recheio' }
    ],
    icone: '🍣',
    tom: 'sky',
    preparacao: 60,
    cozedura: 15,
    porcoes: 4,
    dificuldade: 'dificil',
    ingredientes: [
      { titulo: 'Arroz de sushi', itens: [
        { q: 300, u: 'g', n: 'arroz de sushi' },
        { q: 360, u: 'ml', n: 'água' },
        { q: 4, u: 'colher de sopa', up: 'colheres de sopa', n: 'vinagre de arroz' },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'açúcar' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'sal' }
      ]},
      { titulo: 'Recheio', itens: [
        { q: 250, u: 'g', n: 'salmão fresco próprio para consumo em cru' },
        { q: 4, u: 'folha', up: 'folhas', n: 'alga nori', inteiro: true },
        { q: 1, u: '', n: 'pepinos', ns: 'pepino', inteiro: true },
        { q: 1, u: '', n: 'abacates maduros', ns: 'abacate maduro', inteiro: true }
      ]},
      { titulo: 'Para servir', itens: [
        { q: null, n: 'molho de soja' },
        { q: null, n: 'wasabi' },
        { q: null, n: 'gengibre em conserva' }
      ]}
    ],
    passos: [
      { t: 'Lavar e cozer o arroz',
        x: 'Lava o arroz em várias águas, até a água sair quase limpa. Coze com a água indicada, tapado, em lume brando, durante 15 minutos. Deixa repousar tapado 10 minutos.' },
      { t: 'Temperar',
        x: 'Aquece o vinagre com o açúcar e o sal até dissolver. Passa o arroz para uma tigela larga, rega com a mistura e envolve com cortes suaves, sem esmagar. Deixa arrefecer até ficar morno.' },
      { t: 'Cortar o recheio',
        x: 'Corta o salmão, o pepino e o abacate em tiras finas e compridas.' },
      { t: 'Enrolar',
        x: 'Sobre uma esteira de bambu, coloca uma folha de nori e espalha uma camada fina de arroz, deixando 2 cm livres no topo. Dispõe o recheio numa linha ao centro e enrola com firmeza, ajudado pela esteira.' },
      { t: 'Cortar e servir',
        x: 'Corta cada rolo em 6 a 8 peças com uma faca bem afiada, passando-a por água entre cortes. Serve com molho de soja, wasabi e gengibre em conserva.' }
    ],
    dicas: [
      { t: 'Peixe cru, com segurança', x: 'Usa salmão indicado para consumo em cru e mantém-no no frio até ao último momento. É habitual congelar o peixe a −20 °C durante pelo menos 24 horas. Confirma com o teu peixeiro.' },
      { t: 'Mãos molhadas', x: 'Molha as mãos em água com um pouco de vinagre para o arroz não se colar.' },
      { t: 'Arroz certo', x: 'Usa arroz próprio para sushi. Outros arrozes não ficam suficientemente pegajosos para os rolos se manterem inteiros.' },
      { t: 'Sem glúten?', x: 'O molho de soja leva trigo. Se evitas glúten, procura uma versão sem glúten (tamari).' }
    ],
    nutricao: { calorias: 520, proteina: 24, hidratos: 70, acucares: 8, gordura: 16, saturada: 3, fibra: 5, sal: 1.8 }
  },

  /* 22. GUACAMOLE (mexicana, entradas) */
  {
    id: 'guacamole',
    titulo: 'Guacamole',
    descricao: 'Abacate maduro esmagado com limão, coentros e um toque de picante. Para molhar nachos ou acompanhar tacos.',
    categoria: { pais: 'mexicana', tipo: 'entradas' },
    alimento: ['vegetariano', 'vegan'],
    dieta: ['sem-gluten', 'sem-lactose', 'low-carb'],
    imagem: criarImagem('🥑', 'basil', 'Taça de guacamole com nachos'),
    galeria: [
      { emoji: '🥑', tom: 'basil',  alt: 'Taça de guacamole com nachos' },
      { emoji: '🌶️', tom: 'tomato', alt: 'Malagueta para dar picante' }
    ],
    icone: '🥑',
    tom: 'basil',
    preparacao: 10,
    cozedura: 0,
    porcoes: 4,
    dificuldade: 'facil',
    ingredientes: [
      { titulo: '', itens: [
        { q: 3, u: '', n: 'abacates maduros', ns: 'abacate maduro', inteiro: true },
        { q: 1, u: '', n: 'limas', ns: 'lima', inteiro: true },
        { q: 1, u: '', n: 'tomates', ns: 'tomate', inteiro: true },
        { q: 1, u: '', n: 'cebolas roxas pequenas', ns: 'cebola roxa pequena', inteiro: true },
        { q: 3, u: 'colher de sopa', up: 'colheres de sopa', n: 'coentros picados' },
        { q: 1, u: '', n: 'malaguetas', ns: 'malagueta', inteiro: true },
        { q: null, n: 'sal' }
      ]}
    ],
    passos: [
      { t: 'Esmagar o abacate',
        x: 'Corta os abacates ao meio, retira o caroço e a polpa para uma taça. Esmaga com um garfo, deixando alguns pedaços.' },
      { t: 'Juntar o resto',
        x: 'Pica finamente a cebola, a malagueta (sem sementes, se quiseres menos picante) e o tomate sem sementes. Junta tudo ao abacate, com os coentros e o sumo da lima.' },
      { t: 'Temperar',
        x: 'Mistura com cuidado e acerta o sal. Serve de imediato.' }
    ],
    dicas: [
      { t: 'Abacate no ponto', x: 'O abacate está maduro quando cede ligeiramente à pressão do polegar. Se estiver muito duro, o guacamole fica sem sabor.' },
      { t: 'Evitar que escureça', x: 'Cobre a superfície com película aderente, bem encostada, e guarda no frigorífico. Aguenta bem 1 dia.' },
      { t: 'Caroço não ajuda', x: 'É um mito que o caroço no guacamole impede que escureça. O que ajuda é o limão e evitar o ar.' }
    ],
    nutricao: { calorias: 230, proteina: 3, hidratos: 12, acucares: 3, gordura: 20, saturada: 4, fibra: 9, sal: 0.4 }
  },

  /* 23. FRANGO TIKKA MASALA (indiana, pratos principais) */
  {
    id: 'frango-tikka-masala',
    titulo: 'Frango tikka masala',
    descricao: 'Pedaços de frango marinados em iogurte e especiarias, num molho de tomate cremoso e aromático.',
    categoria: { pais: 'indiana', tipo: 'pratos-principais' },
    alimento: ['aves', 'arroz'],
    dieta: ['sem-gluten', 'rica-em-proteina'],
    imagem: criarImagem('🍗', 'tomato', 'Frango tikka masala com arroz basmati'),
    galeria: [
      { emoji: '🍗', tom: 'tomato', alt: 'Frango tikka masala com arroz basmati' },
      { emoji: '🍚', tom: 'lemon',  alt: 'Arroz basmati para acompanhar' },
      { emoji: '🌶️', tom: 'orange', alt: 'Especiarias da marinada' }
    ],
    icone: '🍗',
    tom: 'tomato',
    preparacao: 20,
    repouso: 60,
    cozedura: 30,
    porcoes: 4,
    dificuldade: 'medio',
    ingredientes: [
      { titulo: 'Marinada', itens: [
        { q: 700, u: 'g', n: 'peito de frango, em cubos' },
        { q: 150, u: 'g', n: 'iogurte natural' },
        { q: 2, u: 'colher de chá', up: 'colheres de chá', n: 'garam masala' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'cominho em pó' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'açafrão-da-índia (cúrcuma)' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'paprika doce' },
        { q: 1, u: 'colher de sopa', up: 'colheres de sopa', n: 'sumo de limão' },
        { q: null, n: 'sal' }
      ]},
      { titulo: 'Molho', itens: [
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'óleo' },
        { q: 1, u: '', n: 'cebolas grandes', ns: 'cebola grande', inteiro: true },
        { q: 3, u: 'dente', up: 'dentes', n: 'alho', inteiro: true },
        { q: 1, u: 'colher de sopa', up: 'colheres de sopa', n: 'gengibre ralado' },
        { q: 400, u: 'g', n: 'tomate triturado' },
        { q: 150, u: 'ml', n: 'natas' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'garam masala' },
        { q: null, n: 'coentros frescos' }
      ]},
      { titulo: 'Para servir', itens: [
        { q: 300, u: 'g', n: 'arroz basmati' }
      ]}
    ],
    passos: [
      { t: 'Marinar o frango',
        x: 'Mistura o iogurte com o garam masala, o cominho, a cúrcuma, a paprika, o limão e uma pitada de sal. Junta o frango, envolve bem e deixa marinar no frigorífico pelo menos 1 hora.' },
      { t: 'Selar o frango',
        x: 'Numa frigideira bem quente, sela o frango em lotes, 3 a 4 minutos, até ganhar cor. Reserva (não precisa de ficar cozido por dentro).' },
      { t: 'Fazer o molho',
        x: 'Na mesma frigideira, refoga a cebola picada no óleo 8 minutos. Junta o alho e o gengibre e cozinha mais 1 minuto. Acrescenta o tomate e deixa ferver 10 minutos.' },
      { t: 'Cozinhar tudo',
        x: 'Junta o frango, as natas e o garam masala. Cozinha em lume brando 10 minutos, até o frango estar cozido e o molho ligado.' },
      { t: 'Servir',
        x: 'Cozinha o arroz basmati conforme a embalagem. Serve o frango com o molho, salpicado com coentros.' }
    ],
    dicas: [
      { t: 'Marinada mais longa', x: 'Se tiveres tempo, marina de um dia para o outro. O frango fica mais macio e saboroso.' },
      { t: 'Sabor fumado', x: 'Sela o frango em lume bem forte para ganhar aquele sabor tostado típico do tikka.' },
      { t: 'Picante à medida', x: 'Para mais calor, junta uma pitada de pimenta de caiena ou uma malagueta ao molho.' },
      { t: 'Natas por iogurte', x: 'Para uma versão mais leve, troca as natas por iogurte grego, juntando-o fora do lume para não talhar.' }
    ],
    nutricao: { calorias: 690, proteina: 49, hidratos: 70, acucares: 8, gordura: 22, saturada: 10, fibra: 4, sal: 1.5 }
  },

  /* 24. CHOCOLATE QUENTE À ESPANHOLA (espanhola, bebidas) */
  {
    id: 'chocolate-quente-a-espanhola',
    titulo: 'Chocolate quente à espanhola',
    descricao: 'Chocolate espesso e sedoso, feito para mergulhar churros ou beber à colher.',
    categoria: { pais: 'espanhola', tipo: 'bebidas' },
    alimento: ['vegetariano'],
    dieta: ['sem-gluten'],
    imagem: criarImagem('☕', 'plum', 'Chávena de chocolate quente espesso'),
    galeria: [
      { emoji: '☕', tom: 'plum',   alt: 'Chávena de chocolate quente espesso' },
      { emoji: '🍫', tom: 'orange', alt: 'Chocolate negro para derreter' }
    ],
    icone: '☕',
    tom: 'plum',
    preparacao: 5,
    cozedura: 10,
    porcoes: 2,
    porcaoNome: 'chávena',
    dificuldade: 'facil',
    ingredientes: [
      { titulo: '', itens: [
        { q: 500, u: 'ml', n: 'leite' },
        { q: 100, u: 'g', n: 'chocolate negro (70 % de cacau), em pedaços' },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'amido de milho' },
        { q: 2, u: 'colher de sopa', up: 'colheres de sopa', n: 'açúcar' },
        { q: null, n: 'canela em pó' }
      ]}
    ],
    passos: [
      { t: 'Desfazer o amido',
        x: 'Dissolve o amido de milho em meio copo de leite frio, mexendo até não ficarem grumos.' },
      { t: 'Aquecer',
        x: 'Aquece o restante leite com o açúcar em lume médio, até começar a largar vapor, sem ferver.' },
      { t: 'Juntar o chocolate',
        x: 'Junta o chocolate e mexe até derreter por completo. Acrescenta o leite com amido.' },
      { t: 'Engrossar',
        x: 'Cozinha em lume brando 3 a 5 minutos, sempre a mexer, até o chocolate ficar espesso. Serve de imediato com uma pitada de canela.' }
    ],
    dicas: [
      { t: 'Textura à medida', x: 'Para mais espesso, usa mais amido. Para mais fluido, usa menos.' },
      { t: 'Mexe sempre', x: 'O amido assenta e queima facilmente no fundo do tacho. Mexe com uma vara de arames.' },
      { t: 'Churros', x: 'É o acompanhamento clássico. Serve logo, porque espessa ao arrefecer.' }
    ],
    nutricao: { calorias: 410, proteina: 11, hidratos: 48, acucares: 37, gordura: 20, saturada: 12, fibra: 4, sal: 0.3 }
  },

  /* 25. TORTILHA ESPANHOLA (espanhola, pratos principais) */
  {
    id: 'tortilha-espanhola',
    titulo: 'Tortilha espanhola',
    descricao: 'Omelete grossa de batata e cebola, dourada por fora e cremosa por dentro.',
    categoria: { pais: 'espanhola', tipo: 'pratos-principais' },
    alimento: ['vegetariano'],
    dieta: ['sem-gluten', 'sem-lactose'],
    imagem: criarImagem('🍳', 'lemon', 'Tortilha espanhola cortada em fatias'),
    galeria: [
      { emoji: '🍳', tom: 'lemon',  alt: 'Tortilha espanhola cortada em fatias' },
      { emoji: '🥔', tom: 'orange', alt: 'Batata em fatias finas' },
      { emoji: '🧅', tom: 'plum',   alt: 'Cebola em tiras' }
    ],
    icone: '🍳',
    tom: 'lemon',
    preparacao: 15,
    cozedura: 25,
    porcoes: 4,
    dificuldade: 'medio',
    ingredientes: [
      { titulo: '', itens: [
        { q: 500, u: 'g', n: 'batata' },
        { q: 1, u: '', n: 'cebolas', ns: 'cebola', inteiro: true },
        { q: 6, u: '', n: 'ovos', ns: 'ovo', inteiro: true },
        { q: 150, u: 'ml', n: 'azeite, para fritar' },
        { q: null, n: 'sal' }
      ]}
    ],
    passos: [
      { t: 'Cortar',
        x: 'Descasca as batatas e corta-as em fatias finas. Corta a cebola em tiras finas.' },
      { t: 'Cozinhar a batata',
        x: 'Aquece o azeite numa frigideira antiaderente de 24 cm. Junta a batata e a cebola, tempera com sal e cozinha em lume médio-baixo 15 a 20 minutos, mexendo de vez em quando, até estarem macias e sem cor.' },
      { t: 'Misturar com o ovo',
        x: 'Bate os ovos com uma pitada de sal. Escorre a batata do azeite e mistura-a com os ovos. Deixa repousar 5 minutos.' },
      { t: 'Cozinhar de um lado',
        x: 'Aquece uma colher de azeite na frigideira e verte a mistura. Cozinha em lume médio 4 a 5 minutos, até a base estar dourada e firme.' },
      { t: 'Virar',
        x: 'Cobre com um prato grande, vira de uma só vez, e desliza a tortilha de volta para a frigideira. Cozinha mais 3 a 4 minutos do outro lado. Serve morna ou fria.' }
    ],
    dicas: [
      { t: 'Cremosa por dentro', x: 'Para uma tortilha mais mal passada, reduz o tempo do segundo lado para 2 minutos.' },
      { t: 'Batata a nadar', x: 'Cozinha a batata em lume baixo, sem a deixar fritar com cor. O azeite escorrido pode ser guardado e usado de novo.' },
      { t: 'Virar sem acidentes', x: 'Usa um prato maior do que a frigideira e vira sobre o lava-loiça, para o caso de escorrer.' },
      { t: 'Com ou sem cebola', x: 'A discussão é antiga. Experimenta das duas formas e vê qual preferes.' }
    ],
    nutricao: { calorias: 410, proteina: 14, hidratos: 28, acucares: 3, gordura: 27, saturada: 5, fibra: 3, sal: 0.8 }
  },

  /* 26. OMELETE DE ESPINAFRES (francesa, pequeno-almoço) */
  {
    id: 'omelete-de-espinafres',
    titulo: 'Omelete de espinafres',
    descricao: 'Omelete fofa e rápida, recheada com espinafres salteados e queijo fresco.',
    categoria: { pais: 'francesa', tipo: 'pequeno-almoco' },
    alimento: ['vegetariano'],
    dieta: ['sem-gluten', 'low-carb', 'fitness', 'rica-em-proteina'],
    imagem: criarImagem('🥬', 'basil', 'Omelete dobrada com espinafres'),
    galeria: [
      { emoji: '🥬', tom: 'basil',  alt: 'Omelete dobrada com espinafres' },
      { emoji: '🥚', tom: 'lemon',  alt: 'Ovos batidos' }
    ],
    icone: '🥬',
    tom: 'basil',
    preparacao: 5,
    cozedura: 10,
    porcoes: 1,
    dificuldade: 'facil',
    ingredientes: [
      { titulo: '', itens: [
        { q: 3, u: '', n: 'ovos', ns: 'ovo', inteiro: true },
        { q: 100, u: 'g', n: 'espinafres frescos' },
        { q: 30, u: 'g', n: 'queijo fresco, desfeito' },
        { q: 1, u: 'colher de chá', up: 'colheres de chá', n: 'manteiga ou azeite' },
        { q: null, n: 'sal e pimenta' }
      ]}
    ],
    passos: [
      { t: 'Saltear os espinafres',
        x: 'Aquece metade da gordura numa frigideira antiaderente e salteia os espinafres 1 a 2 minutos, até murcharem. Tempera, retira e escorre o excesso de água.' },
      { t: 'Bater os ovos',
        x: 'Bate os ovos com uma pitada de sal e pimenta.' },
      { t: 'Cozinhar',
        x: 'Na mesma frigideira, aquece o resto da gordura em lume médio. Verte os ovos e, com uma espátula, puxa as bordas para o centro, inclinando a frigideira, até estar quase firme, mas ainda húmida.' },
      { t: 'Rechear e dobrar',
        x: 'Distribui os espinafres e o queijo sobre metade da omelete, dobra a outra metade por cima e deixa 1 minuto. Serve de imediato.' }
    ],
    dicas: [
      { t: 'Lume médio', x: 'Lume demasiado forte deixa a omelete seca e com cor. Queres um amarelo suave por fora.' },
      { t: 'Espinafres bem escorridos', x: 'O excesso de água é o inimigo: faz a omelete rasgar e ficar aguada.' },
      { t: 'Variações', x: 'Troca o queijo fresco por queijo de cabra ou junta cogumelos salteados.' }
    ],
    nutricao: { calorias: 290, proteina: 24, hidratos: 3, acucares: 1.5, gordura: 20, saturada: 8, fibra: 2, sal: 1.2 }
  },
  /* 27. CALDO VERDE (portuguesa, entradas) */
  {
    id: "caldo-verde",
    titulo: "Caldo verde",
    descricao: "A sopa portuguesa por excelência: batata cremosa, couve em tiras finas e rodelas de chouriço.",
    categoria: { pais: "portuguesa", tipo: "entradas" },
    alimento: ["sopas"],
    dieta: ["sem-gluten", "sem-lactose"],
    imagem: criarImagem("🥬", "basil", "Prato de caldo verde com rodelas de chouriço"),
    galeria: [
      { emoji: "🥬", tom: "basil", alt: "Prato de caldo verde com rodelas de chouriço" },
      { emoji: "🍴", tom: "lemon", alt: "Couve galega cortada em tiras finas" }
    ],
    icone: "🥬",
    tom: "basil",
    preparacao: 15,
    cozedura: 30,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 600, "u": "g", "n": "batatas"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 2, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 1200, "u": "ml", "n": "água"},
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 200, "u": "g", "n": "couve galega, em tiras finas"},
        {"q": 100, "u": "g", "n": "chouriço, em rodelas"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Cozer a base",
        x: "Descasca e corta as batatas em pedaços. Coze-as numa panela com a cebola picada, o alho, a água e uma pitada de sal, durante 20 minutos, até ficarem bem moles." },
      { t: "Triturar",
        x: "Tritura tudo com a varinha mágica, juntando metade do azeite, até obteres um creme liso e fino." },
      { t: "Juntar a couve",
        x: "Leva o creme de novo ao lume, junta a couve em tiras muito finas e deixa ferver 5 a 7 minutos, até ficar tenra mas ainda verde." },
      { t: "Servir",
        x: "Serve em pratos fundos, com algumas rodelas de chouriço e um fio do azeite restante." }
    ],
    dicas: [
      { t: "Couve bem fina", x: "Enrola as folhas e corta-as o mais fino que conseguires. Quanto mais fina, mais tenra fica e melhor se mistura com o creme." },
      { t: "Verde vivo", x: "Não cozas a couve demasiado tempo, senão perde a cor e fica amarga." },
      { t: "Versão vegetariana", x: "Troca o chouriço por umas rodelas de batata assada ou por grão-de-bico tostado." }
    ],
    nutricao: { calorias: 230, proteina: 8, hidratos: 22, acucares: 2, gordura: 12, saturada: 3, fibra: 5, sal: 1.4 }
  },
  /* 28. PASTEL DE NATA (portuguesa, sobremesas) */
  {
    id: "pastel-de-nata",
    titulo: "Pastel de nata",
    descricao: "Massa folhada estaladiça com um creme de ovos suave, queimado por cima. Um clássico das pastelarias portuguesas.",
    categoria: { pais: "portuguesa", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🥧", "lemon", "Pastéis de nata acabados de sair do forno"),
    galeria: [
      { emoji: "🥧", tom: "lemon", alt: "Pastéis de nata acabados de sair do forno" },
      { emoji: "🍴", tom: "lemon", alt: "Creme de ovos a encher as formas" }
    ],
    icone: "🥧",
    tom: "lemon",
    preparacao: 40,
    cozedura: 20,
    repouso: 30,
    porcoes: 12,
    porcaoNome: "pastel",
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Massa", itens: [
        {"q": 1, "u": "", "n": "rolos de massa folhada (cerca de 250 g)", "ns": "rolo de massa folhada (cerca de 250 g)", "inteiro": true}
      ]},
      { titulo: "Creme", itens: [
        {"q": 250, "u": "ml", "n": "leite"},
        {"q": 25, "u": "g", "n": "farinha"},
        {"q": 150, "u": "g", "n": "açúcar"},
        {"q": 80, "u": "ml", "n": "água"},
        {"q": 4, "u": "", "n": "gemas de ovo", "ns": "gema de ovo", "inteiro": true},
        {"q": 1, "u": "", "n": "paus de canela", "ns": "pau de canela", "inteiro": true},
        {"q": 1, "u": "", "n": "tiras de casca de limão", "ns": "tira de casca de limão", "inteiro": true}
      ]}
    ],
    passos: [
      { t: "Preparar a massa",
        x: "Pré-aquece o forno a 250 °C. Enrola a massa folhada em rolo, corta em 12 rodelas e forra com elas formas de queques untadas, pressionando com o polegar contra as paredes." },
      { t: "Fazer o xarope",
        x: "Leva ao lume o açúcar, a água, o pau de canela e a casca de limão e deixa ferver 5 minutos, sem mexer. Retira a canela e o limão." },
      { t: "Fazer o creme",
        x: "Dissolve a farinha em metade do leite frio, junta o resto do leite e leva ao lume brando, mexendo, até engrossar. Junta o xarope em fio e deixa arrefecer um pouco. Mistura as gemas." },
      { t: "Encher e cozer",
        x: "Enche as formas até dois terços com o creme. Coze 12 a 15 minutos, até a massa estar dourada e o creme com manchas escuras por cima." },
      { t: "Servir",
        x: "Deixa arrefecer 5 minutos e serve morno, com canela em pó e açúcar em pó a gosto." }
    ],
    dicas: [
      { t: "Forno bem quente", x: "A temperatura alta é o segredo das manchas escuras típicas. Se o teu forno chegar mais acima, usa-o." },
      { t: "Massa fria", x: "Trabalha a massa folhada fria. Se aquecer e amolecer, volta a pôr no frigorífico 10 minutos." },
      { t: "Melhor no próprio dia", x: "Perdem o estaladiço ao fim de algumas horas. Para os reavivar, aquece-os 5 minutos no forno." }
    ],
    nutricao: { calorias: 190, proteina: 3, hidratos: 22, acucares: 12, gordura: 10, saturada: 5, fibra: 0.5, sal: 0.1 }
  },
  /* 29. BACALHAU À BRÁS (portuguesa, pratos-principais) */
  {
    id: "bacalhau-a-bras",
    titulo: "Bacalhau à Brás",
    descricao: "Bacalhau desfiado com cebola, batata palha e ovos cremosos. Um prato rápido e muito querido.",
    categoria: { pais: "portuguesa", tipo: "pratos-principais" },
    alimento: ["peixe-e-marisco"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍳", "lemon", "Prato de bacalhau à Brás com salsa e azeitonas"),
    galeria: [
      { emoji: "🍳", tom: "lemon", alt: "Prato de bacalhau à Brás com salsa e azeitonas" },
      { emoji: "🍴", tom: "lemon", alt: "Batata palha dourada" }
    ],
    icone: "🍳",
    tom: "lemon",
    preparacao: 20,
    cozedura: 20,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 400, "u": "g", "n": "bacalhau demolhado e desfiado"},
        {"q": 200, "u": "g", "n": "batata palha"},
        {"q": 2, "u": "", "n": "cebolas grandes", "ns": "cebola grande", "inteiro": true},
        {"q": 2, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 6, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": null, "n": "salsa picada"},
        {"q": null, "n": "azeitonas pretas"},
        {"q": null, "n": "pimenta"}
      ]}
    ],
    passos: [
      { t: "Refogar",
        x: "Aquece o azeite numa frigideira larga e refoga a cebola em meias-luas e o alho picado em lume médio durante 10 minutos, até ficarem macios." },
      { t: "Juntar o bacalhau",
        x: "Junta o bacalhau bem escorrido e mexe 5 minutos, para ganhar sabor. Tempera com pimenta." },
      { t: "Juntar a batata palha",
        x: "Mistura a batata palha, reservando um pouco para decorar." },
      { t: "Ligar com os ovos",
        x: "Bate os ovos, junta-os à frigideira em lume brando e mexe sem parar, até ficarem cremosos, ainda ligeiramente húmidos." },
      { t: "Servir",
        x: "Serve de imediato, com salsa picada, a batata palha reservada e azeitonas pretas." }
    ],
    dicas: [
      { t: "Bacalhau bem escorrido", x: "O excesso de água faz o prato ficar aguado. Espreme o bacalhau antes de o juntar." },
      { t: "Ovos cremosos", x: "Retira do lume quando os ovos ainda parecem um pouco húmidos. Continuam a cozinhar com o calor do tacho." },
      { t: "Sal com cuidado", x: "O bacalhau e as azeitonas já são salgados. Prova antes de juntar sal." }
    ],
    nutricao: { calorias: 520, proteina: 36, hidratos: 30, acucares: 3, gordura: 31, saturada: 7, fibra: 3, sal: 1.9 }
  },
  /* 30. ARROZ DOCE (portuguesa, sobremesas) */
  {
    id: "arroz-doce",
    titulo: "Arroz doce",
    descricao: "Cremoso, perfumado com limão e canela. A sobremesa das festas e dos domingos em família.",
    categoria: { pais: "portuguesa", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🍚", "lemon", "Travessa de arroz doce com canela em cima"),
    galeria: [
      { emoji: "🍚", tom: "lemon", alt: "Travessa de arroz doce com canela em cima" }
    ],
    icone: "🍚",
    tom: "lemon",
    preparacao: 5,
    cozedura: 40,
    porcoes: 6,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 200, "u": "g", "n": "arroz carolino"},
        {"q": 500, "u": "ml", "n": "água"},
        {"q": 1000, "u": "ml", "n": "leite"},
        {"q": 150, "u": "g", "n": "açúcar"},
        {"q": 1, "u": "", "n": "tiras de casca de limão", "ns": "tira de casca de limão", "inteiro": true},
        {"q": 1, "u": "", "n": "paus de canela", "ns": "pau de canela", "inteiro": true},
        {"q": 3, "u": "", "n": "gemas de ovo", "ns": "gema de ovo", "inteiro": true},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "sal"},
        {"q": null, "n": "canela em pó"}
      ]}
    ],
    passos: [
      { t: "Cozer o arroz",
        x: "Leva ao lume a água com a casca de limão, o pau de canela e o sal. Quando ferver, junta o arroz e cozinha 10 minutos." },
      { t: "Juntar o leite",
        x: "Junta o leite quente aos poucos, mexendo, e cozinha em lume brando 20 minutos, até o arroz estar macio." },
      { t: "Adoçar e ligar",
        x: "Junta o açúcar. Retira um pouco de arroz para um copo, mistura-o com as gemas e volta a juntar tudo, mexendo 2 minutos, sem deixar ferver." },
      { t: "Servir",
        x: "Retira a casca e o pau de canela. Distribui por taças ou travessa e polvilha com canela em pó. Serve morno ou frio." }
    ],
    dicas: [
      { t: "Leite quente", x: "Junta sempre o leite já quente, para o arroz não parar de cozer e ficar bem cremoso." },
      { t: "Gemas sem coalhar", x: "Tempera as gemas com um pouco de arroz quente antes de as juntar, para não talharem." },
      { t: "Fica mais espesso", x: "O arroz doce engrossa ao arrefecer. Se ficar muito espesso, junta um pouco de leite ao reaquecer." }
    ],
    nutricao: { calorias: 380, proteina: 8, hidratos: 62, acucares: 30, gordura: 11, saturada: 6, fibra: 1, sal: 0.2 }
  },
  /* 31. BIFANAS (portuguesa, pratos-principais) */
  {
    id: "bifanas",
    titulo: "Bifanas",
    descricao: "Fatias finas de porco marinadas em vinho e alho, no pão com um pouco de molho. Um petisco de tasca.",
    categoria: { pais: "portuguesa", tipo: "pratos-principais" },
    alimento: ["carne"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🥪", "orange", "Bifana no pão com molho"),
    galeria: [
      { emoji: "🥪", tom: "orange", alt: "Bifana no pão com molho" },
      { emoji: "🍴", tom: "lemon", alt: "Fatias de porco a marinar" }
    ],
    icone: "🥪",
    tom: "orange",
    preparacao: 15,
    cozedura: 20,
    repouso: 240,
    porcoes: 4,
    porcaoNome: "bifana",
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Marinada", itens: [
        {"q": 600, "u": "g", "n": "lombo de porco, em fatias finas"},
        {"q": 4, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 2, "u": "folha", "up": "folhas", "n": "louro"},
        {"q": 200, "u": "ml", "n": "vinho branco"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "colorau"},
        {"q": null, "n": "sal"},
        {"q": null, "n": "pimenta"}
      ]},
      { titulo: "Para servir", itens: [
        {"q": 4, "u": "", "n": "pães", "ns": "pão", "inteiro": true},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"}
      ]}
    ],
    passos: [
      { t: "Marinar",
        x: "Mistura o vinho, o alho picado, o louro, o colorau, sal e pimenta. Junta a carne, envolve bem e deixa marinar no frigorífico, pelo menos 4 horas." },
      { t: "Dourar a carne",
        x: "Aquece o azeite numa frigideira bem quente e frita as fatias, em lotes, 2 a 3 minutos de cada lado, até ficarem douradas." },
      { t: "Fazer o molho",
        x: "Na mesma frigideira, deita a marinada coada e deixa reduzir 5 minutos, até ficar com consistência de molho." },
      { t: "Servir",
        x: "Abre os pães, recheia com a carne e rega com o molho. Serve de imediato." }
    ],
    dicas: [
      { t: "Marinar mais tempo", x: "De um dia para o outro, a carne fica mais saborosa e tenra." },
      { t: "Fatias finas", x: "Pede ao talho para fatiar o lombo bem fino. Assim cozinha depressa e não seca." },
      { t: "Com mostarda", x: "Muita gente gosta de acompanhar com mostarda, e há quem junte uma cerveja gelada." }
    ],
    nutricao: { calorias: 480, proteina: 38, hidratos: 36, acucares: 2, gordura: 20, saturada: 6, fibra: 2, sal: 1.8 }
  },
  /* 32. ESPARGUETE À CARBONARA (italiana, pratos-principais) */
  {
    id: "spaghetti-carbonara",
    titulo: "Esparguete à carbonara",
    descricao: "Massa com bacon crocante e um creme de gemas e queijo, sem natas. Rápida e muito saborosa.",
    categoria: { pais: "italiana", tipo: "pratos-principais" },
    alimento: ["massas"],
    dieta: [],
    imagem: criarImagem("🍝", "lemon", "Prato de esparguete à carbonara com pimenta preta"),
    galeria: [
      { emoji: "🍝", tom: "lemon", alt: "Prato de esparguete à carbonara com pimenta preta" },
      { emoji: "🍴", tom: "lemon", alt: "Queijo ralado e bacon" }
    ],
    icone: "🍝",
    tom: "lemon",
    preparacao: 10,
    cozedura: 15,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 400, "u": "g", "n": "esparguete"},
        {"q": 150, "u": "g", "n": "bacon ou guanciale, em tiras"},
        {"q": 4, "u": "", "n": "gemas de ovo", "ns": "gema de ovo", "inteiro": true},
        {"q": 1, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 80, "u": "g", "n": "queijo pecorino ou parmesão, ralado"},
        {"q": null, "n": "pimenta preta moída na hora"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Cozer a massa",
        x: "Coze o esparguete em água bem salgada, até ficar al dente. Reserva uma chávena da água da cozedura antes de escorrer." },
      { t: "Dourar o bacon",
        x: "Numa frigideira larga, sem gordura, frita o bacon em lume médio, até ficar dourado e crocante. Retira do lume." },
      { t: "Fazer o creme",
        x: "Numa taça, mistura as gemas, o ovo, o queijo ralado e muita pimenta preta." },
      { t: "Juntar tudo",
        x: "Junta o esparguete escorrido ao bacon, fora do lume. Deita o creme de ovos e mexe depressa, juntando um pouco da água da massa até ficar cremoso." },
      { t: "Servir",
        x: "Serve de imediato, com mais queijo e pimenta." }
    ],
    dicas: [
      { t: "Fora do lume", x: "Os ovos não podem ir ao lume, senão coalham. O calor da massa chega para os cozinhar." },
      { t: "Água da massa", x: "O amido da água da cozedura liga o creme e deixa-o brilhante. Junta aos poucos." },
      { t: "Sem natas", x: "A receita original não leva natas. O creme vem só dos ovos e do queijo." }
    ],
    nutricao: { calorias: 690, proteina: 29, hidratos: 75, acucares: 3, gordura: 29, saturada: 10, fibra: 3, sal: 1.6 }
  },
  /* 33. PIZZA MARGHERITA (italiana, pratos-principais) */
  {
    id: "pizza-margherita",
    titulo: "Pizza margherita",
    descricao: "Massa fina e fofa, molho de tomate, mozzarella derretida e manjericão. A pizza clássica de Nápoles.",
    categoria: { pais: "italiana", tipo: "pratos-principais" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🍕", "tomato", "Pizza margherita com manjericão fresco"),
    galeria: [
      { emoji: "🍕", tom: "tomato", alt: "Pizza margherita com manjericão fresco" },
      { emoji: "🍴", tom: "lemon", alt: "Mozzarella fresca em pedaços" }
    ],
    icone: "🍕",
    tom: "tomato",
    preparacao: 20,
    cozedura: 12,
    repouso: 90,
    porcoes: 2,
    porcaoNome: "pizza",
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Massa", itens: [
        {"q": 300, "u": "g", "n": "farinha de trigo forte"},
        {"q": 190, "u": "ml", "n": "água morna"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "fermento de padeiro seco"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "sal"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"}
      ]},
      { titulo: "Cobertura", itens: [
        {"q": 200, "u": "g", "n": "tomate triturado"},
        {"q": 250, "u": "g", "n": "mozzarella, em pedaços"},
        {"q": null, "n": "folhas de manjericão fresco"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Fazer a massa",
        x: "Mistura a farinha, o fermento e o sal. Junta a água e o azeite e amassa 10 minutos, até a massa ficar lisa e elástica." },
      { t: "Deixar levedar",
        x: "Tapa a massa e deixa levedar num local morno cerca de 1 h 30, até duplicar de volume." },
      { t: "Esticar",
        x: "Pré-aquece o forno ao máximo (250 °C), com um tabuleiro lá dentro. Divide a massa em duas e estica cada bola em disco fino, com as mãos, sem rolo." },
      { t: "Cobrir",
        x: "Espalha o tomate temperado com uma pitada de sal sobre cada disco, deixando a borda livre. Distribui a mozzarella." },
      { t: "Cozer",
        x: "Coze 10 a 12 minutos, até a borda estar dourada e o queijo derretido. Serve com manjericão fresco e um fio de azeite." }
    ],
    dicas: [
      { t: "Forno muito quente", x: "Quanto mais quente o forno, mais fofa e estaladiça fica a massa. Aquece o tabuleiro antes." },
      { t: "Mozzarella escorrida", x: "Escorre e seca bem a mozzarella com papel de cozinha, para não deixar a pizza aguada." },
      { t: "Sem rolo", x: "Esticar com as mãos mantém o ar na massa, e a borda fica fofa." }
    ],
    nutricao: { calorias: 640, proteina: 28, hidratos: 85, acucares: 6, gordura: 21, saturada: 10, fibra: 5, sal: 2.0 }
  },
  /* 34. PANNA COTTA (italiana, sobremesas) */
  {
    id: "panna-cotta",
    titulo: "Panna cotta",
    descricao: "Creme de natas macio e tremido, com calda de frutos vermelhos. Uma sobremesa elegante e sem forno.",
    categoria: { pais: "italiana", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🍮", "plum", "Panna cotta com calda de frutos vermelhos"),
    galeria: [
      { emoji: "🍮", tom: "plum", alt: "Panna cotta com calda de frutos vermelhos" },
      { emoji: "🍴", tom: "lemon", alt: "Frutos vermelhos frescos" }
    ],
    icone: "🍮",
    tom: "plum",
    preparacao: 10,
    cozedura: 10,
    repouso: 240,
    porcoes: 6,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Creme", itens: [
        {"q": 500, "u": "ml", "n": "natas"},
        {"q": 200, "u": "ml", "n": "leite"},
        {"q": 80, "u": "g", "n": "açúcar"},
        {"q": 3, "u": "folha", "up": "folhas", "n": "gelatina em folhas"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "extrato de baunilha"}
      ]},
      { titulo: "Calda", itens: [
        {"q": 200, "u": "g", "n": "frutos vermelhos"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "sumo de limão"}
      ]}
    ],
    passos: [
      { t: "Hidratar a gelatina",
        x: "Coloca as folhas de gelatina numa taça com água fria durante 5 minutos, até ficarem moles." },
      { t: "Aquecer",
        x: "Leva ao lume as natas, o leite e o açúcar, mexendo, até começar a fumegar, sem ferver. Retira do lume." },
      { t: "Juntar a gelatina",
        x: "Escorre a gelatina, junta-a ao creme quente com a baunilha e mexe até se dissolver por completo." },
      { t: "Moldar e arrefecer",
        x: "Distribui por taças ou formas e deixa arrefecer. Leva ao frigorífico pelo menos 4 horas." },
      { t: "Fazer a calda",
        x: "Coze os frutos vermelhos com o açúcar e o limão 5 minutos, até ficarem com consistência de calda. Deixa arrefecer e serve sobre a panna cotta." }
    ],
    dicas: [
      { t: "Sem ferver", x: "Se as natas ferverem, o creme pode ficar com sabor a queimado. Retira do lume mal comece a fumegar." },
      { t: "Gelatina certa", x: "Demasiada gelatina deixa o creme duro. Procura uma textura que trema ao abanar." },
      { t: "Desenformar", x: "Para desenformar, mergulha a forma 5 segundos em água quente e vira sobre o prato." }
    ],
    nutricao: { calorias: 380, proteina: 4, hidratos: 28, acucares: 27, gordura: 28, saturada: 17, fibra: 0.5, sal: 0.1 }
  },
  /* 35. BRUSCHETTA DE TOMATE (italiana, entradas) */
  {
    id: "bruschetta",
    titulo: "Bruschetta de tomate",
    descricao: "Pão tostado esfregado com alho e coberto com tomate maduro, manjericão e azeite. Simples e fresca.",
    categoria: { pais: "italiana", tipo: "entradas" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍅", "tomato", "Bruschetta de tomate com manjericão"),
    galeria: [
      { emoji: "🍅", tom: "tomato", alt: "Bruschetta de tomate com manjericão" },
      { emoji: "🍴", tom: "lemon", alt: "Tomates maduros em cubos" }
    ],
    icone: "🍅",
    tom: "tomato",
    preparacao: 15,
    cozedura: 5,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 8, "u": "fatia", "up": "fatias", "n": "pão rústico"},
        {"q": 4, "u": "", "n": "tomates maduros", "ns": "tomate maduro", "inteiro": true},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 1, "u": "mão-cheia", "up": "mãos-cheias", "n": "folhas de manjericão"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "vinagre balsâmico"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Preparar o tomate",
        x: "Corta os tomates em cubos pequenos, sem sementes, e coloca-os numa taça. Tempera com o azeite, o vinagre, o sal e o manjericão rasgado. Deixa repousar 10 minutos." },
      { t: "Tostar o pão",
        x: "Tosta as fatias de pão no forno, na torradeira ou numa frigideira, até ficarem douradas e estaladiças." },
      { t: "Dar sabor ao pão",
        x: "Esfrega o dente de alho cortado ao meio, em cada fatia ainda quente." },
      { t: "Servir",
        x: "Cobre com o tomate temperado, com um pouco do seu molho, e serve de imediato." }
    ],
    dicas: [
      { t: "Tomate maduro", x: "O sabor depende do tomate. Usa tomates bem maduros e, se puderes, da época." },
      { t: "Servir logo", x: "Cobre o pão só no momento de servir, para ele não amolecer." },
      { t: "Variações", x: "Junta mozzarella, anchovas ou um fio de pesto, se quiseres uma versão mais rica." }
    ],
    nutricao: { calorias: 190, proteina: 5, hidratos: 28, acucares: 4, gordura: 7, saturada: 1, fibra: 3, sal: 0.9 }
  },
  /* 36. BRIGADEIRO (brasileira, sobremesas) */
  {
    id: "brigadeiro",
    titulo: "Brigadeiro",
    descricao: "Docinhos de chocolate cremosos, enrolados em granulado. A festa de aniversário brasileira em cada trufa.",
    categoria: { pais: "brasileira", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🍫", "orange", "Brigadeiros cobertos de granulado de chocolate"),
    galeria: [
      { emoji: "🍫", tom: "orange", alt: "Brigadeiros cobertos de granulado de chocolate" }
    ],
    icone: "🍫",
    tom: "orange",
    preparacao: 10,
    cozedura: 15,
    repouso: 60,
    porcoes: 20,
    porcaoNome: "brigadeiro",
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 1, "u": "lata", "up": "latas", "n": "leite condensado (395 g)"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "cacau em pó"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "manteiga"},
        {"q": 100, "u": "g", "n": "chocolate granulado"}
      ]}
    ],
    passos: [
      { t: "Cozinhar",
        x: "Num tacho de fundo grosso, mistura o leite condensado, o cacau e a manteiga. Cozinha em lume médio-baixo, mexendo sempre." },
      { t: "Ponto certo",
        x: "Quando, ao passares a colher pelo fundo, vires o fundo do tacho durante 2 a 3 segundos, está no ponto. Demora uns 10 a 15 minutos." },
      { t: "Arrefecer",
        x: "Passa para um prato untado com manteiga e deixa arrefecer, cerca de 1 hora." },
      { t: "Enrolar",
        x: "Com as mãos untadas, tira pequenas porções, enrola em bolinhas e passa pelo granulado. Serve em formas de papel." }
    ],
    dicas: [
      { t: "Mexer sempre", x: "Se não mexeres, o fundo queima e o brigadeiro fica com sabor amargo." },
      { t: "Mãos untadas", x: "Passar manteiga nas mãos evita que a massa cole ao enrolar." },
      { t: "Conservação", x: "Guarda no frigorífico até 5 dias. Tira 15 minutos antes de servir." }
    ],
    nutricao: { calorias: 95, proteina: 1.5, hidratos: 15, acucares: 14, gordura: 3.5, saturada: 2, fibra: 0.5, sal: 0.03 }
  },
  /* 37. PUDIM DE LEITE CONDENSADO (brasileira, sobremesas) */
  {
    id: "pudim-de-leite",
    titulo: "Pudim de leite condensado",
    descricao: "Pudim denso e sedoso, com calda de caramelo. A sobremesa mais clássica do Brasil.",
    categoria: { pais: "brasileira", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🍮", "orange", "Fatia de pudim com calda de caramelo"),
    galeria: [
      { emoji: "🍮", tom: "orange", alt: "Fatia de pudim com calda de caramelo" },
      { emoji: "🍴", tom: "lemon", alt: "Ovos e leite condensado" }
    ],
    icone: "🍮",
    tom: "orange",
    preparacao: 15,
    cozedura: 60,
    repouso: 240,
    porcoes: 8,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Calda", itens: [
        {"q": 150, "u": "g", "n": "açúcar"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "água"}
      ]},
      { titulo: "Pudim", itens: [
        {"q": 1, "u": "lata", "up": "latas", "n": "leite condensado (395 g)"},
        {"q": 400, "u": "ml", "n": "leite"},
        {"q": 3, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true}
      ]}
    ],
    passos: [
      { t: "Fazer o caramelo",
        x: "Leva o açúcar e a água ao lume numa forma de pudim (ou tacho), sem mexer, até ficar dourado escuro. Espalha bem pelo fundo e pelas paredes da forma." },
      { t: "Fazer a mistura",
        x: "Bate no liquidificador o leite condensado, o leite e os ovos, durante 1 minuto. Passa por um passador fino." },
      { t: "Cozer em banho-maria",
        x: "Deita a mistura na forma, tapa com papel de alumínio e coloca num tabuleiro com água quente. Coze a 180 °C durante 60 minutos." },
      { t: "Arrefecer",
        x: "Deixa arrefecer e leva ao frigorífico pelo menos 4 horas." },
      { t: "Desenformar",
        x: "Passa uma faca pelo contorno, vira sobre um prato e deixa a calda escorrer." }
    ],
    dicas: [
      { t: "Passar a mistura", x: "Passar por um passador fino evita bolhinhas e pedaços de clara, e o pudim fica lisinho." },
      { t: "Banho-maria", x: "A água quente à volta evita que o pudim cozinhe depressa demais e fique com buraquinhos." },
      { t: "Caramelo escuro", x: "Não deixes o caramelo passar do dourado escuro, ou fica amargo. Retira do lume logo." }
    ],
    nutricao: { calorias: 270, proteina: 7, hidratos: 40, acucares: 38, gordura: 9, saturada: 5, fibra: 0, sal: 0.2 }
  },
  /* 38. SOPA DE MISO (japonesa, entradas) */
  {
    id: "sopa-de-miso",
    titulo: "Sopa de miso",
    descricao: "Caldo japonês leve, com tofu e alga, pronto em 15 minutos. Reconfortante e cheio de sabor.",
    categoria: { pais: "japonesa", tipo: "entradas" },
    alimento: ["sopas"],
    dieta: ["sem-lactose", "low-carb"],
    imagem: criarImagem("🍜", "sky", "Tigela de sopa de miso com tofu e cebolinho"),
    galeria: [
      { emoji: "🍜", tom: "sky", alt: "Tigela de sopa de miso com tofu e cebolinho" },
      { emoji: "🍴", tom: "lemon", alt: "Cubos de tofu" }
    ],
    icone: "🍜",
    tom: "sky",
    preparacao: 5,
    cozedura: 10,
    porcoes: 2,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 600, "u": "ml", "n": "água"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "dashi em pó"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "pasta de miso"},
        {"q": 150, "u": "g", "n": "tofu firme, em cubos"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "alga wakame seca"},
        {"q": null, "n": "cebolinho picado"}
      ]}
    ],
    passos: [
      { t: "Fazer o caldo",
        x: "Leva ao lume a água com o dashi em pó até começar a ferver." },
      { t: "Juntar a alga e o tofu",
        x: "Reduz o lume, junta o wakame (que incha em poucos minutos) e o tofu em cubos e deixa 3 minutos." },
      { t: "Dissolver o miso",
        x: "Retira do lume. Dissolve o miso numa concha de caldo e volta a deitá-lo na panela." },
      { t: "Servir",
        x: "Serve de imediato, polvilhada com cebolinho." }
    ],
    dicas: [
      { t: "Não ferver o miso", x: "Se o miso ferver, perde aroma e propriedades. Junta-o sempre fora do lume." },
      { t: "Tipo de miso", x: "O miso claro é mais suave. O escuro é mais intenso e salgado." },
      { t: "Versão vegetariana", x: "O dashi tradicional leva peixe. Usa dashi de alga kombu para uma sopa vegetariana." }
    ],
    nutricao: { calorias: 80, proteina: 6, hidratos: 6, acucares: 1, gordura: 3.5, saturada: 0.5, fibra: 1.5, sal: 2.8 }
  },
  /* 39. ONIGIRI DE ATUM (japonesa, entradas) */
  {
    id: "onigiri",
    titulo: "Onigiri de atum",
    descricao: "Bolinhas de arroz em forma de triângulo, recheadas com atum e envolvidas em alga. O lanche japonês por excelência.",
    categoria: { pais: "japonesa", tipo: "entradas" },
    alimento: ["arroz", "peixe-e-marisco"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍙", "sky", "Onigiri triangulares envolvidos em alga nori"),
    galeria: [
      { emoji: "🍙", tom: "sky", alt: "Onigiri triangulares envolvidos em alga nori" },
      { emoji: "🍴", tom: "lemon", alt: "Atum com maionese para o recheio" }
    ],
    icone: "🍙",
    tom: "sky",
    preparacao: 20,
    cozedura: 20,
    porcoes: 4,
    porcaoNome: "onigiri",
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 300, "u": "g", "n": "arroz de sushi"},
        {"q": 360, "u": "ml", "n": "água"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "sal"},
        {"q": 1, "u": "lata", "up": "latas", "n": "atum ao natural (120 g), escorrido"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "maionese"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "molho de soja"},
        {"q": 2, "u": "folha", "up": "folhas", "n": "alga nori"}
      ]}
    ],
    passos: [
      { t: "Cozer o arroz",
        x: "Lava o arroz em várias águas, até a água sair quase limpa. Coze com a água, tapado, em lume brando 15 minutos. Deixa repousar 10 minutos." },
      { t: "Fazer o recheio",
        x: "Mistura o atum com a maionese e o molho de soja." },
      { t: "Moldar",
        x: "Com as mãos molhadas e um pouco de sal, pega numa porção de arroz, faz uma cova no centro e coloca o recheio. Fecha e molda em triângulo, apertando suavemente." },
      { t: "Envolver",
        x: "Corta as folhas de alga em tiras e envolve a base de cada onigiri. Serve de imediato ou embrulhado em película." }
    ],
    dicas: [
      { t: "Mãos molhadas", x: "Molha as mãos em água com sal. O arroz não cola e fica temperado por fora." },
      { t: "Arroz ainda morno", x: "Molda o arroz enquanto está morno, é mais fácil de trabalhar." },
      { t: "Outros recheios", x: "Fica ótimo com salmão grelhado, ovo cozido ou ameixa em conserva (umeboshi)." }
    ],
    nutricao: { calorias: 260, proteina: 12, hidratos: 48, acucares: 1, gordura: 3, saturada: 0.5, fibra: 1, sal: 1.3 }
  },
  /* 40. QUESADILLAS DE QUEIJO (mexicana, entradas) */
  {
    id: "quesadillas-de-queijo",
    titulo: "Quesadillas de queijo",
    descricao: "Tortilhas douradas, cheias de queijo derretido, pimento e feijão preto. Prontas em 20 minutos.",
    categoria: { pais: "mexicana", tipo: "entradas" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🧀", "lemon", "Quesadillas cortadas em triângulos"),
    galeria: [
      { emoji: "🧀", tom: "lemon", alt: "Quesadillas cortadas em triângulos" },
      { emoji: "🍴", tom: "lemon", alt: "Queijo ralado e pimento" }
    ],
    icone: "🧀",
    tom: "lemon",
    preparacao: 10,
    cozedura: 10,
    porcoes: 4,
    porcaoNome: "quesadilla",
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 4, "u": "", "n": "tortilhas de trigo", "ns": "tortilha de trigo", "inteiro": true},
        {"q": 200, "u": "g", "n": "queijo mozzarella ou cheddar, ralado"},
        {"q": 1, "u": "", "n": "pimentos vermelhos", "ns": "pimento vermelho", "inteiro": true},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 150, "u": "g", "n": "feijão preto cozido, escorrido"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "cominho em pó"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": null, "n": "coentros frescos"}
      ]}
    ],
    passos: [
      { t: "Saltear os legumes",
        x: "Aquece o azeite e salteia a cebola e o pimento em tiras finas 5 minutos. Junta o feijão e o cominho e cozinha mais 2 minutos." },
      { t: "Montar",
        x: "Distribui o queijo sobre metade de cada tortilha, junta os legumes e dobra ao meio." },
      { t: "Dourar",
        x: "Numa frigideira antiaderente seca, dora cada quesadilla 2 a 3 minutos de cada lado, até o queijo derreter e a tortilha ficar crocante." },
      { t: "Servir",
        x: "Corta em triângulos e serve com coentros e, se quiseres, guacamole ou natas azedas." }
    ],
    dicas: [
      { t: "Lume médio", x: "Lume demasiado forte queima a tortilha antes de o queijo derreter." },
      { t: "Queijo que derrete bem", x: "Mozzarella, cheddar ou queijo de ilha derretem bem. Evita queijos muito duros." },
      { t: "Com frango", x: "Junta frango desfiado ao recheio para uma versão mais substancial." }
    ],
    nutricao: { calorias: 380, proteina: 17, hidratos: 34, acucares: 3, gordura: 20, saturada: 10, fibra: 5, sal: 1.0 }
  },
  /* 41. CHILLI CON CARNE (mexicana, pratos-principais) */
  {
    id: "chilli-con-carne",
    titulo: "Chilli con carne",
    descricao: "Carne picada e feijão numa panela de tomate, com especiarias e um toque de picante. Ideal para servir com arroz.",
    categoria: { pais: "mexicana", tipo: "pratos-principais" },
    alimento: ["carne"],
    dieta: ["sem-lactose", "rica-em-proteina"],
    imagem: criarImagem("🌶️", "tomato", "Prato de chilli con carne com arroz"),
    galeria: [
      { emoji: "🌶️", tom: "tomato", alt: "Prato de chilli con carne com arroz" },
      { emoji: "🍴", tom: "lemon", alt: "Feijão encarnado e pimento" }
    ],
    icone: "🌶️",
    tom: "tomato",
    preparacao: 15,
    cozedura: 50,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "", "n": "cebolas grandes", "ns": "cebola grande", "inteiro": true},
        {"q": 2, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 500, "u": "g", "n": "carne de vaca picada"},
        {"q": 1, "u": "", "n": "pimentos vermelhos", "ns": "pimento vermelho", "inteiro": true},
        {"q": 2, "u": "colher de chá", "up": "colheres de chá", "n": "cominho em pó"},
        {"q": 2, "u": "colher de chá", "up": "colheres de chá", "n": "paprika fumada"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "piri-piri em pó"},
        {"q": 400, "u": "g", "n": "tomate triturado"},
        {"q": 1, "u": "lata", "up": "latas", "n": "feijão encarnado, escorrido (cerca de 400 g)"},
        {"q": 200, "u": "ml", "n": "água"},
        {"q": null, "n": "sal"}
      ]},
      { titulo: "Para servir", itens: [
        {"q": 300, "u": "g", "n": "arroz"},
        {"q": null, "n": "coentros frescos"}
      ]}
    ],
    passos: [
      { t: "Refogar",
        x: "Aquece o azeite numa panela e refoga a cebola picada e o alho 5 minutos. Junta o pimento em cubos e cozinha mais 3 minutos." },
      { t: "Dourar a carne",
        x: "Junta a carne picada e desfaz-a com uma colher de pau. Mexe até perder a cor rosada." },
      { t: "Temperar",
        x: "Junta o cominho, a paprika e o piri-piri e mexe 1 minuto." },
      { t: "Cozinhar",
        x: "Acrescenta o tomate, a água e sal. Cozinha em lume brando 30 minutos. Junta o feijão e cozinha mais 10 minutos." },
      { t: "Servir",
        x: "Coze o arroz conforme a embalagem. Serve o chilli sobre o arroz, com coentros frescos." }
    ],
    dicas: [
      { t: "Melhor no dia seguinte", x: "O sabor apura de um dia para o outro. Guarda no frigorífico até 3 dias ou congela." },
      { t: "Picante à medida", x: "Começa com pouco piri-piri. É fácil juntar mais no fim." },
      { t: "Para acompanhar", x: "Fica bem com natas azedas, queijo ralado ou guacamole." }
    ],
    nutricao: { calorias: 520, proteina: 38, hidratos: 52, acucares: 8, gordura: 17, saturada: 6, fibra: 10, sal: 1.6 }
  },
  /* 42. DAL DE LENTILHAS (indiana, pratos-principais) */
  {
    id: "dal-de-lentilhas",
    titulo: "Dal de lentilhas",
    descricao: "Lentilhas vermelhas cozidas com especiarias, cremosas e reconfortantes. Barato, saudável e fácil.",
    categoria: { pais: "indiana", tipo: "pratos-principais" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-gluten", "sem-lactose", "rica-em-proteina"],
    imagem: criarImagem("🍛", "orange", "Tigela de dal de lentilhas com coentros"),
    galeria: [
      { emoji: "🍛", tom: "orange", alt: "Tigela de dal de lentilhas com coentros" },
      { emoji: "🍴", tom: "lemon", alt: "Lentilhas vermelhas cruas" }
    ],
    icone: "🍛",
    tom: "orange",
    preparacao: 10,
    cozedura: 30,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 3, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 2, "u": "cm", "n": "gengibre fresco, ralado"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "cúrcuma"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "cominho em pó"},
        {"q": 250, "u": "g", "n": "lentilhas vermelhas"},
        {"q": 200, "u": "g", "n": "tomate triturado"},
        {"q": 800, "u": "ml", "n": "água"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "sumo de limão"},
        {"q": null, "n": "coentros frescos"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Refogar",
        x: "Aquece o azeite e refoga a cebola picada 5 minutos. Junta o alho e o gengibre e cozinha 1 minuto." },
      { t: "Tostar as especiarias",
        x: "Junta a cúrcuma e o cominho e mexe 30 segundos, até libertarem aroma." },
      { t: "Cozinhar as lentilhas",
        x: "Acrescenta as lentilhas lavadas, o tomate e a água. Leva a ferver e cozinha em lume brando 25 minutos, até ficarem desfeitas." },
      { t: "Terminar",
        x: "Tempera com sal e sumo de limão. Serve com coentros frescos, arroz ou pão naan." }
    ],
    dicas: [
      { t: "Lentilhas vermelhas", x: "Não precisam de demolha e cozinham depressa. Lava-as bem antes de usar." },
      { t: "Textura", x: "Se quiseres mais cremoso, tritura ligeiramente com a varinha mágica." },
      { t: "Mais sabor", x: "Termina com cebola frita em pouco azeite com sementes de cominho (o tarka)." }
    ],
    nutricao: { calorias: 330, proteina: 18, hidratos: 48, acucares: 4, gordura: 7, saturada: 1, fibra: 10, sal: 1.0 }
  },
  /* 43. PÃO NAAN (indiana, entradas) */
  {
    id: "pao-naan",
    titulo: "Pão naan",
    descricao: "Pão indiano fofo e dourado, pincelado com manteiga e alho. Perfeito para molhar caril.",
    categoria: { pais: "indiana", tipo: "entradas" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🍞", "lemon", "Pão naan pincelado com manteiga e alho"),
    galeria: [
      { emoji: "🍞", tom: "lemon", alt: "Pão naan pincelado com manteiga e alho" },
      { emoji: "🍴", tom: "lemon", alt: "Massa a levedar" }
    ],
    icone: "🍞",
    tom: "lemon",
    preparacao: 15,
    cozedura: 10,
    repouso: 60,
    porcoes: 6,
    porcaoNome: "naan",
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Massa", itens: [
        {"q": 300, "u": "g", "n": "farinha de trigo"},
        {"q": 100, "u": "g", "n": "iogurte natural"},
        {"q": 80, "u": "ml", "n": "leite morno"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "fermento de padeiro seco"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "açúcar"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "sal"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"}
      ]},
      { titulo: "Para pincelar", itens: [
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "manteiga derretida"},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": null, "n": "coentros frescos"}
      ]}
    ],
    passos: [
      { t: "Fazer a massa",
        x: "Mistura o leite morno com o açúcar e o fermento e deixa 5 minutos. Junta a farinha, o sal, o iogurte e o azeite e amassa 8 minutos, até obteres uma massa macia." },
      { t: "Levedar",
        x: "Tapa e deixa levedar 1 hora, num local morno, até duplicar." },
      { t: "Esticar",
        x: "Divide a massa em 6 bolas e estica cada uma numa forma de lágrima, com cerca de 5 mm de espessura." },
      { t: "Cozer",
        x: "Numa frigideira bem quente e seca, coze cada naan 2 minutos de cada lado, até aparecerem bolhas e manchas douradas." },
      { t: "Pincelar",
        x: "Mistura a manteiga com o alho picado e pincela os naan ainda quentes. Polvilha com coentros." }
    ],
    dicas: [
      { t: "Frigideira bem quente", x: "O calor forte faz as bolhas e o sabor tostado típico. Tapa a frigideira por uns segundos." },
      { t: "Massa macia", x: "Se a massa estiver pegajosa, junta um pouco de farinha, mas sem exagerar." },
      { t: "Conservação", x: "Embrulha num pano para se manterem macios. Aquecem bem na torradeira." }
    ],
    nutricao: { calorias: 240, proteina: 7, hidratos: 40, acucares: 3, gordura: 6, saturada: 3, fibra: 2, sal: 0.9 }
  },
  /* 44. PAELLA DE FRANGO E LEGUMES (espanhola, pratos-principais) */
  {
    id: "paella-valenciana",
    titulo: "Paella de frango e legumes",
    descricao: "Arroz dourado com açafrão, frango e legumes, cozido numa frigideira larga. O prato mais famoso de Espanha.",
    categoria: { pais: "espanhola", tipo: "pratos-principais" },
    alimento: ["arroz", "aves"],
    dieta: ["sem-lactose", "sem-gluten"],
    imagem: criarImagem("🥘", "orange", "Paella com frango e legumes"),
    galeria: [
      { emoji: "🥘", tom: "orange", alt: "Paella com frango e legumes" },
      { emoji: "🍴", tom: "lemon", alt: "Arroz com açafrão" }
    ],
    icone: "🥘",
    tom: "orange",
    preparacao: 20,
    cozedura: 40,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 600, "u": "g", "n": "coxas de frango, sem pele e em pedaços"},
        {"q": 1, "u": "", "n": "pimentos vermelhos", "ns": "pimento vermelho", "inteiro": true},
        {"q": 3, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 200, "u": "g", "n": "tomate ralado"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "paprika doce"},
        {"q": 300, "u": "g", "n": "arroz bomba"},
        {"q": 900, "u": "ml", "n": "caldo de galinha quente"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "açafrão"},
        {"q": 100, "u": "g", "n": "ervilhas"},
        {"q": 1, "u": "", "n": "limões", "ns": "limão", "inteiro": true},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Dourar o frango",
        x: "Aquece o azeite numa frigideira larga (paellera) e dora o frango 8 minutos, até ganhar cor. Tempera com sal." },
      { t: "Fazer o refogado",
        x: "Junta o pimento em tiras e o alho picado e cozinha 3 minutos. Acrescenta o tomate ralado e a paprika e deixa reduzir 5 minutos." },
      { t: "Juntar o arroz",
        x: "Junta o arroz e mexe 1 minuto, para se envolver no refogado. Verte o caldo quente com o açafrão e as ervilhas." },
      { t: "Cozer",
        x: "Cozinha em lume médio, sem mexer, durante 18 a 20 minutos, até o arroz absorver o caldo." },
      { t: "Descansar",
        x: "Retira do lume, tapa com um pano e deixa repousar 5 minutos. Serve com gomos de limão." }
    ],
    dicas: [
      { t: "Sem mexer", x: "Depois de juntar o caldo, não mexas. Assim forma-se o socarrat, a crosta dourada do fundo." },
      { t: "Arroz certo", x: "O arroz bomba absorve muito caldo sem ficar papa. Podes usar arroz de paella." },
      { t: "Caldo quente", x: "Junta o caldo sempre quente, para a cozedura não parar." }
    ],
    nutricao: { calorias: 610, proteina: 40, hidratos: 70, acucares: 4, gordura: 17, saturada: 4, fibra: 4, sal: 1.6 }
  },
  /* 45. CHURROS (espanhola, sobremesas) */
  {
    id: "churros",
    titulo: "Churros",
    descricao: "Tiras de massa fritas, estaladiças por fora e macias por dentro, passadas por açúcar e canela.",
    categoria: { pais: "espanhola", tipo: "sobremesas" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍩", "orange", "Churros polvilhados com açúcar e canela"),
    galeria: [
      { emoji: "🍩", tom: "orange", alt: "Churros polvilhados com açúcar e canela" },
      { emoji: "🍴", tom: "lemon", alt: "Massa a sair do saco pasteleiro" }
    ],
    icone: "🍩",
    tom: "orange",
    preparacao: 10,
    cozedura: 15,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Massa", itens: [
        {"q": 250, "u": "ml", "n": "água"},
        {"q": 150, "u": "g", "n": "farinha de trigo"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "sal"}
      ]},
      { titulo: "Para fritar e polvilhar", itens: [
        {"q": 500, "u": "ml", "n": "óleo, para fritar"},
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "canela em pó"}
      ]}
    ],
    passos: [
      { t: "Fazer a massa",
        x: "Leva a água ao lume com o sal até ferver. Retira do lume, junta a farinha de uma vez e mexe vigorosamente até obteres uma massa lisa e sem grumos." },
      { t: "Encher o saco",
        x: "Deixa a massa arrefecer 5 minutos e coloca-a num saco pasteleiro com boquilha de estrela." },
      { t: "Fritar",
        x: "Aquece o óleo a cerca de 180 °C. Espreme tiras de massa de 10 a 12 cm para o óleo e frita 3 a 4 minutos, virando, até ficarem douradas." },
      { t: "Polvilhar",
        x: "Escorre sobre papel absorvente e passa pelo açúcar misturado com a canela. Serve quente." }
    ],
    dicas: [
      { t: "Óleo à temperatura certa", x: "Se o óleo estiver pouco quente, os churros ficam gordurosos. Se estiver demasiado quente, queimam por fora e ficam crus por dentro." },
      { t: "Saco pasteleiro", x: "A boquilha de estrela dá as ranhuras que deixam os churros estaladiços." },
      { t: "Com chocolate", x: "Acompanha com chocolate quente espesso, como o da receita de chocolate à espanhola." }
    ],
    nutricao: { calorias: 420, proteina: 5, hidratos: 52, acucares: 12, gordura: 22, saturada: 3, fibra: 2, sal: 0.4 }
  },
  /* 46. SALMOREJO (espanhola, entradas) */
  {
    id: "salmorejo",
    titulo: "Salmorejo",
    descricao: "Creme frio de tomate de Córdova, espesso e cremoso, com ovo cozido e presunto por cima.",
    categoria: { pais: "espanhola", tipo: "entradas" },
    alimento: ["sopas"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍅", "tomato", "Prato de salmorejo com ovo cozido e presunto"),
    galeria: [
      { emoji: "🍅", tom: "tomato", alt: "Prato de salmorejo com ovo cozido e presunto" },
      { emoji: "🍴", tom: "lemon", alt: "Tomates maduros" }
    ],
    icone: "🍅",
    tom: "tomato",
    preparacao: 15,
    cozedura: 0,
    repouso: 120,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 1, "u": "kg", "n": "tomates maduros"},
        {"q": 100, "u": "g", "n": "pão do dia anterior, sem côdea"},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 100, "u": "ml", "n": "azeite"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "vinagre de vinho"},
        {"q": null, "n": "sal"}
      ]},
      { titulo: "Para servir", itens: [
        {"q": 2, "u": "", "n": "ovos cozidos", "ns": "ovo cozido", "inteiro": true},
        {"q": 40, "u": "g", "n": "presunto, em lascas"}
      ]}
    ],
    passos: [
      { t: "Preparar",
        x: "Lava os tomates e corta-os em pedaços. Corta o pão em cubos." },
      { t: "Triturar",
        x: "Tritura os tomates com o pão, o alho, o vinagre e o sal até ficar liso. Passa por um passador, se quiseres uma textura mais fina." },
      { t: "Emulsionar",
        x: "Com a trituradora a trabalhar, junta o azeite em fio, até o creme ficar espesso e de cor laranja pálido." },
      { t: "Arrefecer",
        x: "Leva ao frigorífico pelo menos 2 horas." },
      { t: "Servir",
        x: "Serve bem frio, com ovo cozido picado e lascas de presunto por cima." }
    ],
    dicas: [
      { t: "Tomate maduro", x: "O sabor depende do tomate. Usa-os bem maduros e, de preferência, da época." },
      { t: "Mais espesso", x: "O salmorejo é mais espesso do que o gazpacho. Ajusta com mais ou menos pão." },
      { t: "Versão vegana", x: "Retira o ovo e o presunto e serve com azeite e croutons." }
    ],
    nutricao: { calorias: 340, proteina: 8, hidratos: 24, acucares: 8, gordura: 24, saturada: 3.5, fibra: 3, sal: 1.3 }
  },
  /* 47. CREPES (francesa, pequeno-almoco) */
  {
    id: "crepes",
    titulo: "Crepes",
    descricao: "Panquecas finas e douradas, com recheio doce. Um clássico francês para o pequeno-almoço ou para a sobremesa.",
    categoria: { pais: "francesa", tipo: "pequeno-almoco" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🥞", "lemon", "Crepes dobrados com açúcar e limão"),
    galeria: [
      { emoji: "🥞", tom: "lemon", alt: "Crepes dobrados com açúcar e limão" },
      { emoji: "🍴", tom: "lemon", alt: "Massa de crepes na frigideira" }
    ],
    icone: "🥞",
    tom: "lemon",
    preparacao: 10,
    cozedura: 15,
    repouso: 30,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Massa", itens: [
        {"q": 150, "u": "g", "n": "farinha de trigo"},
        {"q": 300, "u": "ml", "n": "leite"},
        {"q": 2, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "manteiga derretida"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "sal"}
      ]},
      { titulo: "Para rechear", itens: [
        {"q": 100, "u": "g", "n": "doce ou chocolate de barrar"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "sumo de limão"}
      ]}
    ],
    passos: [
      { t: "Fazer a massa",
        x: "Bate os ovos com o leite. Junta a farinha, o açúcar e o sal e mistura bem. Acrescenta a manteiga derretida e bate até ficar sem grumos." },
      { t: "Repousar",
        x: "Deixa a massa repousar 30 minutos, para ficar mais leve." },
      { t: "Cozinhar",
        x: "Aquece uma frigideira antiaderente untada com um pouco de manteiga. Deita uma concha de massa e roda a frigideira para a espalhar. Cozinha 1 a 2 minutos de cada lado, até estar dourada." },
      { t: "Rechear",
        x: "Barra cada crepe com o doce ou o chocolate, um fio de limão se quiseres, e dobra em quatro. Serve de imediato." }
    ],
    dicas: [
      { t: "Massa fina", x: "A massa deve ser fluida. Se ficar muito espessa, junta mais um pouco de leite." },
      { t: "Primeiro crepe", x: "O primeiro crepe costuma sair pior. Serve de teste para acertar a temperatura." },
      { t: "Salgados", x: "Para uma versão salgada, usa queijo e fiambre, e tira o açúcar da massa." }
    ],
    nutricao: { calorias: 330, proteina: 10, hidratos: 42, acucares: 12, gordura: 13, saturada: 7, fibra: 1, sal: 0.4 }
  },
  /* 48. QUICHE LORRAINE (francesa, pratos-principais) */
  {
    id: "quiche-lorraine",
    titulo: "Quiche Lorraine",
    descricao: "Tarte salgada com bacon, queijo e um recheio cremoso de ovos e natas. Um clássico da Lorena.",
    categoria: { pais: "francesa", tipo: "pratos-principais" },
    alimento: ["carne"],
    dieta: [],
    imagem: criarImagem("🥧", "lemon", "Fatia de quiche Lorraine"),
    galeria: [
      { emoji: "🥧", tom: "lemon", alt: "Fatia de quiche Lorraine" },
      { emoji: "🍴", tom: "lemon", alt: "Bacon e queijo ralado" }
    ],
    icone: "🥧",
    tom: "lemon",
    preparacao: 25,
    cozedura: 40,
    porcoes: 6,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Massa", itens: [
        {"q": 1, "u": "", "n": "rolos de massa quebrada (cerca de 230 g)", "ns": "rolo de massa quebrada (cerca de 230 g)", "inteiro": true}
      ]},
      { titulo: "Recheio", itens: [
        {"q": 200, "u": "g", "n": "bacon, em tiras"},
        {"q": 3, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 200, "u": "ml", "n": "natas"},
        {"q": 100, "u": "ml", "n": "leite"},
        {"q": 100, "u": "g", "n": "queijo gruyère ou emmental, ralado"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "noz-moscada"},
        {"q": null, "n": "pimenta"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Forrar a forma",
        x: "Pré-aquece o forno a 190 °C. Forra uma forma de tarte de 24 cm com a massa e fura o fundo com um garfo. Leva ao forno 10 minutos." },
      { t: "Dourar o bacon",
        x: "Numa frigideira, sem gordura, frita o bacon até ficar dourado. Escorre em papel absorvente." },
      { t: "Fazer o creme",
        x: "Bate os ovos com as natas, o leite, a noz-moscada, a pimenta e um pouco de sal (o bacon e o queijo já são salgados)." },
      { t: "Montar",
        x: "Distribui o bacon e o queijo pela massa e verte o creme por cima." },
      { t: "Cozer",
        x: "Coze 30 a 35 minutos, até o recheio estar firme e dourado. Deixa repousar 10 minutos antes de cortar." }
    ],
    dicas: [
      { t: "Pré-cozer a massa", x: "Cozer a massa antes evita que fique mole por baixo." },
      { t: "Sal com cuidado", x: "O bacon e o queijo já levam sal. Prova o creme com cuidado." },
      { t: "Quente ou frio", x: "Fica ótima morna, com uma salada verde, ou fria no dia seguinte." }
    ],
    nutricao: { calorias: 460, proteina: 17, hidratos: 25, acucares: 2, gordura: 33, saturada: 17, fibra: 1, sal: 1.4 }
  },
  /* 49. RATATOUILLE (francesa, pratos-principais) */
  {
    id: "ratatouille",
    titulo: "Ratatouille",
    descricao: "Legumes da Provença cozidos lentamente em azeite e tomate. Cheio de sabor e naturalmente vegano.",
    categoria: { pais: "francesa", tipo: "pratos-principais" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-gluten", "sem-lactose", "fitness"],
    imagem: criarImagem("🍆", "plum", "Tacho de ratatouille com legumes coloridos"),
    galeria: [
      { emoji: "🍆", tom: "plum", alt: "Tacho de ratatouille com legumes coloridos" },
      { emoji: "🍴", tom: "lemon", alt: "Beringela e curgete frescas" }
    ],
    icone: "🍆",
    tom: "plum",
    preparacao: 20,
    cozedura: 45,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 1, "u": "", "n": "beringelas grandes", "ns": "beringela grande", "inteiro": true},
        {"q": 2, "u": "", "n": "curgetes", "ns": "curgete", "inteiro": true},
        {"q": 1, "u": "", "n": "pimentos vermelhos", "ns": "pimento vermelho", "inteiro": true},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 3, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 400, "u": "g", "n": "tomate triturado"},
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "tomilho"},
        {"q": null, "n": "manjericão fresco"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Cortar",
        x: "Corta a beringela, a curgete e o pimento em cubos de cerca de 2 cm. Pica a cebola e o alho." },
      { t: "Refogar",
        x: "Aquece metade do azeite numa panela larga e refoga a cebola 5 minutos. Junta o alho e o pimento e cozinha 5 minutos." },
      { t: "Juntar os legumes",
        x: "Acrescenta a beringela, a curgete, o tomilho e sal. Mexe 5 minutos." },
      { t: "Cozinhar",
        x: "Junta o tomate, tapa e cozinha em lume brando 30 minutos, mexendo de vez em quando." },
      { t: "Servir",
        x: "Termina com o azeite restante e manjericão fresco. Serve quente ou frio." }
    ],
    dicas: [
      { t: "Melhor no dia seguinte", x: "Os sabores apuram de um dia para o outro. Aguenta até 4 dias no frigorífico." },
      { t: "Beringela", x: "Se a beringela for amarga, corta-a e deixa-a 15 minutos com sal antes de cozinhar." },
      { t: "Para acompanhar", x: "Fica bem com arroz, cuscuz ou pão. Também é ótimo com um ovo estrelado por cima." }
    ],
    nutricao: { calorias: 160, proteina: 4, hidratos: 16, acucares: 10, gordura: 9, saturada: 1.3, fibra: 6, sal: 0.7 }
  },
  /* 50. MOUSSE DE CHOCOLATE (francesa, sobremesas) */
  {
    id: "mousse-de-chocolate",
    titulo: "Mousse de chocolate",
    descricao: "Mousse aerada e intensa, feita só com chocolate negro, ovos e um pouco de açúcar.",
    categoria: { pais: "francesa", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🍫", "plum", "Taça de mousse de chocolate"),
    galeria: [
      { emoji: "🍫", tom: "plum", alt: "Taça de mousse de chocolate" },
      { emoji: "🍴", tom: "lemon", alt: "Chocolate negro a derreter" }
    ],
    icone: "🍫",
    tom: "plum",
    preparacao: 20,
    cozedura: 0,
    repouso: 240,
    porcoes: 6,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 200, "u": "g", "n": "chocolate negro"},
        {"q": 30, "u": "g", "n": "manteiga"},
        {"q": 4, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 40, "u": "g", "n": "açúcar"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Derreter o chocolate",
        x: "Derrete o chocolate com a manteiga em banho-maria, mexendo, até ficar liso. Deixa arrefecer um pouco." },
      { t: "Separar os ovos",
        x: "Separa as gemas das claras. Junta as gemas ao chocolate, uma de cada vez, mexendo bem." },
      { t: "Bater as claras",
        x: "Bate as claras com a pitada de sal até ficarem espumosas. Junta o açúcar aos poucos e bate até ficarem em castelo firme." },
      { t: "Envolver",
        x: "Junta um terço das claras ao chocolate, para o aligeirar. Depois envolve o resto com cuidado, com movimentos suaves de baixo para cima." },
      { t: "Arrefecer",
        x: "Distribui por taças e leva ao frigorífico pelo menos 4 horas." }
    ],
    dicas: [
      { t: "Movimentos suaves", x: "Envolve devagar para não perder o ar das claras. É isso que dá a leveza à mousse." },
      { t: "Atenção aos ovos crus", x: "Esta receita leva ovos crus. Não é indicada a grávidas, crianças pequenas, idosos ou pessoas com defesas baixas. Podes usar ovos pasteurizados." },
      { t: "Chocolate com qualidade", x: "O sabor depende do chocolate. Usa um com 60 a 70 % de cacau." }
    ],
    nutricao: { calorias: 300, proteina: 7, hidratos: 21, acucares: 18, gordura: 21, saturada: 12, fibra: 3, sal: 0.2 }
  },
  /* 51. PASTÉIS DE BACALHAU (portuguesa, entradas) */
  {
    id: "pasteis-de-bacalhau",
    titulo: "Pastéis de bacalhau",
    descricao: "Croquetes ovais de bacalhau e batata, estaladiços por fora e macios por dentro. Um petisco clássico português.",
    categoria: { pais: "portuguesa", tipo: "entradas" },
    alimento: ["peixe-e-marisco"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🐟", "lemon", "Pastéis de bacalhau dourados num prato"),
    galeria: [
      { emoji: "🐟", tom: "lemon", alt: "Pastéis de bacalhau dourados num prato" },
      { emoji: "🍴", tom: "lemon", alt: "Massa de bacalhau e batata a ser moldada" }
    ],
    icone: "🐟",
    tom: "lemon",
    preparacao: 40,
    cozedura: 15,
    porcoes: 6,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Massa", itens: [
        {"q": 300, "u": "g", "n": "bacalhau demolhado"},
        {"q": 400, "u": "g", "n": "batatas"},
        {"q": 1, "u": "", "n": "cebolas pequenas", "ns": "cebola pequena", "inteiro": true},
        {"q": 2, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "salsa picada"},
        {"q": null, "n": "pimenta"},
        {"q": null, "n": "noz-moscada"}
      ]},
      { titulo: "Para fritar", itens: [
        {"q": 500, "u": "ml", "n": "óleo, para fritar"}
      ]}
    ],
    passos: [
      { t: "Cozer",
        x: "Coze as batatas com casca em água com sal. Noutro tacho, coze o bacalhau 5 minutos. Escorre tudo." },
      { t: "Preparar a massa",
        x: "Descasca as batatas e esmaga-as em puré. Tira a pele e as espinhas ao bacalhau e desfaz-o em lascas finas. Junta a cebola ralada, a salsa, os ovos, a pimenta e a noz-moscada e mistura bem." },
      { t: "Moldar",
        x: "Com duas colheres de sopa, molda a massa em pastéis ovais." },
      { t: "Fritar",
        x: "Aquece o óleo a cerca de 180 °C e frita os pastéis, poucos de cada vez, 3 a 4 minutos, até ficarem dourados. Escorre em papel absorvente e serve quentes." }
    ],
    dicas: [
      { t: "Bacalhau bem escorrido", x: "Se o bacalhau ficar com água, a massa fica mole e os pastéis desfazem-se na fritura." },
      { t: "Batatas com casca", x: "Cozer as batatas com casca evita que absorvam água e fiquem moles." },
      { t: "Para acompanhar", x: "Ficam ótimos com uma salada de feijão-frade ou com arroz de tomate." }
    ],
    nutricao: { calorias: 260, proteina: 16, hidratos: 24, acucares: 1, gordura: 11, saturada: 2, fibra: 2, sal: 1.1 }
  },
  /* 52. SARDINHAS ASSADAS (portuguesa, pratos-principais) */
  {
    id: "sardinhas-assadas",
    titulo: "Sardinhas assadas",
    descricao: "Sardinhas grelhadas com sal grosso, o cheiro do verão português. Servidas com pão e salada de pimentos.",
    categoria: { pais: "portuguesa", tipo: "pratos-principais" },
    alimento: ["peixe-e-marisco"],
    dieta: ["sem-lactose", "low-carb", "rica-em-proteina"],
    imagem: criarImagem("🐟", "sky", "Sardinhas assadas na grelha"),
    galeria: [
      { emoji: "🐟", tom: "sky", alt: "Sardinhas assadas na grelha" },
      { emoji: "🍴", tom: "lemon", alt: "Sardinhas frescas com sal grosso" }
    ],
    icone: "🐟",
    tom: "sky",
    preparacao: 15,
    cozedura: 10,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 12, "u": "", "n": "sardinhas frescas, de tamanho médio", "ns": "sardinha fresca, de tamanho médio", "inteiro": true},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "sal grosso"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"}
      ]},
      { titulo: "Salada de pimentos", itens: [
        {"q": 3, "u": "", "n": "pimentos vermelhos", "ns": "pimento vermelho", "inteiro": true},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "vinagre"},
        {"q": null, "n": "sal"}
      ]},
      { titulo: "Para servir", itens: [
        {"q": 4, "u": "fatia", "up": "fatias", "n": "pão rústico"},
        {"q": 1, "u": "", "n": "limões", "ns": "limão", "inteiro": true}
      ]}
    ],
    passos: [
      { t: "Preparar o peixe",
        x: "Deixa as sardinhas a descongelar, se for preciso, e seca-as com papel. Tempera com sal grosso 15 minutos antes de assar." },
      { t: "Assar os pimentos",
        x: "Leva os pimentos ao forno a 220 °C, 30 minutos, virando uma vez. Fecha-os num saco 10 minutos, tira a pele e as sementes e corta em tiras. Tempera com alho picado, azeite, vinagre e sal." },
      { t: "Grelhar",
        x: "Aquece bem a grelha. Pincela as sardinhas com um fio de azeite e grelha 4 a 5 minutos de cada lado, até a pele ficar estaladiça." },
      { t: "Servir",
        x: "Serve de imediato, sobre uma fatia de pão, com a salada de pimentos e uns gomos de limão." }
    ],
    dicas: [
      { t: "Grelha bem quente", x: "A grelha quente sela a pele e evita que o peixe se pegue." },
      { t: "Sem lavar demasiado", x: "Basta limpar as sardinhas com papel de cozinha. A água tira sabor ao peixe." },
      { t: "Fogão ou forno", x: "Sem grelha, podes assar as sardinhas numa frigideira de ferro ou no forno bem quente." }
    ],
    nutricao: { calorias: 380, proteina: 32, hidratos: 22, acucares: 6, gordura: 19, saturada: 4, fibra: 3, sal: 1.8 }
  },
  /* 53. BOLO DE BOLACHA (portuguesa, sobremesas) */
  {
    id: "bolo-de-bolacha",
    titulo: "Bolo de bolacha",
    descricao: "Camadas de bolacha Maria molhada em café com creme de manteiga. O bolo de aniversário de muitas infâncias portuguesas.",
    categoria: { pais: "portuguesa", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🍰", "plum", "Fatia de bolo de bolacha com café"),
    galeria: [
      { emoji: "🍰", tom: "plum", alt: "Fatia de bolo de bolacha com café" },
      { emoji: "🍴", tom: "lemon", alt: "Camadas de bolacha e creme" }
    ],
    icone: "🍰",
    tom: "plum",
    preparacao: 30,
    cozedura: 0,
    repouso: 480,
    porcoes: 10,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Creme", itens: [
        {"q": 250, "u": "g", "n": "manteiga à temperatura ambiente"},
        {"q": 200, "u": "g", "n": "açúcar"},
        {"q": 4, "u": "", "n": "gemas", "ns": "gema", "inteiro": true},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "extrato de baunilha"}
      ]},
      { titulo: "Montagem", itens: [
        {"q": 300, "u": "ml", "n": "café forte, frio"},
        {"q": 2, "u": "", "n": "pacotes de bolacha Maria (cerca de 400 g)", "ns": "pacote de bolacha Maria (cerca de 200 g)", "inteiro": true},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "cacau em pó"}
      ]}
    ],
    passos: [
      { t: "Fazer o creme",
        x: "Bate a manteiga com o açúcar até ficar cremosa e esbranquiçada. Junta as gemas, uma a uma, e a baunilha, e bate até obter um creme liso." },
      { t: "Molhar as bolachas",
        x: "Molha rapidamente as bolachas no café frio, uma a uma, sem as deixar desfazer." },
      { t: "Montar",
        x: "Forra uma travessa com uma camada de bolachas, cobre com creme e repete as camadas, acabando com creme." },
      { t: "Repousar",
        x: "Leva ao frigorífico pelo menos 8 horas (de um dia para o outro). Polvilha com cacau antes de servir." }
    ],
    dicas: [
      { t: "Gemas e segurança", x: "O creme leva gemas cruas. Usa ovos muito frescos e mantém o bolo sempre no frigorífico." },
      { t: "Café frio", x: "O café tem de estar frio, ou as bolachas desfazem-se." },
      { t: "Sem café", x: "Para crianças, substitui o café por leite com um pouco de chocolate." }
    ],
    nutricao: { calorias: 430, proteina: 5, hidratos: 45, acucares: 26, gordura: 25, saturada: 15, fibra: 1, sal: 0.3 }
  },
  /* 54. LEITE-CREME (portuguesa, sobremesas) */
  {
    id: "leite-creme",
    titulo: "Leite-creme",
    descricao: "Creme de ovos e leite com açúcar queimado por cima. A sobremesa portuguesa parente da crème brûlée.",
    categoria: { pais: "portuguesa", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🍮", "lemon", "Leite-creme com a camada de açúcar queimado"),
    galeria: [
      { emoji: "🍮", tom: "lemon", alt: "Leite-creme com a camada de açúcar queimado" },
      { emoji: "🍴", tom: "lemon", alt: "Gemas e leite para o creme" }
    ],
    icone: "🍮",
    tom: "lemon",
    preparacao: 15,
    cozedura: 15,
    repouso: 120,
    porcoes: 6,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Creme", itens: [
        {"q": 500, "u": "ml", "n": "leite"},
        {"q": 1, "u": "", "n": "casca de limão", "ns": "casca de limão", "inteiro": true},
        {"q": 1, "u": "", "n": "pau de canela", "ns": "pau de canela", "inteiro": true},
        {"q": 5, "u": "", "n": "gemas", "ns": "gema", "inteiro": true},
        {"q": 120, "u": "g", "n": "açúcar"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "farinha de milho (maisena)"}
      ]},
      { titulo: "Para queimar", itens: [
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar"}
      ]}
    ],
    passos: [
      { t: "Aromatizar o leite",
        x: "Aquece o leite com a casca de limão e o pau de canela. Quando levantar fervura, retira do lume e deixa em infusão 10 minutos." },
      { t: "Misturar",
        x: "Bate as gemas com o açúcar e a maisena até ficar liso. Junta o leite coado, aos poucos, mexendo sempre." },
      { t: "Cozinhar o creme",
        x: "Leva ao lume brando, a mexer sem parar, até engrossar sem ferver. Distribui por taças." },
      { t: "Queimar",
        x: "Deixa arrefecer e leva ao frigorífico 2 horas. Polvilha o açúcar e queima-o com um maçarico ou com um ferro quente." }
    ],
    dicas: [
      { t: "Lume brando", x: "Se o creme ferver, as gemas talham. Mexe sempre e retira do lume ao primeiro sinal de fervura." },
      { t: "Sem maçarico", x: "Podes caramelizar o açúcar sob o grelhador do forno, com a taça sobre gelo." },
      { t: "Mais cremoso", x: "Passa o creme por um passador fino antes de o distribuir pelas taças." }
    ],
    nutricao: { calorias: 240, proteina: 5, hidratos: 32, acucares: 29, gordura: 10, saturada: 5, fibra: 0, sal: 0.1 }
  },
  /* 55. CALDEIRADA DE PEIXE (portuguesa, pratos-principais) */
  {
    id: "caldeirada-de-peixe",
    titulo: "Caldeirada de peixe",
    descricao: "Peixe fresco cozinhado em camadas com batata, tomate, pimento e cebola. Um prato de pescadores, simples e cheio de sabor.",
    categoria: { pais: "portuguesa", tipo: "pratos-principais" },
    alimento: ["peixe-e-marisco"],
    dieta: ["sem-gluten", "sem-lactose"],
    imagem: criarImagem("🍲", "tomato", "Panela de caldeirada de peixe"),
    galeria: [
      { emoji: "🍲", tom: "tomato", alt: "Panela de caldeirada de peixe" },
      { emoji: "🍴", tom: "lemon", alt: "Peixe fresco e legumes cortados" }
    ],
    icone: "🍲",
    tom: "tomato",
    preparacao: 25,
    cozedura: 40,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 800, "u": "g", "n": "postas de peixe variado (pescada, tamboril, cherne)"},
        {"q": 600, "u": "g", "n": "batatas"},
        {"q": 3, "u": "", "n": "tomates maduros", "ns": "tomate maduro", "inteiro": true},
        {"q": 2, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 2, "u": "", "n": "pimentos verdes", "ns": "pimento verde", "inteiro": true},
        {"q": 3, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 100, "u": "ml", "n": "azeite"},
        {"q": 150, "u": "ml", "n": "vinho branco"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "colorau"},
        {"q": null, "n": "salsa"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Cortar",
        x: "Corta as batatas em rodelas grossas, a cebola, o tomate e o pimento em rodelas. Tempera o peixe com sal." },
      { t: "Montar as camadas",
        x: "Numa panela larga, faz camadas de cebola, tomate, pimento, batata e peixe, com alho, sal e colorau, e repete." },
      { t: "Cozinhar",
        x: "Rega com o azeite e o vinho branco, junta um pouco de água quente até quase cobrir. Tapa e cozinha em lume brando 35 a 40 minutos, sem mexer." },
      { t: "Servir",
        x: "Serve na própria panela, com salsa picada e pão para molhar o molho." }
    ],
    dicas: [
      { t: "Não mexer", x: "Para o peixe não se desfazer, agita a panela em vez de mexer com a colher." },
      { t: "Peixe variado", x: "Quanto mais variedade de peixe, mais saboroso fica o caldo." },
      { t: "Batata no fundo", x: "Com as batatas por baixo, o peixe cozinha ao vapor e fica mais firme." }
    ],
    nutricao: { calorias: 430, proteina: 36, hidratos: 34, acucares: 7, gordura: 17, saturada: 3, fibra: 5, sal: 1.4 }
  },
  /* 56. SALADA DE POLVO (portuguesa, entradas) */
  {
    id: "salada-de-polvo",
    titulo: "Salada de polvo",
    descricao: "Polvo cozido e temperado com cebola, pimento, coentros e azeite. Uma salada fresca de verão.",
    categoria: { pais: "portuguesa", tipo: "entradas" },
    alimento: ["peixe-e-marisco", "saladas"],
    dieta: ["sem-gluten", "sem-lactose", "low-carb", "rica-em-proteina"],
    imagem: criarImagem("🐙", "sky", "Salada de polvo com azeite e coentros"),
    galeria: [
      { emoji: "🐙", tom: "sky", alt: "Salada de polvo com azeite e coentros" },
      { emoji: "🍴", tom: "lemon", alt: "Polvo cozido cortado em rodelas" }
    ],
    icone: "🐙",
    tom: "sky",
    preparacao: 20,
    cozedura: 60,
    repouso: 120,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 1, "u": "kg", "n": "polvo congelado e descongelado"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 1, "u": "", "n": "pimentos vermelhos", "ns": "pimento vermelho", "inteiro": true},
        {"q": 2, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 6, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "vinagre de vinho"},
        {"q": 1, "u": "molho", "up": "molhos", "n": "coentros", "ns": "coentros"},
        {"q": null, "n": "sal"},
        {"q": null, "n": "pimenta"}
      ]}
    ],
    passos: [
      { t: "Cozer o polvo",
        x: "Coloca o polvo numa panela sem água, tapada, em lume médio. Liberta o próprio líquido. Cozinha 50 a 60 minutos, até estar tenro quando espetas um garfo." },
      { t: "Arrefecer",
        x: "Deixa arrefecer no próprio caldo e corta em rodelas." },
      { t: "Temperar",
        x: "Pica a cebola, o pimento e o alho. Mistura com o polvo, o azeite, o vinagre, os coentros picados, sal e pimenta." },
      { t: "Repousar",
        x: "Deixa marinar no frigorífico pelo menos 2 horas e serve fresca." }
    ],
    dicas: [
      { t: "Polvo congelado", x: "O polvo que passou pelo congelador fica naturalmente mais tenro." },
      { t: "Sem água", x: "Cozer o polvo no seu próprio líquido dá-lhe mais sabor." },
      { t: "Como refeição", x: "Acompanha com batata cozida e ovo cozido para uma refeição completa." }
    ],
    nutricao: { calorias: 300, proteina: 38, hidratos: 8, acucares: 3, gordura: 13, saturada: 2, fibra: 2, sal: 1.2 }
  },
  /* 57. RABANADAS (portuguesa, sobremesas) */
  {
    id: "rabanadas",
    titulo: "Rabanadas",
    descricao: "Fatias de pão embebidas em leite e ovo, fritas e passadas por açúcar e canela. A sobremesa de Natal portuguesa.",
    categoria: { pais: "portuguesa", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🍞", "orange", "Rabanadas douradas com açúcar e canela"),
    galeria: [
      { emoji: "🍞", tom: "orange", alt: "Rabanadas douradas com açúcar e canela" },
      { emoji: "🍴", tom: "lemon", alt: "Fatias de pão a embeber em leite" }
    ],
    icone: "🍞",
    tom: "orange",
    preparacao: 15,
    cozedura: 15,
    porcoes: 6,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 8, "u": "fatia", "up": "fatias", "n": "pão do dia anterior, grossas"},
        {"q": 400, "u": "ml", "n": "leite"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "extrato de baunilha"},
        {"q": 3, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 500, "u": "ml", "n": "óleo, para fritar"}
      ]},
      { titulo: "Para polvilhar", itens: [
        {"q": 5, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar"},
        {"q": 2, "u": "colher de chá", "up": "colheres de chá", "n": "canela em pó"}
      ]}
    ],
    passos: [
      { t: "Aquecer o leite",
        x: "Aquece o leite com o açúcar e a baunilha. Deixa arrefecer um pouco." },
      { t: "Embeber",
        x: "Mergulha as fatias de pão no leite, de forma a ficarem húmidas mas inteiras. Bate os ovos num prato fundo." },
      { t: "Fritar",
        x: "Passa as fatias pelo ovo e frita em óleo quente, de ambos os lados, até ficarem douradas." },
      { t: "Polvilhar",
        x: "Escorre em papel absorvente e passa pelo açúcar misturado com a canela. Serve quentes ou frias." }
    ],
    dicas: [
      { t: "Pão do dia anterior", x: "O pão duro absorve melhor o leite e não se desfaz." },
      { t: "Fritar sem pressa", x: "Se o óleo estiver pouco quente, as rabanadas ficam gordurosas." },
      { t: "No forno", x: "Podes cozer as rabanadas no forno a 200 °C, 10 minutos de cada lado, para uma versão mais leve." }
    ],
    nutricao: { calorias: 380, proteina: 9, hidratos: 52, acucares: 25, gordura: 15, saturada: 3, fibra: 2, sal: 0.5 }
  },
  /* 58. BROA DE MILHO (portuguesa, entradas) */
  {
    id: "broa-de-milho",
    titulo: "Broa de milho",
    descricao: "Pão rústico de farinha de milho e de trigo, com côdea grossa e miolo denso. Fica ótima com sopa.",
    categoria: { pais: "portuguesa", tipo: "entradas" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍞", "lemon", "Broa de milho acabada de cozer"),
    galeria: [
      { emoji: "🍞", tom: "lemon", alt: "Broa de milho acabada de cozer" },
      { emoji: "🍴", tom: "lemon", alt: "Farinha de milho e de trigo" }
    ],
    icone: "🍞",
    tom: "lemon",
    preparacao: 20,
    cozedura: 50,
    repouso: 90,
    porcoes: 8,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 300, "u": "g", "n": "farinha de milho"},
        {"q": 200, "u": "g", "n": "farinha de trigo"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "sal"},
        {"q": 7, "u": "g", "n": "fermento de padeiro seco"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar"},
        {"q": 450, "u": "ml", "n": "água quente"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"}
      ]}
    ],
    passos: [
      { t: "Escaldar a farinha",
        x: "Mistura a farinha de milho com o sal e escalda com 250 ml de água a ferver. Mexe e deixa amornar." },
      { t: "Fazer a massa",
        x: "Junta a farinha de trigo, o fermento, o açúcar, o azeite e a restante água. Amassa 10 minutos, até a massa ficar elástica." },
      { t: "Levedar",
        x: "Tapa e deixa levedar 1 hora, até duplicar de volume. Molda uma bola." },
      { t: "Cozer",
        x: "Coloca num tabuleiro com farinha de milho, deixa repousar 30 minutos e coze a 220 °C durante 45 a 50 minutos, até a côdea estar escura e soar a oco." }
    ],
    dicas: [
      { t: "Massa húmida", x: "A massa de milho é mais pegajosa do que a de trigo. Humedece as mãos para a trabalhar." },
      { t: "Côdea estaladiça", x: "Coloca um tabuleiro com água no fundo do forno para criar vapor." },
      { t: "Conservar", x: "Embrulha num pano e conserva até 3 dias. Fica ótima torrada." }
    ],
    nutricao: { calorias: 240, proteina: 5, hidratos: 48, acucares: 1, gordura: 3, saturada: 0.5, fibra: 3, sal: 1.1 }
  },
  /* 59. BOLO DE LARANJA (portuguesa, sobremesas) */
  {
    id: "bolo-de-laranja",
    titulo: "Bolo de laranja",
    descricao: "Bolo fofo e húmido, feito no liquidificador com laranja inteira. Fácil e cheio de sabor a citrinos.",
    categoria: { pais: "portuguesa", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍊", "orange", "Fatia de bolo de laranja"),
    galeria: [
      { emoji: "🍊", tom: "orange", alt: "Fatia de bolo de laranja" },
      { emoji: "🍴", tom: "lemon", alt: "Laranjas frescas e raspa" }
    ],
    icone: "🍊",
    tom: "orange",
    preparacao: 15,
    cozedura: 40,
    porcoes: 10,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 2, "u": "", "n": "laranjas médias, com casca", "ns": "laranja média, com casca", "inteiro": true},
        {"q": 4, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 200, "u": "g", "n": "açúcar"},
        {"q": 150, "u": "ml", "n": "óleo de girassol"},
        {"q": 300, "u": "g", "n": "farinha de trigo"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "fermento em pó"}
      ]}
    ],
    passos: [
      { t: "Preparar a forma",
        x: "Pré-aquece o forno a 180 °C. Unta e enfarinha uma forma de 22 cm." },
      { t: "Triturar",
        x: "Corta as laranjas em pedaços, sem sementes, e tritura com os ovos, o açúcar e o óleo até ficar liso." },
      { t: "Juntar a farinha",
        x: "Mistura o preparado com a farinha e o fermento peneirados, até obteres uma massa homogénea." },
      { t: "Cozer",
        x: "Verte na forma e coze 35 a 40 minutos, até um palito sair limpo. Deixa arrefecer antes de desenformar." }
    ],
    dicas: [
      { t: "Casca de laranja", x: "A casca dá aroma, mas escolhe laranjas bem lavadas e de casca fina." },
      { t: "Calda", x: "Para mais suculência, rega o bolo ainda morno com o sumo de uma laranja misturado com açúcar." },
      { t: "Conservar", x: "Dura 3 a 4 dias bem tapado, fora do frigorífico." }
    ],
    nutricao: { calorias: 310, proteina: 5, hidratos: 45, acucares: 24, gordura: 12, saturada: 2, fibra: 1, sal: 0.2 }
  },
  /* 60. FRANGO PIRI-PIRI (portuguesa, pratos-principais) */
  {
    id: "frango-piri-piri",
    titulo: "Frango piri-piri",
    descricao: "Frango assado com um molho picante de piri-piri, alho e limão. O sabor do churrasco português.",
    categoria: { pais: "portuguesa", tipo: "pratos-principais" },
    alimento: ["aves"],
    dieta: ["sem-gluten", "sem-lactose", "rica-em-proteina"],
    imagem: criarImagem("🍗", "tomato", "Frango piri-piri assado"),
    galeria: [
      { emoji: "🍗", tom: "tomato", alt: "Frango piri-piri assado" },
      { emoji: "🍴", tom: "lemon", alt: "Piri-piri e alho para o molho" }
    ],
    icone: "🍗",
    tom: "tomato",
    preparacao: 20,
    cozedura: 60,
    repouso: 120,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 1, "u": "", "n": "frango inteiro, aberto ao meio (cerca de 1,4 kg)", "ns": "frango inteiro, aberto ao meio (cerca de 1,4 kg)", "inteiro": true}
      ]},
      { titulo: "Molho piri-piri", itens: [
        {"q": 4, "u": "", "n": "piri-piris frescos", "ns": "piri-piri fresco", "inteiro": true},
        {"q": 4, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 80, "u": "ml", "n": "azeite"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "sumo de limão"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "vinagre"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "colorau"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Fazer o molho",
        x: "Tritura o piri-piri, o alho, o azeite, o limão, o vinagre, o colorau e o sal até ficar um molho espesso." },
      { t: "Marinar",
        x: "Cobre o frango com metade do molho e deixa marinar no frigorífico pelo menos 2 horas, de preferência de um dia para o outro." },
      { t: "Assar",
        x: "Assa no forno a 200 °C, cerca de 55 a 60 minutos, regando com o molho de marinada a meio, até a pele ficar dourada." },
      { t: "Servir",
        x: "Deixa repousar 10 minutos e serve com o resto do molho, batata frita e salada." }
    ],
    dicas: [
      { t: "Menos picante", x: "Retira as sementes do piri-piri para um molho mais suave." },
      { t: "Pele estaladiça", x: "Nos últimos 10 minutos, aumenta a temperatura do forno para 230 °C." },
      { t: "Temperatura", x: "O frango está pronto quando o termómetro marca 75 °C na coxa." }
    ],
    nutricao: { calorias: 480, proteina: 45, hidratos: 3, acucares: 1, gordura: 32, saturada: 8, fibra: 0, sal: 1.6 }
  },
  /* 61. ARROZ DE TOMATE (portuguesa, pratos-principais) */
  {
    id: "arroz-de-tomate",
    titulo: "Arroz de tomate",
    descricao: "O arroz soltinho e avermelhado que acompanha peixe frito e grelhados em Portugal.",
    categoria: { pais: "portuguesa", tipo: "pratos-principais" },
    alimento: ["arroz", "vegan", "vegetariano"],
    dieta: ["sem-gluten", "sem-lactose"],
    imagem: criarImagem("🍅", "tomato", "Panela de arroz de tomate"),
    galeria: [
      { emoji: "🍅", tom: "tomato", alt: "Panela de arroz de tomate" },
      { emoji: "🍴", tom: "lemon", alt: "Tomates maduros e cebola" }
    ],
    icone: "🍅",
    tom: "tomato",
    preparacao: 10,
    cozedura: 20,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 300, "u": "g", "n": "arroz agulha"},
        {"q": 3, "u": "", "n": "tomates maduros", "ns": "tomate maduro", "inteiro": true},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 2, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 600, "u": "ml", "n": "água"},
        {"q": null, "n": "salsa"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Refogar",
        x: "Aquece o azeite e refoga a cebola e o alho picados, em lume brando, 5 minutos." },
      { t: "Juntar o tomate",
        x: "Junta os tomates sem pele nem sementes, picados, e cozinha 10 minutos, até formarem um refogado." },
      { t: "Cozer o arroz",
        x: "Junta a água quente com sal e, quando ferver, o arroz. Tapa e cozinha em lume brando 12 a 15 minutos." },
      { t: "Soltar",
        x: "Deixa repousar 5 minutos, solta com um garfo e serve com salsa picada." }
    ],
    dicas: [
      { t: "Água a ferver", x: "Junta sempre a água quente, para o arroz cozinhar uniformemente." },
      { t: "Proporção", x: "A medida é cerca de 2 partes de água para 1 de arroz agulha." },
      { t: "Com ovo", x: "Fica ótimo com um ovo estrelado por cima, para uma refeição rápida." }
    ],
    nutricao: { calorias: 310, proteina: 6, hidratos: 56, acucares: 5, gordura: 7, saturada: 1, fibra: 2, sal: 0.6 }
  },
  /* 62. MOQUECA DE PEIXE (brasileira, pratos-principais) */
  {
    id: "moqueca-de-peixe",
    titulo: "Moqueca de peixe",
    descricao: "Peixe cozinhado em leite de coco, tomate e coentros. Um prato brasileiro suave e perfumado.",
    categoria: { pais: "brasileira", tipo: "pratos-principais" },
    alimento: ["peixe-e-marisco"],
    dieta: ["sem-gluten", "sem-lactose"],
    imagem: criarImagem("🥥", "orange", "Panela de moqueca com coentros"),
    galeria: [
      { emoji: "🥥", tom: "orange", alt: "Panela de moqueca com coentros" },
      { emoji: "🍴", tom: "lemon", alt: "Postas de peixe branco" }
    ],
    icone: "🥥",
    tom: "orange",
    preparacao: 20,
    cozedura: 25,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 700, "u": "g", "n": "postas de peixe branco (pescada ou cherne)"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "sumo de limão"},
        {"q": 2, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 2, "u": "", "n": "pimentos (um vermelho e um verde)", "ns": "pimento", "inteiro": true},
        {"q": 3, "u": "", "n": "tomates", "ns": "tomate", "inteiro": true},
        {"q": 400, "u": "ml", "n": "leite de coco"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite de dendê ou azeite"},
        {"q": 1, "u": "molho", "up": "molhos", "n": "coentros", "ns": "coentros"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Temperar o peixe",
        x: "Tempera o peixe com sal, o limão e o alho picado. Deixa 15 minutos." },
      { t: "Fazer a base",
        x: "Corta a cebola, o pimento e o tomate em rodelas. Aquece o azeite numa panela e faz camadas de cebola, tomate e pimento." },
      { t: "Cozinhar",
        x: "Junta o peixe, o leite de coco e metade dos coentros picados. Tapa e cozinha em lume brando 15 a 20 minutos, sem mexer." },
      { t: "Servir",
        x: "Retifica o sal, finaliza com coentros frescos e serve com arroz branco." }
    ],
    dicas: [
      { t: "Azeite de dendê", x: "Se encontrares azeite de dendê, usa-o. Dá a cor e o sabor típicos da moqueca." },
      { t: "Peixe firme", x: "Escolhe peixe de carne firme, que não se desfaz na cozedura." },
      { t: "Acompanhamento", x: "Combina bem com arroz branco e farofa." }
    ],
    nutricao: { calorias: 390, proteina: 34, hidratos: 12, acucares: 6, gordura: 23, saturada: 15, fibra: 3, sal: 0.8 }
  },
  /* 63. COXINHAS (brasileira, entradas) */
  {
    id: "coxinhas",
    titulo: "Coxinhas",
    descricao: "Salgado brasileiro em forma de gota, com recheio de frango desfiado e massa cremosa, panado e frito.",
    categoria: { pais: "brasileira", tipo: "entradas" },
    alimento: ["aves"],
    dieta: [],
    imagem: criarImagem("🍗", "lemon", "Coxinhas douradas"),
    galeria: [
      { emoji: "🍗", tom: "lemon", alt: "Coxinhas douradas" },
      { emoji: "🍴", tom: "lemon", alt: "Recheio de frango desfiado" }
    ],
    icone: "🍗",
    tom: "lemon",
    preparacao: 60,
    cozedura: 20,
    porcoes: 8,
    dificuldade: "dificil",
    ingredientes: [
      { titulo: "Massa", itens: [
        {"q": 500, "u": "ml", "n": "caldo de galinha"},
        {"q": 250, "u": "g", "n": "farinha de trigo"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "manteiga"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "sal"}
      ]},
      { titulo: "Recheio", itens: [
        {"q": 300, "u": "g", "n": "peito de frango cozido e desfiado"},
        {"q": 1, "u": "", "n": "cebolas pequenas", "ns": "cebola pequena", "inteiro": true},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "salsa picada"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"}
      ]},
      { titulo: "Para panar", itens: [
        {"q": 2, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 150, "u": "g", "n": "pão ralado"},
        {"q": 500, "u": "ml", "n": "óleo, para fritar"}
      ]}
    ],
    passos: [
      { t: "Fazer a massa",
        x: "Ferve o caldo com a manteiga e o sal. Junta a farinha de uma vez e mexe sem parar até a massa se desprender do tacho. Deixa arrefecer e amassa até ficar lisa." },
      { t: "Fazer o recheio",
        x: "Refoga a cebola e o alho no azeite. Junta o frango desfiado e a salsa e tempera a gosto." },
      { t: "Moldar",
        x: "Com uma porção de massa na palma da mão, coloca recheio no centro, fecha e molda em forma de gota." },
      { t: "Panar e fritar",
        x: "Passa pelo ovo batido e pelo pão ralado. Frita em óleo quente (170 °C) até ficarem douradas. Escorre e serve quentes." }
    ],
    dicas: [
      { t: "Massa lisa", x: "Amassa enquanto a massa está morna, para ficar lisa e sem grumos." },
      { t: "Congelar", x: "Podes congelar as coxinhas por fritar e fritá-las ainda congeladas." },
      { t: "Molho", x: "Servem-se bem com molho picante ou maionese de ervas." }
    ],
    nutricao: { calorias: 310, proteina: 17, hidratos: 33, acucares: 1, gordura: 12, saturada: 2, fibra: 1, sal: 0.9 }
  },
  /* 64. AÇAÍ NA TIGELA (brasileira, pequeno-almoco) */
  {
    id: "acai-na-tigela",
    titulo: "Açaí na tigela",
    descricao: "Polpa de açaí batida com banana, servida com granola e fruta fresca. Um pequeno-almoço brasileiro refrescante.",
    categoria: { pais: "brasileira", tipo: "pequeno-almoco" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🫐", "plum", "Tigela de açaí com granola e fruta"),
    galeria: [
      { emoji: "🫐", tom: "plum", alt: "Tigela de açaí com granola e fruta" },
      { emoji: "🍴", tom: "lemon", alt: "Polpa de açaí congelada" }
    ],
    icone: "🫐",
    tom: "plum",
    preparacao: 10,
    cozedura: 0,
    porcoes: 2,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Base", itens: [
        {"q": 200, "u": "g", "n": "polpa de açaí congelada"},
        {"q": 2, "u": "", "n": "bananas congeladas", "ns": "banana congelada", "inteiro": true},
        {"q": 100, "u": "ml", "n": "leite vegetal ou sumo de laranja"}
      ]},
      { titulo: "Para cobrir", itens: [
        {"q": 60, "u": "g", "n": "granola"},
        {"q": 1, "u": "", "n": "banana em rodelas", "ns": "banana em rodelas", "inteiro": true},
        {"q": 100, "u": "g", "n": "morangos"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "mel ou xarope de ácer"}
      ]}
    ],
    passos: [
      { t: "Bater a base",
        x: "Tritura a polpa de açaí, as bananas congeladas e o leite vegetal até obteres um creme espesso, tipo gelado." },
      { t: "Servir",
        x: "Distribui por duas tigelas e alisa a superfície." },
      { t: "Cobrir",
        x: "Decora com a granola, a banana, os morangos cortados e um fio de mel." },
      { t: "Comer de imediato",
        x: "Come logo, antes de derreter." }
    ],
    dicas: [
      { t: "Textura", x: "Usa pouco líquido: a mistura deve ficar espessa, para comer à colher." },
      { t: "Sem açaí", x: "Se não encontrares açaí, usa frutos vermelhos congelados." },
      { t: "Mais proteína", x: "Junta uma colher de manteiga de amendoim ou de iogurte grego." }
    ],
    nutricao: { calorias: 380, proteina: 6, hidratos: 68, acucares: 38, gordura: 10, saturada: 2, fibra: 8, sal: 0.1 }
  },
  /* 65. BOLO DE CENOURA COM COBERTURA DE CHOCOLATE (brasileira, sobremesas) */
  {
    id: "bolo-de-cenoura-com-chocolate",
    titulo: "Bolo de cenoura com cobertura de chocolate",
    descricao: "Bolo fofo de cenoura feito no liquidificador, com uma cobertura brilhante de chocolate. Um clássico brasileiro.",
    categoria: { pais: "brasileira", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🥕", "orange", "Fatia de bolo de cenoura com chocolate"),
    galeria: [
      { emoji: "🥕", tom: "orange", alt: "Fatia de bolo de cenoura com chocolate" },
      { emoji: "🍴", tom: "lemon", alt: "Cenouras frescas e cacau" }
    ],
    icone: "🥕",
    tom: "orange",
    preparacao: 20,
    cozedura: 40,
    porcoes: 12,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Bolo", itens: [
        {"q": 3, "u": "", "n": "cenouras médias, em rodelas", "ns": "cenoura média, em rodelas", "inteiro": true},
        {"q": 4, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 200, "u": "ml", "n": "óleo de girassol"},
        {"q": 300, "u": "g", "n": "açúcar"},
        {"q": 300, "u": "g", "n": "farinha de trigo"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "fermento em pó"}
      ]},
      { titulo: "Cobertura", itens: [
        {"q": 200, "u": "g", "n": "chocolate de culinária"},
        {"q": 100, "u": "ml", "n": "natas"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "manteiga"}
      ]}
    ],
    passos: [
      { t: "Bater a massa",
        x: "Pré-aquece o forno a 180 °C. Tritura as cenouras com os ovos, o óleo e o açúcar até ficar liso." },
      { t: "Juntar a farinha",
        x: "Passa o preparado para uma taça, junta a farinha e o fermento peneirados e mistura bem." },
      { t: "Cozer",
        x: "Verte numa forma untada e coze 35 a 40 minutos, até um palito sair limpo. Deixa arrefecer." },
      { t: "Fazer a cobertura",
        x: "Derrete o chocolate com as natas e a manteiga em lume brando, mexendo. Cobre o bolo ainda morno e deixa assentar." }
    ],
    dicas: [
      { t: "Cenouras bem trituradas", x: "Se ficarem pedaços, o bolo perde a textura. Tritura bem." },
      { t: "Cobertura brilhante", x: "Deixa a cobertura arrefecer 5 minutos antes de a deitar, para não escorrer toda." },
      { t: "Conservar", x: "Mantém-se 4 dias bem tapado, fora do frigorífico." }
    ],
    nutricao: { calorias: 390, proteina: 5, hidratos: 52, acucares: 34, gordura: 19, saturada: 6, fibra: 2, sal: 0.3 }
  },
  /* 66. GNOCCHI DE BATATA (italiana, pratos-principais) */
  {
    id: "gnocchi-de-batata",
    titulo: "Gnocchi de batata",
    descricao: "Bolinhas de massa de batata, macias como nuvens, com molho de manteiga e salva. Uma massa caseira italiana.",
    categoria: { pais: "italiana", tipo: "pratos-principais" },
    alimento: ["massas", "vegetariano"],
    dieta: [],
    imagem: criarImagem("🥔", "lemon", "Gnocchi com manteiga e salva"),
    galeria: [
      { emoji: "🥔", tom: "lemon", alt: "Gnocchi com manteiga e salva" },
      { emoji: "🍴", tom: "lemon", alt: "Massa de gnocchi a ser cortada" }
    ],
    icone: "🥔",
    tom: "lemon",
    preparacao: 45,
    cozedura: 15,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Massa", itens: [
        {"q": 800, "u": "g", "n": "batatas farinhentas"},
        {"q": 250, "u": "g", "n": "farinha de trigo"},
        {"q": 1, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "sal"}
      ]},
      { titulo: "Molho", itens: [
        {"q": 60, "u": "g", "n": "manteiga"},
        {"q": 8, "u": "", "n": "folhas de salva", "ns": "folha de salva", "inteiro": true},
        {"q": 40, "u": "g", "n": "queijo parmesão ralado"}
      ]}
    ],
    passos: [
      { t: "Cozer as batatas",
        x: "Coze as batatas com casca em água, 30 a 40 minutos, até ficarem tenras. Escorre e descasca ainda quentes." },
      { t: "Fazer a massa",
        x: "Passa as batatas por um passa-purés. Junta o ovo, o sal e a maior parte da farinha e amassa rapidamente, só até obter uma massa macia." },
      { t: "Cortar",
        x: "Faz rolos de 2 cm de espessura e corta-os em pedaços de 2 cm. Passa cada um pelas costas de um garfo, se quiseres as ranhuras." },
      { t: "Cozer os gnocchi",
        x: "Coze em água a ferver com sal. Estão prontos quando sobem à superfície, cerca de 2 minutos. Escorre." },
      { t: "Molho",
        x: "Derrete a manteiga com a salva até ficar ligeiramente dourada. Envolve os gnocchi e serve com parmesão." }
    ],
    dicas: [
      { t: "Batatas secas", x: "Quanto mais secas as batatas, menos farinha precisas, e mais leves ficam os gnocchi." },
      { t: "Pouca amassadura", x: "Amassar demais torna a massa dura. Trabalha-a o mínimo." },
      { t: "Teste", x: "Cozer um gnocchi de teste mostra se a massa precisa de mais farinha." }
    ],
    nutricao: { calorias: 490, proteina: 15, hidratos: 76, acucares: 3, gordura: 15, saturada: 9, fibra: 5, sal: 1.2 }
  },
  /* 67. PENNE ALL’ARRABBIATA (italiana, pratos-principais) */
  {
    id: "penne-arrabbiata",
    titulo: "Penne all’arrabbiata",
    descricao: "Penne com um molho de tomate picante, alho e piri-piri. Simples, rápido e cheio de sabor.",
    categoria: { pais: "italiana", tipo: "pratos-principais" },
    alimento: ["massas", "vegetariano", "vegan"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🌶️", "tomato", "Prato de penne all’arrabbiata"),
    galeria: [
      { emoji: "🌶️", tom: "tomato", alt: "Prato de penne all’arrabbiata" },
      { emoji: "🍴", tom: "lemon", alt: "Tomate, alho e piri-piri" }
    ],
    icone: "🌶️",
    tom: "tomato",
    preparacao: 10,
    cozedura: 20,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 400, "u": "g", "n": "penne"},
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 4, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "piri-piri em flocos"},
        {"q": 800, "u": "g", "n": "tomate pelado em lata"},
        {"q": null, "n": "salsa"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Fazer o molho",
        x: "Aquece o azeite com o alho laminado e o piri-piri, em lume brando, cerca de 1 minuto." },
      { t: "Juntar o tomate",
        x: "Junta o tomate esmagado, tempera com sal e cozinha 15 minutos em lume médio, até engrossar." },
      { t: "Cozer a massa",
        x: "Cozer os penne em água com sal, 1 minuto menos do que indica a embalagem. Guarda uma chávena da água de cozedura." },
      { t: "Juntar",
        x: "Escorre a massa e envolve-a no molho, com um pouco da água reservada, 1 minuto. Serve com salsa picada." }
    ],
    dicas: [
      { t: "Picante ao gosto", x: "Ajusta a quantidade de piri-piri à tua tolerância." },
      { t: "Água de cozedura", x: "A água do amido ajuda o molho a ligar-se à massa." },
      { t: "Com queijo", x: "Se não for vegan, fica ótimo com pecorino ou parmesão ralado." }
    ],
    nutricao: { calorias: 480, proteina: 15, hidratos: 86, acucares: 10, gordura: 9, saturada: 1, fibra: 6, sal: 1.1 }
  },
  /* 68. MINESTRONE (italiana, entradas) */
  {
    id: "minestrone",
    titulo: "Minestrone",
    descricao: "Sopa italiana de legumes com feijão e massa. Substancial, colorida e perfeita para dias frios.",
    categoria: { pais: "italiana", tipo: "entradas" },
    alimento: ["sopas", "vegetariano", "vegan"],
    dieta: ["sem-lactose", "fitness"],
    imagem: criarImagem("🥣", "basil", "Tigela de minestrone com legumes"),
    galeria: [
      { emoji: "🥣", tom: "basil", alt: "Tigela de minestrone com legumes" },
      { emoji: "🍴", tom: "lemon", alt: "Legumes cortados para a sopa" }
    ],
    icone: "🥣",
    tom: "basil",
    preparacao: 20,
    cozedura: 35,
    porcoes: 6,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 2, "u": "", "n": "cenouras", "ns": "cenoura", "inteiro": true},
        {"q": 2, "u": "", "n": "talos de aipo", "ns": "talo de aipo", "inteiro": true},
        {"q": 2, "u": "", "n": "curgetes", "ns": "curgete", "inteiro": true},
        {"q": 2, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 400, "u": "g", "n": "tomate pelado"},
        {"q": 1000, "u": "ml", "n": "caldo de legumes"},
        {"q": 1, "u": "lata", "up": "latas", "n": "feijão branco, escorrido (cerca de 400 g)"},
        {"q": 100, "u": "g", "n": "massa pequena"},
        {"q": null, "n": "manjericão fresco"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Refogar",
        x: "Aquece o azeite e refoga a cebola, a cenoura e o aipo cortados em cubos pequenos, 8 minutos." },
      { t: "Juntar os legumes",
        x: "Junta o alho e a curgete e cozinha 2 minutos. Acrescenta o tomate esmagado e o caldo." },
      { t: "Cozinhar",
        x: "Deixa ferver e cozinha em lume brando 15 minutos. Junta o feijão e a massa e cozinha até a massa estar al dente." },
      { t: "Servir",
        x: "Tempera com sal e serve com manjericão fresco e um fio de azeite." }
    ],
    dicas: [
      { t: "Legumes à escolha", x: "Usa os legumes da estação: feijão-verde, couve, batata ou ervilhas também resultam." },
      { t: "Mais denso", x: "Esmaga alguns feijões na panela para engrossar a sopa." },
      { t: "No dia seguinte", x: "Fica ainda melhor depois de repousar uma noite no frigorífico." }
    ],
    nutricao: { calorias: 240, proteina: 9, hidratos: 38, acucares: 8, gordura: 6, saturada: 1, fibra: 9, sal: 1.0 }
  },
  /* 69. FOCACCIA (italiana, entradas) */
  {
    id: "focaccia",
    titulo: "Focaccia",
    descricao: "Pão italiano achatado, fofo por dentro e estaladiço por fora, com azeite e alecrim.",
    categoria: { pais: "italiana", tipo: "entradas" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍞", "lemon", "Focaccia com alecrim e flor de sal"),
    galeria: [
      { emoji: "🍞", tom: "lemon", alt: "Focaccia com alecrim e flor de sal" },
      { emoji: "🍴", tom: "lemon", alt: "Massa de focaccia com covinhas" }
    ],
    icone: "🍞",
    tom: "lemon",
    preparacao: 30,
    cozedura: 25,
    repouso: 120,
    porcoes: 8,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Massa", itens: [
        {"q": 500, "u": "g", "n": "farinha de trigo forte"},
        {"q": 400, "u": "ml", "n": "água morna"},
        {"q": 7, "u": "g", "n": "fermento de padeiro seco"},
        {"q": 10, "u": "g", "n": "sal"},
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"}
      ]},
      { titulo: "Para cobrir", itens: [
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "flor de sal"},
        {"q": 2, "u": "", "n": "ramos de alecrim", "ns": "ramo de alecrim", "inteiro": true}
      ]}
    ],
    passos: [
      { t: "Misturar",
        x: "Mistura a farinha, o fermento, o sal e a água. A massa fica bastante húmida. Junta o azeite e mexe até estar homogénea." },
      { t: "Levedar",
        x: "Tapa e deixa levedar 1 hora e meia, até duplicar de volume." },
      { t: "Formar",
        x: "Vira a massa para um tabuleiro bem untado com azeite, estica-a com cuidado e deixa repousar 20 minutos." },
      { t: "Fazer as covinhas",
        x: "Com as pontas dos dedos, faz covinhas na massa. Rega com azeite e espalha o alecrim e a flor de sal." },
      { t: "Cozer",
        x: "Coze a 220 °C, durante 20 a 25 minutos, até ficar dourada." }
    ],
    dicas: [
      { t: "Muito azeite", x: "O azeite no tabuleiro e à superfície dá a côdea estaladiça." },
      { t: "Massa húmida", x: "Não acrescentes farinha: a massa húmida dá o miolo aberto e leve." },
      { t: "Variações", x: "Experimenta com tomate cherry, azeitonas ou cebola em cima." }
    ],
    nutricao: { calorias: 300, proteina: 7, hidratos: 46, acucares: 1, gordura: 9, saturada: 1.3, fibra: 2, sal: 1.1 }
  },
  /* 70. CACIO E PEPE (italiana, pratos-principais) */
  {
    id: "cacio-e-pepe",
    titulo: "Cacio e pepe",
    descricao: "Massa romana com apenas três ingredientes: pecorino, pimenta preta e massa. Cremosa sem natas.",
    categoria: { pais: "italiana", tipo: "pratos-principais" },
    alimento: ["massas", "vegetariano"],
    dieta: [],
    imagem: criarImagem("🧀", "lemon", "Prato de cacio e pepe"),
    galeria: [
      { emoji: "🧀", tom: "lemon", alt: "Prato de cacio e pepe" },
      { emoji: "🍴", tom: "lemon", alt: "Pecorino ralado e pimenta preta" }
    ],
    icone: "🧀",
    tom: "lemon",
    preparacao: 5,
    cozedura: 15,
    porcoes: 2,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 200, "u": "g", "n": "spaghetti ou tonnarelli"},
        {"q": 100, "u": "g", "n": "queijo pecorino romano ralado fino"},
        {"q": 2, "u": "colher de chá", "up": "colheres de chá", "n": "pimenta preta em grão"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Torrar a pimenta",
        x: "Esmaga a pimenta e torra-a numa frigideira seca 1 minuto, até libertar o aroma." },
      { t: "Cozer a massa",
        x: "Cozer a massa em pouca água com sal, para a água ficar rica em amido. Guarda 1 chávena da água." },
      { t: "Fazer o creme",
        x: "Mistura o pecorino com um pouco de água morna da massa até formar uma pasta cremosa." },
      { t: "Juntar",
        x: "Escorre a massa, junta-a à pimenta na frigideira com um pouco de água, retira do lume e envolve o creme de queijo, mexendo depressa. Serve logo." }
    ],
    dicas: [
      { t: "Fora do lume", x: "O queijo não pode aquecer demais, ou forma grumos. Mistura sempre fora do lume." },
      { t: "Queijo ralado fino", x: "Quanto mais fino o queijo, mais facilmente derrete." },
      { t: "Água do amido", x: "A água de cozedura com amido é o que torna o molho cremoso." }
    ],
    nutricao: { calorias: 560, proteina: 26, hidratos: 68, acucares: 2, gordura: 19, saturada: 10, fibra: 3, sal: 1.6 }
  },
  /* 71. PANZANELLA (italiana, entradas) */
  {
    id: "panzanella",
    titulo: "Panzanella",
    descricao: "Salada toscana de pão duro, tomate maduro, pepino e manjericão. A melhor forma de aproveitar o pão do dia anterior.",
    categoria: { pais: "italiana", tipo: "entradas" },
    alimento: ["saladas", "vegetariano", "vegan"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍅", "tomato", "Panzanella com tomate e manjericão"),
    galeria: [
      { emoji: "🍅", tom: "tomato", alt: "Panzanella com tomate e manjericão" },
      { emoji: "🍴", tom: "lemon", alt: "Pão e tomates maduros" }
    ],
    icone: "🍅",
    tom: "tomato",
    preparacao: 15,
    cozedura: 0,
    repouso: 20,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 250, "u": "g", "n": "pão duro, em cubos"},
        {"q": 500, "u": "g", "n": "tomates maduros"},
        {"q": 1, "u": "", "n": "pepinos pequenos", "ns": "pepino pequeno", "inteiro": true},
        {"q": 1, "u": "", "n": "cebolas roxas pequenas", "ns": "cebola roxa pequena", "inteiro": true},
        {"q": 1, "u": "mão-cheia", "up": "mãos-cheias", "n": "folhas de manjericão"},
        {"q": 5, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "vinagre de vinho tinto"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Preparar os legumes",
        x: "Corta os tomates, o pepino e a cebola em pedaços. Mistura numa taça com sal e deixa largar sumo 10 minutos." },
      { t: "Torrar o pão",
        x: "Se o pão não estiver bem duro, torra os cubos no forno 10 minutos a 180 °C." },
      { t: "Misturar",
        x: "Junta o pão, o manjericão rasgado, o azeite e o vinagre e envolve." },
      { t: "Repousar",
        x: "Deixa repousar 20 minutos, para o pão absorver o sumo, e serve à temperatura ambiente." }
    ],
    dicas: [
      { t: "Tomate maduro", x: "O sabor depende do tomate. Usa-o bem maduro." },
      { t: "Pão rústico", x: "Um pão de miolo denso aguenta melhor o molho." },
      { t: "Mais completa", x: "Junta mozzarella ou atum para uma refeição." }
    ],
    nutricao: { calorias: 310, proteina: 7, hidratos: 38, acucares: 8, gordura: 14, saturada: 2, fibra: 4, sal: 0.8 }
  },
  /* 72. MASSA AO PESTO GENOVÊS (italiana, pratos-principais) */
  {
    id: "pesto-genovese",
    titulo: "Massa ao pesto genovês",
    descricao: "Massa com pesto fresco de manjericão, pinhões e parmesão. Aromático e rápido de fazer.",
    categoria: { pais: "italiana", tipo: "pratos-principais" },
    alimento: ["massas", "vegetariano"],
    dieta: [],
    imagem: criarImagem("🌿", "basil", "Massa com pesto de manjericão"),
    galeria: [
      { emoji: "🌿", tom: "basil", alt: "Massa com pesto de manjericão" },
      { emoji: "🍴", tom: "lemon", alt: "Manjericão fresco e pinhões" }
    ],
    icone: "🌿",
    tom: "basil",
    preparacao: 10,
    cozedura: 12,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Pesto", itens: [
        {"q": 60, "u": "g", "n": "folhas de manjericão fresco"},
        {"q": 40, "u": "g", "n": "pinhões"},
        {"q": 50, "u": "g", "n": "queijo parmesão ralado"},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 120, "u": "ml", "n": "azeite"},
        {"q": null, "n": "sal"}
      ]},
      { titulo: "Massa", itens: [
        {"q": 400, "u": "g", "n": "trofie ou fusilli"}
      ]}
    ],
    passos: [
      { t: "Fazer o pesto",
        x: "Tritura o manjericão, os pinhões, o alho e o sal. Junta o parmesão e o azeite aos poucos, até obter um molho cremoso." },
      { t: "Cozer a massa",
        x: "Coze a massa em água com sal até ficar al dente. Guarda uma chávena da água." },
      { t: "Juntar",
        x: "Escorre a massa e envolve-a no pesto, com um pouco da água reservada, para ficar cremoso." },
      { t: "Servir",
        x: "Serve de imediato, com parmesão e folhas de manjericão." }
    ],
    dicas: [
      { t: "Pesto não cozinha", x: "Junta o pesto fora do lume, para o manjericão não escurecer." },
      { t: "Conservar", x: "Cobre o pesto com azeite e guarda no frigorífico até 5 dias." },
      { t: "Alternativas", x: "Sem pinhões, usa amêndoas ou nozes." }
    ],
    nutricao: { calorias: 670, proteina: 19, hidratos: 65, acucares: 3, gordura: 38, saturada: 7, fibra: 4, sal: 0.9 }
  },
  /* 73. AFFOGATO (italiana, sobremesas) */
  {
    id: "affogato",
    titulo: "Affogato",
    descricao: "Uma bola de gelado de baunilha “afogada” em café expresso quente. Sobremesa italiana em 2 minutos.",
    categoria: { pais: "italiana", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("☕", "plum", "Affogato com café a ser vertido"),
    galeria: [
      { emoji: "☕", tom: "plum", alt: "Affogato com café a ser vertido" },
      { emoji: "🍴", tom: "lemon", alt: "Gelado de baunilha numa taça" }
    ],
    icone: "☕",
    tom: "plum",
    preparacao: 2,
    cozedura: 0,
    porcoes: 2,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 4, "u": "", "n": "bolas de gelado de baunilha", "ns": "bola de gelado de baunilha", "inteiro": true},
        {"q": 120, "u": "ml", "n": "café expresso quente"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "amêndoa laminada torrada"}
      ]}
    ],
    passos: [
      { t: "Preparar o café",
        x: "Faz 2 cafés expresso e mantém-nos quentes." },
      { t: "Servir o gelado",
        x: "Coloca duas bolas de gelado em cada taça ou copo." },
      { t: "Afogar",
        x: "Verte o café quente sobre o gelado, à mesa, para não derreter antes." },
      { t: "Finalizar",
        x: "Decora com a amêndoa torrada e come de imediato." }
    ],
    dicas: [
      { t: "Café forte", x: "Um expresso bem concentrado equilibra a doçura do gelado." },
      { t: "Gelado de qualidade", x: "Um bom gelado de baunilha faz toda a diferença." },
      { t: "Variações", x: "Experimenta um fio de licor de amêndoa ou de avelã." }
    ],
    nutricao: { calorias: 260, proteina: 4, hidratos: 28, acucares: 26, gordura: 14, saturada: 8, fibra: 0, sal: 0.2 }
  },
  /* 74. TEMPURA DE LEGUMES (japonesa, entradas) */
  {
    id: "tempura-de-legumes",
    titulo: "Tempura de legumes",
    descricao: "Legumes em polme leve e estaladiço, fritos num instante. Um clássico japonês.",
    categoria: { pais: "japonesa", tipo: "entradas" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍤", "orange", "Tempura de legumes dourada"),
    galeria: [
      { emoji: "🍤", tom: "orange", alt: "Tempura de legumes dourada" },
      { emoji: "🍴", tom: "lemon", alt: "Legumes cortados para tempura" }
    ],
    icone: "🍤",
    tom: "orange",
    preparacao: 15,
    cozedura: 10,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Legumes", itens: [
        {"q": 1, "u": "", "n": "batatas-doces pequenas", "ns": "batata-doce pequena", "inteiro": true},
        {"q": 1, "u": "", "n": "curgetes", "ns": "curgete", "inteiro": true},
        {"q": 1, "u": "", "n": "pimentos", "ns": "pimento", "inteiro": true},
        {"q": 150, "u": "g", "n": "cogumelos"}
      ]},
      { titulo: "Polme", itens: [
        {"q": 120, "u": "g", "n": "farinha de trigo"},
        {"q": 1, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 200, "u": "ml", "n": "água gelada"},
        {"q": 500, "u": "ml", "n": "óleo, para fritar"}
      ]},
      { titulo: "Molho", itens: [
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "molho de soja"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "água"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "açúcar"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "sumo de limão"}
      ]}
    ],
    passos: [
      { t: "Cortar",
        x: "Corta a batata-doce, a curgete e o pimento em tiras finas. Limpa os cogumelos e seca bem os legumes." },
      { t: "Fazer o polme",
        x: "Mistura a água gelada com o ovo. Junta a farinha e mexe muito pouco, com garfo ou pauzinhos. Devem ficar grumos." },
      { t: "Fritar",
        x: "Aquece o óleo a 170-180 °C. Mergulha os legumes no polme e frita 2 a 3 minutos, até ficarem dourados e estaladiços." },
      { t: "Servir",
        x: "Escorre em papel absorvente. Mistura os ingredientes do molho e serve para molhar." }
    ],
    dicas: [
      { t: "Água bem gelada", x: "O contraste de temperatura dá o polme leve e estaladiço." },
      { t: "Pouco mexer", x: "Mexer demais desenvolve o glúten e o polme fica pesado." },
      { t: "Fritar poucos", x: "Frita poucos pedaços de cada vez, para o óleo não arrefecer." }
    ],
    nutricao: { calorias: 280, proteina: 6, hidratos: 36, acucares: 7, gordura: 12, saturada: 2, fibra: 4, sal: 1.3 }
  },
  /* 75. YAKISOBA (japonesa, pratos-principais) */
  {
    id: "yakisoba",
    titulo: "Yakisoba",
    descricao: "Noodles salteados com legumes e frango num molho agridoce. Rápido e cheio de sabor.",
    categoria: { pais: "japonesa", tipo: "pratos-principais" },
    alimento: ["massas", "aves"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍜", "orange", "Prato de yakisoba com legumes"),
    galeria: [
      { emoji: "🍜", tom: "orange", alt: "Prato de yakisoba com legumes" },
      { emoji: "🍴", tom: "lemon", alt: "Noodles e legumes no wok" }
    ],
    icone: "🍜",
    tom: "orange",
    preparacao: 15,
    cozedura: 10,
    porcoes: 3,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 300, "u": "g", "n": "noodles de trigo"},
        {"q": 250, "u": "g", "n": "peito de frango, em tiras"},
        {"q": 2, "u": "", "n": "cenouras", "ns": "cenoura", "inteiro": true},
        {"q": 200, "u": "g", "n": "couve branca, em tiras"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 2, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "óleo"}
      ]},
      { titulo: "Molho", itens: [
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "molho de soja"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "ketchup"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "molho de ostras"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "açúcar"}
      ]}
    ],
    passos: [
      { t: "Cozer os noodles",
        x: "Coze os noodles segundo a embalagem, escorre e passa por água fria." },
      { t: "Saltear o frango",
        x: "Aquece metade do óleo num wok e salteia o frango 4 a 5 minutos. Reserva." },
      { t: "Saltear os legumes",
        x: "No mesmo wok, junta o resto do óleo, a cebola, a cenoura, o alho e a couve e salteia 4 minutos em lume forte." },
      { t: "Juntar tudo",
        x: "Volta a pôr o frango, junta os noodles e o molho misturado e salteia 2 minutos. Serve quente." }
    ],
    dicas: [
      { t: "Lume forte", x: "O wok bem quente dá o sabor típico e deixa os legumes estaladiços." },
      { t: "Versão vegetariana", x: "Troca o frango por tofu e o molho de ostras por molho de soja." },
      { t: "Pauzinhos", x: "Serve com gengibre em conserva e nori, se tiveres." }
    ],
    nutricao: { calorias: 520, proteina: 29, hidratos: 70, acucares: 10, gordura: 13, saturada: 2, fibra: 5, sal: 2.4 }
  },
  /* 76. GYOZAS DE PORCO (japonesa, entradas) */
  {
    id: "gyozas",
    titulo: "Gyozas de porco",
    descricao: "Pastéis japoneses recheados de porco e couve, cozinhados na frigideira e a vapor. Crocantes por baixo, macios por cima.",
    categoria: { pais: "japonesa", tipo: "entradas" },
    alimento: ["carne"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🥟", "sky", "Gyozas douradas na frigideira"),
    galeria: [
      { emoji: "🥟", tom: "sky", alt: "Gyozas douradas na frigideira" },
      { emoji: "🍴", tom: "lemon", alt: "Pastéis de porco com molho de soja" }
    ],
    icone: "🥟",
    tom: "sky",
    preparacao: 45,
    cozedura: 10,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Recheio", itens: [
        {"q": 250, "u": "g", "n": "carne de porco picada"},
        {"q": 150, "u": "g", "n": "couve chinesa ou couve branca, picada fina"},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 1, "u": "cm", "n": "gengibre ralado"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "molho de soja"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "óleo de sésamo"}
      ]},
      { titulo: "Massa e cozedura", itens: [
        {"q": 24, "u": "", "n": "folhas de massa para gyoza", "ns": "folha de massa para gyoza", "inteiro": true},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "óleo"},
        {"q": 100, "u": "ml", "n": "água"}
      ]},
      { titulo: "Molho", itens: [
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "molho de soja"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "vinagre de arroz"}
      ]}
    ],
    passos: [
      { t: "Fazer o recheio",
        x: "Mistura a carne com a couve, o alho, o gengibre, o molho de soja e o óleo de sésamo. Amassa bem até ficar pegajoso." },
      { t: "Rechear",
        x: "Coloca uma colher de recheio no centro de cada folha, humedece a borda com água, dobra ao meio e faz pregas para fechar." },
      { t: "Dourar",
        x: "Aquece o óleo numa frigideira antiaderente e coloca os gyozas lado a lado. Deixa dourar 2 minutos." },
      { t: "Cozer a vapor",
        x: "Junta a água, tapa de imediato e cozinha 5 a 6 minutos, até a água evaporar. Retira a tampa e deixa a base ficar crocante." },
      { t: "Servir",
        x: "Mistura o molho de soja com o vinagre e serve para molhar." }
    ],
    dicas: [
      { t: "Couve sem água", x: "Espreme bem a couve depois de a picar, para o recheio não ficar aguado." },
      { t: "Congelar", x: "Congela os gyozas crus numa tabuleira e depois num saco. Vão à frigideira sem descongelar." },
      { t: "Versão vegetariana", x: "Troca a carne por tofu esmigalhado e cogumelos." }
    ],
    nutricao: { calorias: 310, proteina: 15, hidratos: 30, acucares: 2, gordura: 14, saturada: 4, fibra: 2, sal: 1.6 }
  },
  /* 77. FRANGO TERIYAKI (japonesa, pratos-principais) */
  {
    id: "frango-teriyaki",
    titulo: "Frango teriyaki",
    descricao: "Frango salteado numa calda brilhante de soja, mel e gengibre. Um prato japonês rápido para servir com arroz.",
    categoria: { pais: "japonesa", tipo: "pratos-principais" },
    alimento: ["aves", "arroz"],
    dieta: ["sem-lactose", "rica-em-proteina"],
    imagem: criarImagem("🍗", "tomato", "Frango teriyaki com arroz e sésamo"),
    galeria: [
      { emoji: "🍗", tom: "tomato", alt: "Frango teriyaki com arroz e sésamo" },
      { emoji: "🍴", tom: "lemon", alt: "Pedaços de frango com molho brilhante" }
    ],
    icone: "🍗",
    tom: "tomato",
    preparacao: 15,
    cozedura: 15,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Frango", itens: [
        {"q": 600, "u": "g", "n": "coxas de frango desossadas"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "óleo"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "sementes de sésamo"}
      ]},
      { titulo: "Molho teriyaki", itens: [
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "molho de soja"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "mel"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "vinagre de arroz"},
        {"q": 1, "u": "cm", "n": "gengibre ralado"},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"}
      ]},
      { titulo: "Para servir", itens: [
        {"q": 300, "u": "g", "n": "arroz japonês"},
        {"q": 2, "u": "", "n": "cebolinhas", "ns": "cebolinha", "inteiro": true}
      ]}
    ],
    passos: [
      { t: "Cozer o arroz",
        x: "Lava o arroz e coze-o com o dobro do volume de água, em lume brando e tapado, 15 minutos. Deixa repousar tapado." },
      { t: "Fazer o molho",
        x: "Mistura o molho de soja, o mel, o vinagre, o gengibre e o alho." },
      { t: "Dourar o frango",
        x: "Corta o frango em pedaços e doura-o no óleo quente, 6 a 7 minutos, até ficar cozinhado." },
      { t: "Envernizar",
        x: "Junta o molho e deixa reduzir 3 a 4 minutos, virando o frango, até a calda ficar espessa e brilhante." },
      { t: "Servir",
        x: "Serve sobre o arroz com o sésamo e a cebolinha cortada." }
    ],
    dicas: [
      { t: "Coxas, não peito", x: "As coxas ficam mais suculentas e aguentam bem o molho." },
      { t: "Lume médio", x: "Com lume alto o açúcar do mel queima. Vigia a calda no fim." },
      { t: "Marinar", x: "Se tiveres tempo, marina o frango 30 minutos no molho." }
    ],
    nutricao: { calorias: 520, proteina: 38, hidratos: 60, acucares: 16, gordura: 13, saturada: 3, fibra: 1, sal: 1.9 }
  },
  /* 78. MATCHA LATTE (japonesa, bebidas) */
  {
    id: "matcha-latte",
    titulo: "Matcha latte",
    descricao: "Chá verde em pó batido com leite quente e espumoso. Suave, cremoso e cheio de cor.",
    categoria: { pais: "japonesa", tipo: "bebidas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🍵", "basil", "Chávena de matcha latte"),
    galeria: [
      { emoji: "🍵", tom: "basil", alt: "Chávena de matcha latte" },
      { emoji: "🍴", tom: "lemon", alt: "Pó de matcha verde" }
    ],
    icone: "🍵",
    tom: "basil",
    preparacao: 5,
    cozedura: 2,
    porcoes: 1,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 2, "u": "colher de chá", "up": "colheres de chá", "n": "matcha em pó"},
        {"q": 50, "u": "ml", "n": "água quente (não a ferver)"},
        {"q": 250, "u": "ml", "n": "leite"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "mel ou açúcar"}
      ]}
    ],
    passos: [
      { t: "Peneirar",
        x: "Peneira o matcha para uma chávena, para não ficar com grumos." },
      { t: "Bater",
        x: "Junta a água quente e bate com um batedor de bambu ou um pequeno batedor de leite, em zigue-zague, até ficar com espuma fina." },
      { t: "Aquecer o leite",
        x: "Aquece o leite sem deixar ferver e bate até ficar espumoso. Adoça a gosto." },
      { t: "Juntar",
        x: "Verte o leite sobre o matcha e serve de imediato." }
    ],
    dicas: [
      { t: "Água a 80 °C", x: "A água a ferver deixa o matcha amargo. Espera um minuto depois de ferver." },
      { t: "Leite vegetal", x: "Fica ótimo com bebida de aveia ou de amêndoa." },
      { t: "Em gelado", x: "Serve sobre gelo com leite frio." }
    ],
    nutricao: { calorias: 150, proteina: 8, hidratos: 16, acucares: 15, gordura: 6, saturada: 3, fibra: 0, sal: 0.2 }
  },
  /* 79. BURRITO DE FEIJÃO (mexicana, pratos-principais) */
  {
    id: "burrito-de-feijao",
    titulo: "Burrito de feijão",
    descricao: "Tortilha de trigo recheada de feijão, arroz, milho e queijo. Uma refeição mexicana prática e saborosa.",
    categoria: { pais: "mexicana", tipo: "pratos-principais" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🌯", "orange", "Burrito aberto com feijão e arroz"),
    galeria: [
      { emoji: "🌯", tom: "orange", alt: "Burrito aberto com feijão e arroz" },
      { emoji: "🍴", tom: "lemon", alt: "Burritos prontos a comer" }
    ],
    icone: "🌯",
    tom: "orange",
    preparacao: 15,
    cozedura: 15,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Recheio", itens: [
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "cominhos"},
        {"q": 1, "u": "lata", "up": "latas", "n": "feijão preto, escorrido"},
        {"q": 150, "u": "g", "n": "milho em lata, escorrido"},
        {"q": 200, "u": "g", "n": "arroz cozido"}
      ]},
      { titulo: "Montagem", itens: [
        {"q": 4, "u": "", "n": "tortilhas de trigo grandes", "ns": "tortilha de trigo grande", "inteiro": true},
        {"q": 100, "u": "g", "n": "queijo ralado"},
        {"q": 100, "u": "g", "n": "molho de tomate picante"},
        {"q": 1, "u": "", "n": "abacates", "ns": "abacate", "inteiro": true}
      ]}
    ],
    passos: [
      { t: "Refogar",
        x: "Aquece o azeite e refoga a cebola picada e o alho 5 minutos. Junta os cominhos." },
      { t: "Juntar o feijão",
        x: "Adiciona o feijão e o milho e cozinha 5 minutos, esmagando um pouco o feijão." },
      { t: "Aquecer as tortilhas",
        x: "Aquece as tortilhas numa frigideira seca, meio minuto de cada lado." },
      { t: "Montar",
        x: "Põe arroz, feijão, queijo, molho e abacate em fatias no centro. Dobra os lados e enrola bem." },
      { t: "Tostar",
        x: "Doura o burrito na frigideira, com a junta para baixo, 1 minuto de cada lado." }
    ],
    dicas: [
      { t: "Não encher demais", x: "Com muito recheio o burrito rebenta ao enrolar." },
      { t: "Tortilhas macias", x: "Embrulha as tortilhas aquecidas num pano para não secarem." },
      { t: "Para congelar", x: "Embrulha em película e congela. Aquece no forno." }
    ],
    nutricao: { calorias: 560, proteina: 19, hidratos: 78, acucares: 6, gordura: 19, saturada: 6, fibra: 13, sal: 1.7 }
  },
  /* 80. ENCHILADAS DE FRANGO (mexicana, pratos-principais) */
  {
    id: "enchiladas-de-frango",
    titulo: "Enchiladas de frango",
    descricao: "Tortilhas enroladas com frango desfiado, cobertas de molho de tomate e queijo gratinado.",
    categoria: { pais: "mexicana", tipo: "pratos-principais" },
    alimento: ["aves"],
    dieta: ["rica-em-proteina"],
    imagem: criarImagem("🌮", "tomato", "Enchiladas gratinadas com queijo"),
    galeria: [
      { emoji: "🌮", tom: "tomato", alt: "Enchiladas gratinadas com queijo" },
      { emoji: "🍴", tom: "lemon", alt: "Tabuleiro de enchiladas de frango" }
    ],
    icone: "🌮",
    tom: "tomato",
    preparacao: 25,
    cozedura: 25,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Recheio", itens: [
        {"q": 400, "u": "g", "n": "peito de frango cozido e desfiado"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 100, "u": "g", "n": "milho em lata, escorrido"}
      ]},
      { titulo: "Molho", itens: [
        {"q": 400, "u": "g", "n": "tomate pelado"},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "cominhos"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "pimentão doce"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "sal"}
      ]},
      { titulo: "Montagem", itens: [
        {"q": 8, "u": "", "n": "tortilhas de milho ou de trigo", "ns": "tortilha de milho ou de trigo", "inteiro": true},
        {"q": 150, "u": "g", "n": "queijo ralado"}
      ]}
    ],
    passos: [
      { t: "Fazer o molho",
        x: "Tritura o tomate com o alho, os cominhos, o pimentão e o sal. Cozinha 10 minutos em lume médio." },
      { t: "Preparar o recheio",
        x: "Refoga a cebola picada no azeite, junta o frango desfiado, o milho e 4 colheres de molho." },
      { t: "Encher",
        x: "Põe recheio em cada tortilha e enrola. Coloca lado a lado numa travessa." },
      { t: "Cobrir",
        x: "Cobre com o resto do molho e o queijo ralado." },
      { t: "Gratinar",
        x: "Leva ao forno a 200 °C durante 15 a 20 minutos, até o queijo dourar." }
    ],
    dicas: [
      { t: "Passar as tortilhas", x: "Aquece as tortilhas antes de enrolar, para não partirem." },
      { t: "Frango aproveitado", x: "É ótimo para aproveitar frango assado que sobrou." },
      { t: "Mais picante", x: "Junta malagueta picada ao molho." }
    ],
    nutricao: { calorias: 480, proteina: 36, hidratos: 46, acucares: 6, gordura: 17, saturada: 8, fibra: 5, sal: 1.6 }
  },
  /* 81. NACHOS COM QUEIJO (mexicana, entradas) */
  {
    id: "nachos-com-queijo",
    titulo: "Nachos com queijo",
    descricao: "Triângulos de milho gratinados com queijo derretido, feijão e jalapeños. Perfeitos para partilhar.",
    categoria: { pais: "mexicana", tipo: "entradas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🧀", "lemon", "Nachos gratinados com queijo"),
    galeria: [
      { emoji: "🧀", tom: "lemon", alt: "Nachos gratinados com queijo" },
      { emoji: "🍴", tom: "lemon", alt: "Taça de nachos para partilhar" }
    ],
    icone: "🧀",
    tom: "lemon",
    preparacao: 10,
    cozedura: 10,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 200, "u": "g", "n": "nachos de milho"},
        {"q": 200, "u": "g", "n": "queijo ralado"},
        {"q": 1, "u": "lata", "up": "latas", "n": "feijão preto, escorrido"},
        {"q": 1, "u": "", "n": "tomates", "ns": "tomate", "inteiro": true},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "jalapeños em conserva"},
        {"q": 100, "u": "g", "n": "natas azedas ou iogurte grego"}
      ]}
    ],
    passos: [
      { t: "Montar",
        x: "Espalha metade dos nachos numa travessa que possa ir ao forno. Cobre com feijão e metade do queijo." },
      { t: "Segunda camada",
        x: "Junta o resto dos nachos e do queijo." },
      { t: "Gratinar",
        x: "Leva ao forno a 200 °C durante 8 a 10 minutos, até o queijo derreter e começar a dourar." },
      { t: "Finalizar",
        x: "Cobre com tomate picado, jalapeños e natas azedas. Serve logo." }
    ],
    dicas: [
      { t: "Camadas", x: "Faz duas camadas de queijo para todos os nachos ficarem cobertos." },
      { t: "Comer logo", x: "Os nachos amolecem depressa. Come-os assim que saírem do forno." },
      { t: "Acompanha", x: "Serve com guacamole e pico de gallo." }
    ],
    nutricao: { calorias: 430, proteina: 19, hidratos: 38, acucares: 3, gordura: 23, saturada: 12, fibra: 8, sal: 1.6 }
  },
  /* 82. PICO DE GALLO (mexicana, entradas) */
  {
    id: "pico-de-gallo",
    titulo: "Pico de gallo",
    descricao: "Salsa fresca mexicana de tomate, cebola, coentros e lima. Leve, picante e pronta em 10 minutos.",
    categoria: { pais: "mexicana", tipo: "entradas" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-gluten", "sem-lactose", "fitness"],
    imagem: criarImagem("🍅", "tomato", "Taça de pico de gallo"),
    galeria: [
      { emoji: "🍅", tom: "tomato", alt: "Taça de pico de gallo" },
      { emoji: "🍴", tom: "lemon", alt: "Tomate picado com coentros" }
    ],
    icone: "🍅",
    tom: "tomato",
    preparacao: 10,
    cozedura: 0,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 4, "u": "", "n": "tomates maduros", "ns": "tomate maduro", "inteiro": true},
        {"q": 1, "u": "", "n": "cebolas roxas pequenas", "ns": "cebola roxa pequena", "inteiro": true},
        {"q": 1, "u": "", "n": "malaguetas", "ns": "malagueta", "inteiro": true},
        {"q": 1, "u": "molho", "up": "molhos", "n": "coentros", "ns": "coentros"},
        {"q": 1, "u": "", "n": "limas", "ns": "lima", "inteiro": true},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Cortar",
        x: "Corta os tomates em cubinhos, sem as sementes. Pica a cebola, a malagueta e os coentros." },
      { t: "Misturar",
        x: "Junta tudo numa taça com o sumo de lima e sal." },
      { t: "Repousar",
        x: "Deixa repousar 10 minutos, para os sabores se juntarem." },
      { t: "Servir",
        x: "Serve com nachos, tacos ou carne grelhada." }
    ],
    dicas: [
      { t: "Tomates firmes", x: "Usa tomates maduros mas firmes, para não desfazerem." },
      { t: "Cebola mais suave", x: "Passa a cebola por água fria para ficar mais suave." },
      { t: "Fresca", x: "Come no próprio dia, é quando está melhor." }
    ],
    nutricao: { calorias: 30, proteina: 1, hidratos: 7, acucares: 4, gordura: 0, saturada: 0, fibra: 2, sal: 0.6 }
  },
  /* 83. ÁGUA FRESCA DE MELANCIA (mexicana, bebidas) */
  {
    id: "agua-fresca-de-melancia",
    titulo: "Água fresca de melancia",
    descricao: "Bebida mexicana de melancia batida com lima e gelo. Refrescante e naturalmente doce.",
    categoria: { pais: "mexicana", tipo: "bebidas" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-gluten", "sem-lactose", "fitness"],
    imagem: criarImagem("🍉", "tomato", "Jarro de água fresca de melancia"),
    galeria: [
      { emoji: "🍉", tom: "tomato", alt: "Jarro de água fresca de melancia" },
      { emoji: "🍴", tom: "lemon", alt: "Melancia fresca em fatias" }
    ],
    icone: "🍉",
    tom: "tomato",
    preparacao: 10,
    cozedura: 0,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 800, "u": "g", "n": "melancia sem sementes"},
        {"q": 500, "u": "ml", "n": "água fria"},
        {"q": 2, "u": "", "n": "limas", "ns": "lima", "inteiro": true},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar ou mel"},
        {"q": 8, "u": "", "n": "folhas de hortelã", "ns": "folha de hortelã", "inteiro": true}
      ]}
    ],
    passos: [
      { t: "Bater",
        x: "Tritura a melancia em pedaços com um pouco da água até ficar líquida." },
      { t: "Coar",
        x: "Passa por um coador, se quiseres uma bebida mais leve, e junta o resto da água." },
      { t: "Temperar",
        x: "Adiciona o sumo de lima e adoça a gosto." },
      { t: "Servir",
        x: "Serve gelada, com muito gelo e hortelã." }
    ],
    dicas: [
      { t: "Sem açúcar", x: "Com melancia bem madura quase não precisa de açúcar." },
      { t: "Gelo no jarro", x: "Junta o gelo só à última hora, para não aguar." },
      { t: "Variantes", x: "Experimenta com pepino ou morango." }
    ],
    nutricao: { calorias: 60, proteina: 1, hidratos: 15, acucares: 13, gordura: 0, saturada: 0, fibra: 1, sal: 0.0 }
  },
  /* 84. SAMOSAS DE BATATA E ERVILHAS (indiana, entradas) */
  {
    id: "samosas",
    titulo: "Samosas de batata e ervilhas",
    descricao: "Triângulos crocantes recheados de batata e ervilhas com especiarias. Um petisco indiano famoso.",
    categoria: { pais: "indiana", tipo: "entradas" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🥟", "orange", "Samosas douradas"),
    galeria: [
      { emoji: "🥟", tom: "orange", alt: "Samosas douradas" },
      { emoji: "🍴", tom: "lemon", alt: "Samosas abertas com recheio de batata" }
    ],
    icone: "🥟",
    tom: "orange",
    preparacao: 40,
    cozedura: 20,
    porcoes: 6,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Recheio", itens: [
        {"q": 500, "u": "g", "n": "batatas"},
        {"q": 100, "u": "g", "n": "ervilhas"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "óleo"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "garam masala"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "cominhos"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "sal"}
      ]},
      { titulo: "Massa", itens: [
        {"q": 250, "u": "g", "n": "farinha de trigo"},
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "óleo"},
        {"q": 100, "u": "ml", "n": "água morna"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "sal"},
        {"q": 500, "u": "ml", "n": "óleo, para fritar"}
      ]}
    ],
    passos: [
      { t: "Fazer a massa",
        x: "Mistura a farinha, o sal, o óleo e a água. Amassa 5 minutos e deixa repousar tapada 30 minutos." },
      { t: "Cozer as batatas",
        x: "Coze as batatas em cubos até ficarem macias e escorre." },
      { t: "Fazer o recheio",
        x: "Refoga a cebola no óleo, junta as especiarias, as batatas e as ervilhas. Esmaga ligeiramente e deixa arrefecer." },
      { t: "Rechear",
        x: "Estende a massa em círculos, corta ao meio, forma cones, enche com recheio e fecha as bordas com água." },
      { t: "Fritar",
        x: "Frita em óleo médio 6 a 8 minutos, até estarem dourados e crocantes." }
    ],
    dicas: [
      { t: "Lume médio", x: "Óleo demasiado quente doura por fora e deixa a massa crua por dentro." },
      { t: "Ao forno", x: "Pincela com óleo e coze a 200 °C, 25 minutos." },
      { t: "Com molho", x: "Serve com molho de hortelã ou de tamarindo." }
    ],
    nutricao: { calorias: 340, proteina: 6, hidratos: 45, acucares: 2, gordura: 15, saturada: 2, fibra: 5, sal: 0.8 }
  },
  /* 85. PALAK PANEER (indiana, pratos-principais) */
  {
    id: "palak-paneer",
    titulo: "Palak paneer",
    descricao: "Queijo fresco indiano em molho cremoso de espinafres e especiarias. Um clássico vegetariano.",
    categoria: { pais: "indiana", tipo: "pratos-principais" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🥬", "basil", "Prato de palak paneer"),
    galeria: [
      { emoji: "🥬", tom: "basil", alt: "Prato de palak paneer" },
      { emoji: "🍴", tom: "lemon", alt: "Espinafres cremosos com queijo fresco" }
    ],
    icone: "🥬",
    tom: "basil",
    preparacao: 15,
    cozedura: 25,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 500, "u": "g", "n": "espinafres"},
        {"q": 250, "u": "g", "n": "paneer ou queijo fresco firme, em cubos"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 2, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 1, "u": "cm", "n": "gengibre ralado"},
        {"q": 2, "u": "", "n": "tomates", "ns": "tomate", "inteiro": true},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "garam masala"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "cominhos"},
        {"q": 100, "u": "ml", "n": "natas"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "óleo"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Escaldar os espinafres",
        x: "Escalda os espinafres em água a ferver 2 minutos, passa por água fria e tritura até ficar um puré." },
      { t: "Fazer a base",
        x: "Refoga no óleo a cebola picada, o alho e o gengibre. Junta o tomate e as especiarias e cozinha 8 minutos." },
      { t: "Juntar o espinafre",
        x: "Adiciona o puré de espinafres e deixa apurar 5 minutos." },
      { t: "Dourar o queijo",
        x: "Doura os cubos de paneer numa frigideira à parte." },
      { t: "Finalizar",
        x: "Junta o paneer e as natas ao molho, tempera com sal e cozinha 3 minutos. Serve com arroz ou pão naan." }
    ],
    dicas: [
      { t: "Cor viva", x: "Escaldar e arrefecer os espinafres mantém a cor verde brilhante." },
      { t: "Sem paneer", x: "Podes usar tofu firme para uma versão vegan." },
      { t: "Mais cremoso", x: "Troca as natas por iogurte grego, fora do lume." }
    ],
    nutricao: { calorias: 380, proteina: 17, hidratos: 14, acucares: 6, gordura: 29, saturada: 14, fibra: 5, sal: 1.4 }
  },
  /* 86. BIRYANI DE FRANGO (indiana, pratos-principais) */
  {
    id: "biryani-de-frango",
    titulo: "Biryani de frango",
    descricao: "Arroz basmati aromático em camadas com frango marinado em iogurte e especiarias. Um prato festivo indiano.",
    categoria: { pais: "indiana", tipo: "pratos-principais" },
    alimento: ["aves", "arroz"],
    dieta: ["sem-gluten", "rica-em-proteina"],
    imagem: criarImagem("🍛", "lemon", "Panela de biryani de frango"),
    galeria: [
      { emoji: "🍛", tom: "lemon", alt: "Panela de biryani de frango" },
      { emoji: "🍴", tom: "lemon", alt: "Arroz basmati com frango e especiarias" }
    ],
    icone: "🍛",
    tom: "lemon",
    preparacao: 30,
    cozedura: 45,
    porcoes: 6,
    dificuldade: "dificil",
    ingredientes: [
      { titulo: "Frango", itens: [
        {"q": 800, "u": "g", "n": "coxas de frango"},
        {"q": 200, "u": "g", "n": "iogurte natural"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "garam masala"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "açafrão-da-índia"},
        {"q": 3, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 2, "u": "cm", "n": "gengibre ralado"}
      ]},
      { titulo: "Arroz", itens: [
        {"q": 400, "u": "g", "n": "arroz basmati"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "óleo"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "sal"},
        {"q": 1, "u": "molho", "up": "molhos", "n": "coentros", "ns": "coentros"}
      ]}
    ],
    passos: [
      { t: "Marinar",
        x: "Mistura o frango com o iogurte, as especiarias, o alho e o gengibre. Deixa marinar 1 hora ou de um dia para o outro." },
      { t: "Cebola dourada",
        x: "Frita a cebola em meias-luas no óleo até ficar dourada. Reserva metade." },
      { t: "Cozer o arroz",
        x: "Coze o arroz em muita água salgada, só 70%. Escorre." },
      { t: "Fazer as camadas",
        x: "Numa panela larga, põe o frango, a cebola e depois o arroz. Cobre com coentros." },
      { t: "Apurar",
        x: "Tapa bem e cozinha em lume muito brando 30 a 35 minutos. Deixa repousar 10 minutos e mistura com cuidado." }
    ],
    dicas: [
      { t: "Tampa bem fechada", x: "Veda a tampa com um pano para o vapor não escapar." },
      { t: "Arroz meio cozido", x: "O arroz acaba de cozer com o vapor do frango. Não o cozas demais." },
      { t: "Dar cor", x: "Pincela o arroz com um pouco de açafrão dissolvido em leite." }
    ],
    nutricao: { calorias: 620, proteina: 38, hidratos: 70, acucares: 5, gordura: 20, saturada: 6, fibra: 3, sal: 1.5 }
  },
  /* 87. CHANA MASALA (indiana, pratos-principais) */
  {
    id: "chana-masala",
    titulo: "Chana masala",
    descricao: "Grão-de-bico em molho de tomate com especiarias. Um prato indiano vegan, económico e muito saboroso.",
    categoria: { pais: "indiana", tipo: "pratos-principais" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-gluten", "sem-lactose"],
    imagem: criarImagem("🫘", "orange", "Tigela de chana masala"),
    galeria: [
      { emoji: "🫘", tom: "orange", alt: "Tigela de chana masala" },
      { emoji: "🍴", tom: "lemon", alt: "Grão-de-bico com molho de tomate" }
    ],
    icone: "🫘",
    tom: "orange",
    preparacao: 10,
    cozedura: 25,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "óleo"},
        {"q": 1, "u": "", "n": "cebolas", "ns": "cebola", "inteiro": true},
        {"q": 2, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 1, "u": "cm", "n": "gengibre ralado"},
        {"q": 2, "u": "colher de chá", "up": "colheres de chá", "n": "garam masala"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "cominhos"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "cúrcuma"},
        {"q": 400, "u": "g", "n": "tomate pelado"},
        {"q": 2, "u": "lata", "up": "latas", "n": "grão-de-bico, escorrido"},
        {"q": 1, "u": "molho", "up": "molhos", "n": "coentros", "ns": "coentros"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Refogar",
        x: "Aquece o óleo e refoga a cebola picada 8 minutos. Junta o alho e o gengibre." },
      { t: "Especiarias",
        x: "Junta o garam masala, os cominhos e a cúrcuma e mexe 1 minuto." },
      { t: "Molho",
        x: "Adiciona o tomate esmagado e cozinha 10 minutos, até o molho engrossar." },
      { t: "Grão",
        x: "Junta o grão-de-bico com um pouco de água e cozinha 10 minutos. Esmaga alguns para engrossar." },
      { t: "Servir",
        x: "Tempera com sal e serve com coentros, com arroz ou pão naan." }
    ],
    dicas: [
      { t: "Mais sabor", x: "Torra as especiarias no óleo antes do tomate para ficarem mais aromáticas." },
      { t: "Grão cozido", x: "Podes usar grão cozido em casa, em vez de lata." },
      { t: "Acidez", x: "Um fio de sumo de limão no fim realça os sabores." }
    ],
    nutricao: { calorias: 380, proteina: 16, hidratos: 56, acucares: 9, gordura: 10, saturada: 1, fibra: 14, sal: 1.3 }
  },
  /* 88. LASSI DE MANGA (indiana, bebidas) */
  {
    id: "lassi-de-manga",
    titulo: "Lassi de manga",
    descricao: "Bebida indiana cremosa de iogurte batido com manga madura. Refrescante e naturalmente doce.",
    categoria: { pais: "indiana", tipo: "bebidas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🥭", "lemon", "Copo de lassi de manga"),
    galeria: [
      { emoji: "🥭", tom: "lemon", alt: "Copo de lassi de manga" },
      { emoji: "🍴", tom: "lemon", alt: "Manga madura em cubos" }
    ],
    icone: "🥭",
    tom: "lemon",
    preparacao: 5,
    cozedura: 0,
    porcoes: 2,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 2, "u": "", "n": "mangas maduras", "ns": "manga madura", "inteiro": true},
        {"q": 300, "u": "g", "n": "iogurte natural"},
        {"q": 150, "u": "ml", "n": "leite frio"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "mel ou açúcar"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "cardamomo em pó"}
      ]}
    ],
    passos: [
      { t: "Preparar a manga",
        x: "Descasca as mangas e corta a polpa em cubos." },
      { t: "Bater",
        x: "Tritura a manga com o iogurte, o leite e o mel até ficar liso e cremoso." },
      { t: "Provar",
        x: "Prova e acerta o açúcar conforme a doçura da manga." },
      { t: "Servir",
        x: "Serve bem frio, polvilhado com cardamomo." }
    ],
    dicas: [
      { t: "Manga congelada", x: "Com manga congelada fica mais espesso, tipo batido." },
      { t: "Sem lactose", x: "Usa iogurte de coco ou de soja e bebida vegetal." },
      { t: "Mais fresco", x: "Junta gelo na hora de bater." }
    ],
    nutricao: { calorias: 240, proteina: 8, hidratos: 44, acucares: 40, gordura: 4, saturada: 2, fibra: 3, sal: 0.2 }
  },
  /* 89. PATATAS BRAVAS (espanhola, entradas) */
  {
    id: "patatas-bravas",
    titulo: "Patatas bravas",
    descricao: "Cubos de batata fritos com molho picante de tomate e pimentão. O petisco de tapas mais pedido em Espanha.",
    categoria: { pais: "espanhola", tipo: "entradas" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-gluten", "sem-lactose"],
    imagem: criarImagem("🥔", "tomato", "Prato de patatas bravas"),
    galeria: [
      { emoji: "🥔", tom: "tomato", alt: "Prato de patatas bravas" },
      { emoji: "🍴", tom: "lemon", alt: "Batatas fritas com molho picante" }
    ],
    icone: "🥔",
    tom: "tomato",
    preparacao: 15,
    cozedura: 30,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Batatas", itens: [
        {"q": 800, "u": "g", "n": "batatas"},
        {"q": 500, "u": "ml", "n": "óleo, para fritar"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "sal"}
      ]},
      { titulo: "Molho bravo", itens: [
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "farinha de trigo"},
        {"q": 2, "u": "colher de chá", "up": "colheres de chá", "n": "pimentão picante"},
        {"q": 200, "u": "ml", "n": "caldo de legumes"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "polpa de tomate"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "vinagre de vinho"}
      ]}
    ],
    passos: [
      { t: "Cortar e cozer",
        x: "Corta as batatas em cubos de 3 cm e coze-as em água a ferver 5 minutos. Escorre e deixa secar bem." },
      { t: "Fazer o molho",
        x: "Aquece o azeite com o alho, junta a farinha e o pimentão e mexe 30 segundos. Adiciona o caldo, a polpa e o vinagre e cozinha 10 minutos." },
      { t: "Triturar",
        x: "Tritura o molho até ficar liso e tempera com sal." },
      { t: "Fritar",
        x: "Frita as batatas em óleo quente até ficarem douradas e crocantes." },
      { t: "Servir",
        x: "Escorre sobre papel absorvente, tempera com sal e serve com o molho por cima." }
    ],
    dicas: [
      { t: "Batatas secas", x: "Quanto mais secas, mais crocantes. Seca bem depois de cozer." },
      { t: "Duas fritadas", x: "Para ficarem mais crocantes, frita primeiro a lume médio e depois a lume forte." },
      { t: "Mais picante", x: "Aumenta o pimentão picante ou junta malagueta." }
    ],
    nutricao: { calorias: 390, proteina: 6, hidratos: 48, acucares: 3, gordura: 19, saturada: 3, fibra: 5, sal: 1.0 }
  },
  /* 90. CROQUETAS DE JAMÓN (espanhola, entradas) */
  {
    id: "croquetas-de-jamon",
    titulo: "Croquetas de jamón",
    descricao: "Croquetes cremosos de bechamel com presunto, crocantes por fora. Um clássico das tapas espanholas.",
    categoria: { pais: "espanhola", tipo: "entradas" },
    alimento: ["carne"],
    dieta: [],
    imagem: criarImagem("🥓", "orange", "Croquetas douradas"),
    galeria: [
      { emoji: "🥓", tom: "orange", alt: "Croquetas douradas" },
      { emoji: "🍴", tom: "lemon", alt: "Croquete aberto com recheio cremoso" }
    ],
    icone: "🥓",
    tom: "orange",
    preparacao: 40,
    cozedura: 20,
    porcoes: 6,
    dificuldade: "dificil",
    ingredientes: [
      { titulo: "Bechamel", itens: [
        {"q": 60, "u": "g", "n": "manteiga"},
        {"q": 80, "u": "g", "n": "farinha de trigo"},
        {"q": 600, "u": "ml", "n": "leite"},
        {"q": 150, "u": "g", "n": "presunto picado"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "noz-moscada"}
      ]},
      { titulo: "Panar e fritar", itens: [
        {"q": 2, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 150, "u": "g", "n": "pão ralado"},
        {"q": 500, "u": "ml", "n": "óleo, para fritar"}
      ]}
    ],
    passos: [
      { t: "Fazer a bechamel",
        x: "Derrete a manteiga, junta a farinha e mexe 2 minutos. Adiciona o leite aos poucos, sempre a mexer, até ficar espesso." },
      { t: "Juntar o presunto",
        x: "Junta o presunto e a noz-moscada e cozinha 5 minutos. A massa deve ficar bem espessa." },
      { t: "Arrefecer",
        x: "Espalha numa travessa, tapa com película em contacto e leva ao frigorífico pelo menos 4 horas." },
      { t: "Moldar e panar",
        x: "Molda bolinhas com duas colheres, passa pelo ovo batido e pelo pão ralado." },
      { t: "Fritar",
        x: "Frita em óleo bem quente, poucas de cada vez, até dourarem. Escorre sobre papel." }
    ],
    dicas: [
      { t: "Massa bem fria", x: "Uma massa fria e firme é mais fácil de moldar e não rebenta ao fritar." },
      { t: "Panar duas vezes", x: "Para uma crosta mais robusta, passa duas vezes pelo ovo e pelo pão." },
      { t: "Congelar", x: "Congela as croquetas panadas e frita-as sem descongelar." }
    ],
    nutricao: { calorias: 310, proteina: 12, hidratos: 22, acucares: 3, gordura: 19, saturada: 8, fibra: 1, sal: 1.2 }
  },
  /* 91. GAMBAS AL AJILLO (espanhola, entradas) */
  {
    id: "gambas-al-ajillo",
    titulo: "Gambas al ajillo",
    descricao: "Camarões salteados em azeite com muito alho e malagueta. Um petisco espanhol pronto em 10 minutos.",
    categoria: { pais: "espanhola", tipo: "entradas" },
    alimento: ["peixe-e-marisco"],
    dieta: ["sem-gluten", "sem-lactose", "low-carb", "rica-em-proteina"],
    imagem: criarImagem("🦐", "tomato", "Camarões em azeite de alho"),
    galeria: [
      { emoji: "🦐", tom: "tomato", alt: "Camarões em azeite de alho" },
      { emoji: "🍴", tom: "lemon", alt: "Cazuela de gambas al ajillo" }
    ],
    icone: "🦐",
    tom: "tomato",
    preparacao: 10,
    cozedura: 6,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 500, "u": "g", "n": "camarão descascado"},
        {"q": 6, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 150, "u": "ml", "n": "azeite"},
        {"q": 1, "u": "", "n": "malaguetas secas", "ns": "malagueta seca", "inteiro": true},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "vinho branco ou xerez"},
        {"q": 1, "u": "molho", "up": "molhos", "n": "salsa", "ns": "salsa"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Preparar",
        x: "Seca bem os camarões e tempera com sal. Corta o alho em lâminas." },
      { t: "Aromatizar o azeite",
        x: "Aquece o azeite em lume brando com o alho e a malagueta até o alho começar a ganhar cor." },
      { t: "Saltear",
        x: "Aumenta o lume, junta os camarões e salteia 2 a 3 minutos, até ficarem rosados." },
      { t: "Finalizar",
        x: "Junta o vinho, deixa evaporar e polvilha com salsa. Serve a ferver, com pão." }
    ],
    dicas: [
      { t: "Alho sem queimar", x: "Alho queimado amarga. Retira do lume se escurecer depressa." },
      { t: "Não passar", x: "Os camarões cozem depressa; passados ficam duros." },
      { t: "Pão para molhar", x: "O azeite aromatizado é a melhor parte. Serve com pão." }
    ],
    nutricao: { calorias: 380, proteina: 25, hidratos: 2, acucares: 0, gordura: 30, saturada: 4, fibra: 0, sal: 1.3 }
  },
  /* 92. CREMA CATALANA (espanhola, sobremesas) */
  {
    id: "crema-catalana",
    titulo: "Crema catalana",
    descricao: "Creme de gemas com raspa de limão e canela, coberto de açúcar caramelizado. A sobremesa catalã por excelência.",
    categoria: { pais: "espanhola", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🍮", "lemon", "Crema catalana com açúcar tostado"),
    galeria: [
      { emoji: "🍮", tom: "lemon", alt: "Crema catalana com açúcar tostado" },
      { emoji: "🍴", tom: "lemon", alt: "Creme com crosta de caramelo" }
    ],
    icone: "🍮",
    tom: "lemon",
    preparacao: 20,
    cozedura: 15,
    porcoes: 6,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 500, "u": "ml", "n": "leite"},
        {"q": 1, "u": "", "n": "paus de canela", "ns": "pau de canela", "inteiro": true},
        {"q": 1, "u": "", "n": "limões (só a casca)", "ns": "limão (só a casca)", "inteiro": true},
        {"q": 5, "u": "", "n": "gemas", "ns": "gema", "inteiro": true},
        {"q": 120, "u": "g", "n": "açúcar"},
        {"q": 25, "u": "g", "n": "amido de milho"},
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar, para caramelizar"}
      ]}
    ],
    passos: [
      { t: "Aromatizar o leite",
        x: "Aquece o leite com a canela e a casca de limão. Retira do lume, tapa e deixa em infusão 15 minutos." },
      { t: "Misturar as gemas",
        x: "Bate as gemas com o açúcar e o amido até ficar claro." },
      { t: "Cozer o creme",
        x: "Coa o leite sobre as gemas, mexendo. Leva ao lume brando, mexendo sempre, até engrossar." },
      { t: "Repousar",
        x: "Reparte por taças e deixa arrefecer. Leva ao frigorífico pelo menos 3 horas." },
      { t: "Caramelizar",
        x: "Polvilha açúcar e queima com um maçarico ou sob o grill, até formar uma crosta dourada." }
    ],
    dicas: [
      { t: "Sem ferver", x: "Se o creme ferver, as gemas talham. Mantém o lume brando." },
      { t: "Caramelizar na hora", x: "Faz a crosta mesmo antes de servir, para ficar estaladiça." },
      { t: "Sem maçarico", x: "Usa o grill do forno bem quente, com as taças dentro de uma travessa com gelo." }
    ],
    nutricao: { calorias: 260, proteina: 6, hidratos: 36, acucares: 32, gordura: 10, saturada: 5, fibra: 0, sal: 0.1 }
  },
  /* 93. PAN CON TOMATE (espanhola, pequeno-almoco) */
  {
    id: "pan-con-tomate",
    titulo: "Pan con tomate",
    descricao: "Pão tostado esfregado com alho e tomate maduro, regado com azeite. O pequeno-almoço simples de Espanha.",
    categoria: { pais: "espanhola", tipo: "pequeno-almoco" },
    alimento: ["vegetariano", "vegan"],
    dieta: ["sem-lactose"],
    imagem: criarImagem("🍅", "tomato", "Torradas com tomate e azeite"),
    galeria: [
      { emoji: "🍅", tom: "tomato", alt: "Torradas com tomate e azeite" },
      { emoji: "🍴", tom: "lemon", alt: "Pão tostado com tomate ralado" }
    ],
    icone: "🍅",
    tom: "tomato",
    preparacao: 5,
    cozedura: 5,
    porcoes: 2,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 4, "u": "fatia", "up": "fatias", "n": "pão rústico"},
        {"q": 2, "u": "", "n": "tomates maduros", "ns": "tomate maduro", "inteiro": true},
        {"q": 1, "u": "dente", "up": "dentes", "n": "alho"},
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Tostar",
        x: "Tosta as fatias de pão até ficarem douradas e crocantes." },
      { t: "Esfregar o alho",
        x: "Esfrega o alho cru ainda quente sobre o pão." },
      { t: "Tomate",
        x: "Rala o tomate ou esmaga-o e espalha sobre o pão." },
      { t: "Finalizar",
        x: "Regue com azeite e uma pitada de sal. Come logo." }
    ],
    dicas: [
      { t: "Tomate maduro", x: "O sabor depende do tomate. Usa-o bem maduro." },
      { t: "Pão crocante", x: "Tosta bem para o pão não amolecer com o tomate." },
      { t: "Com presunto", x: "Fica ótimo com fatias de presunto por cima." }
    ],
    nutricao: { calorias: 300, proteina: 6, hidratos: 37, acucares: 5, gordura: 14, saturada: 2, fibra: 3, sal: 1.1 }
  },
  /* 94. CROQUE MONSIEUR (francesa, pratos-principais) */
  {
    id: "croque-monsieur",
    titulo: "Croque monsieur",
    descricao: "Sandes quente de fiambre e queijo coberta de bechamel gratinada. Um clássico dos cafés franceses.",
    categoria: { pais: "francesa", tipo: "pratos-principais" },
    alimento: ["carne"],
    dieta: [],
    imagem: criarImagem("🥪", "lemon", "Croque monsieur gratinado"),
    galeria: [
      { emoji: "🥪", tom: "lemon", alt: "Croque monsieur gratinado" },
      { emoji: "🍴", tom: "lemon", alt: "Sandes quente de fiambre e queijo" }
    ],
    icone: "🥪",
    tom: "lemon",
    preparacao: 20,
    cozedura: 15,
    porcoes: 2,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Sandes", itens: [
        {"q": 4, "u": "fatia", "up": "fatias", "n": "pão de forma"},
        {"q": 4, "u": "fatia", "up": "fatias", "n": "fiambre"},
        {"q": 100, "u": "g", "n": "queijo gruyère ralado"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "mostarda"}
      ]},
      { titulo: "Bechamel", itens: [
        {"q": 20, "u": "g", "n": "manteiga"},
        {"q": 20, "u": "g", "n": "farinha de trigo"},
        {"q": 250, "u": "ml", "n": "leite"},
        {"q": 1, "u": "pitada", "up": "pitadas", "n": "noz-moscada"}
      ]}
    ],
    passos: [
      { t: "Fazer a bechamel",
        x: "Derrete a manteiga, junta a farinha e mexe 1 minuto. Adiciona o leite aos poucos até engrossar. Tempera com sal e noz-moscada." },
      { t: "Montar",
        x: "Unta o pão com mostarda. Coloca fiambre e metade do queijo e tapa com outra fatia." },
      { t: "Cobrir",
        x: "Cobre com bechamel e o queijo restante." },
      { t: "Gratinar",
        x: "Leva ao forno a 220 °C, 10 a 12 minutos, até dourar e fazer bolhas." }
    ],
    dicas: [
      { t: "Pão tostado", x: "Tosta ligeiramente o pão antes de montar para não amolecer." },
      { t: "Com ovo", x: "Com um ovo estrelado por cima chama-se croque madame." },
      { t: "Queijo", x: "O gruyère é o clássico, mas emmental também funciona." }
    ],
    nutricao: { calorias: 560, proteina: 28, hidratos: 38, acucares: 6, gordura: 32, saturada: 17, fibra: 2, sal: 2.4 }
  },
  /* 95. SOPA DE CEBOLA GRATINADA (francesa, entradas) */
  {
    id: "sopa-de-cebola-gratinada",
    titulo: "Sopa de cebola gratinada",
    descricao: "Sopa francesa de cebola caramelizada com caldo, coberta de pão e queijo gratinado.",
    categoria: { pais: "francesa", tipo: "entradas" },
    alimento: ["sopas", "vegetariano"],
    dieta: [],
    imagem: criarImagem("🧅", "orange", "Tigela de sopa de cebola gratinada"),
    galeria: [
      { emoji: "🧅", tom: "orange", alt: "Tigela de sopa de cebola gratinada" },
      { emoji: "🍴", tom: "lemon", alt: "Cebola caramelizada com queijo" }
    ],
    icone: "🧅",
    tom: "orange",
    preparacao: 15,
    cozedura: 60,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Sopa", itens: [
        {"q": 1, "u": "kg", "n": "cebolas"},
        {"q": 40, "u": "g", "n": "manteiga"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "açúcar"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "farinha de trigo"},
        {"q": 100, "u": "ml", "n": "vinho branco"},
        {"q": 1000, "u": "ml", "n": "caldo de legumes ou de carne"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "tomilho"}
      ]},
      { titulo: "Gratinado", itens: [
        {"q": 4, "u": "fatia", "up": "fatias", "n": "pão rústico"},
        {"q": 120, "u": "g", "n": "queijo gruyère ralado"}
      ]}
    ],
    passos: [
      { t: "Caramelizar",
        x: "Corta as cebolas em meias-luas e leva-as com a manteiga, o azeite e o açúcar a lume médio-baixo, 40 minutos, mexendo, até ficarem douradas." },
      { t: "Juntar a farinha",
        x: "Polvilha a farinha, mexe 1 minuto e adiciona o vinho. Deixa evaporar." },
      { t: "Cozer a sopa",
        x: "Junta o caldo e o tomilho e deixa cozer 20 minutos. Tempera com sal e pimenta." },
      { t: "Gratinar",
        x: "Enche taças que vão ao forno, coloca o pão por cima e cobre com queijo. Gratina no forno a 220 °C até dourar." }
    ],
    dicas: [
      { t: "Paciência", x: "O segredo da sopa está na cebola bem caramelizada. Não apresses." },
      { t: "Caldo bom", x: "Um caldo saboroso faz toda a diferença." },
      { t: "Versão vegetariana", x: "Usa caldo de legumes bem concentrado." }
    ],
    nutricao: { calorias: 380, proteina: 13, hidratos: 36, acucares: 10, gordura: 19, saturada: 10, fibra: 3, sal: 1.6 }
  },
  /* 96. CRÈME BRÛLÉE (francesa, sobremesas) */
  {
    id: "creme-brulee",
    titulo: "Crème brûlée",
    descricao: "Creme de natas e baunilha com crosta de açúcar caramelizado. Elegante e surpreendentemente fácil.",
    categoria: { pais: "francesa", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: ["sem-gluten"],
    imagem: criarImagem("🍮", "lemon", "Crème brûlée com crosta crocante"),
    galeria: [
      { emoji: "🍮", tom: "lemon", alt: "Crème brûlée com crosta crocante" },
      { emoji: "🍴", tom: "lemon", alt: "Creme de baunilha caramelizado" }
    ],
    icone: "🍮",
    tom: "lemon",
    preparacao: 15,
    cozedura: 40,
    porcoes: 4,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 500, "u": "ml", "n": "natas"},
        {"q": 1, "u": "", "n": "favas de baunilha", "ns": "fava de baunilha", "inteiro": true},
        {"q": 5, "u": "", "n": "gemas", "ns": "gema", "inteiro": true},
        {"q": 80, "u": "g", "n": "açúcar"},
        {"q": 4, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar, para caramelizar"}
      ]}
    ],
    passos: [
      { t: "Aquecer as natas",
        x: "Aquece as natas com a baunilha aberta ao meio até começar a ferver. Retira e deixa em infusão 10 minutos." },
      { t: "Misturar",
        x: "Bate as gemas com o açúcar sem fazer espuma. Junta as natas mornas, mexendo." },
      { t: "Cozer em banho-maria",
        x: "Reparte por forminhas, coloca num tabuleiro com água quente e coze a 150 °C, 35 a 40 minutos, até estarem firmes com o centro a tremer." },
      { t: "Arrefecer",
        x: "Deixa arrefecer e leva ao frigorífico 4 horas." },
      { t: "Caramelizar",
        x: "Polvilha açúcar e queima com maçarico até formar uma crosta dourada." }
    ],
    dicas: [
      { t: "Banho-maria", x: "A água evita que o creme cozinhe depressa demais e fique com grumos." },
      { t: "Centro a tremer", x: "Tira do forno quando o centro ainda treme; acaba de firmar a arrefecer." },
      { t: "Açúcar fino", x: "Usa açúcar fino para uma crosta uniforme." }
    ],
    nutricao: { calorias: 430, proteina: 5, hidratos: 22, acucares: 21, gordura: 36, saturada: 20, fibra: 0, sal: 0.1 }
  },
  /* 97. TARTE TATIN (francesa, sobremesas) */
  {
    id: "tarte-tatin",
    titulo: "Tarte Tatin",
    descricao: "Tarte de maçã invertida, com maçãs caramelizadas por baixo e massa folhada crocante. Um clássico francês.",
    categoria: { pais: "francesa", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🍎", "orange", "Tarte Tatin virada"),
    galeria: [
      { emoji: "🍎", tom: "orange", alt: "Tarte Tatin virada" },
      { emoji: "🍴", tom: "lemon", alt: "Maçãs caramelizadas com massa folhada" }
    ],
    icone: "🍎",
    tom: "orange",
    preparacao: 30,
    cozedura: 45,
    porcoes: 8,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 6, "u": "", "n": "maçãs firmes", "ns": "maçã firme", "inteiro": true},
        {"q": 100, "u": "g", "n": "açúcar"},
        {"q": 60, "u": "g", "n": "manteiga"},
        {"q": 1, "u": "", "n": "massa folhada circular", "ns": "massa folhada circular", "inteiro": true}
      ]}
    ],
    passos: [
      { t: "Caramelo",
        x: "Numa frigideira que possa ir ao forno, derrete o açúcar com a manteiga até ficar caramelo dourado." },
      { t: "Maçãs",
        x: "Descasca as maçãs, corta-as em quartos e dispõe-nas apertadas sobre o caramelo. Cozinha 10 minutos." },
      { t: "Cobrir",
        x: "Cobre com a massa folhada, metendo as pontas para dentro, e fura com um garfo." },
      { t: "Cozer",
        x: "Leva ao forno a 200 °C, 25 a 30 minutos, até a massa estar dourada." },
      { t: "Virar",
        x: "Deixa repousar 5 minutos e vira sobre um prato, com cuidado. Serve morna." }
    ],
    dicas: [
      { t: "Maçãs firmes", x: "Maçãs que não desfazem, como reineta ou golden, são as melhores." },
      { t: "Virar a tempo", x: "Se esperares demais, o caramelo cola. Vira ainda morna." },
      { t: "Para acompanhar", x: "Fica ótima com natas frescas ou gelado de baunilha." }
    ],
    nutricao: { calorias: 310, proteina: 3, hidratos: 43, acucares: 28, gordura: 14, saturada: 8, fibra: 3, sal: 0.2 }
  },
  /* 98. SALADA NIÇOISE (francesa, pratos-principais) */
  {
    id: "salada-nicoise",
    titulo: "Salada niçoise",
    descricao: "Salada de Nice com atum, ovo, feijão-verde, batata, tomate e azeitonas. Uma refeição fresca e completa.",
    categoria: { pais: "francesa", tipo: "pratos-principais" },
    alimento: ["saladas", "peixe-e-marisco"],
    dieta: ["sem-gluten", "sem-lactose", "rica-em-proteina"],
    imagem: criarImagem("🥗", "basil", "Salada niçoise com atum e ovo"),
    galeria: [
      { emoji: "🥗", tom: "basil", alt: "Salada niçoise com atum e ovo" },
      { emoji: "🍴", tom: "lemon", alt: "Prato de salada com azeitonas" }
    ],
    icone: "🥗",
    tom: "basil",
    preparacao: 20,
    cozedura: 20,
    porcoes: 2,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "Salada", itens: [
        {"q": 200, "u": "g", "n": "batatas pequenas"},
        {"q": 150, "u": "g", "n": "feijão-verde"},
        {"q": 2, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 2, "u": "", "n": "tomates", "ns": "tomate", "inteiro": true},
        {"q": 1, "u": "lata", "up": "latas", "n": "atum em azeite, escorrido"},
        {"q": 50, "u": "g", "n": "azeitonas pretas"},
        {"q": 1, "u": "", "n": "alfaces", "ns": "alface", "inteiro": true}
      ]},
      { titulo: "Molho", itens: [
        {"q": 3, "u": "colher de sopa", "up": "colheres de sopa", "n": "azeite"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "vinagre de vinho"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "mostarda"},
        {"q": null, "n": "sal"}
      ]}
    ],
    passos: [
      { t: "Cozer",
        x: "Coze as batatas 15 minutos, o feijão 4 minutos e os ovos 9 minutos. Arrefece em água fria." },
      { t: "Cortar",
        x: "Corta as batatas, os tomates e os ovos aos pedaços." },
      { t: "Fazer o molho",
        x: "Mistura o azeite, o vinagre, a mostarda e o sal." },
      { t: "Montar",
        x: "Dispõe a alface num prato com a batata, o feijão, o tomate, o atum, o ovo e as azeitonas." },
      { t: "Temperar",
        x: "Rega com o molho e serve logo." }
    ],
    dicas: [
      { t: "Feijão verde vivo", x: "Arrefecer em água gelada mantém a cor." },
      { t: "Atum de qualidade", x: "Usa atum em azeite, é a diferença." },
      { t: "Sem batata", x: "Para menos hidratos, omite a batata." }
    ],
    nutricao: { calorias: 430, proteina: 32, hidratos: 24, acucares: 6, gordura: 24, saturada: 5, fibra: 6, sal: 1.3 }
  },
  /* 99. TORRADA FRANCESA (francesa, pequeno-almoco) */
  {
    id: "torrada-francesa",
    titulo: "Torrada francesa",
    descricao: "Fatias de pão embebidas em leite, ovo e canela e douradas em manteiga. Um pequeno-almoço doce e reconfortante.",
    categoria: { pais: "francesa", tipo: "pequeno-almoco" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🍞", "orange", "Torradas francesas com mel"),
    galeria: [
      { emoji: "🍞", tom: "orange", alt: "Torradas francesas com mel" },
      { emoji: "🍴", tom: "lemon", alt: "Pão dourado com frutos vermelhos" }
    ],
    icone: "🍞",
    tom: "orange",
    preparacao: 10,
    cozedura: 10,
    porcoes: 4,
    dificuldade: "facil",
    ingredientes: [
      { titulo: "", itens: [
        {"q": 8, "u": "fatia", "up": "fatias", "n": "pão de forma grosso"},
        {"q": 3, "u": "", "n": "ovos", "ns": "ovo", "inteiro": true},
        {"q": 200, "u": "ml", "n": "leite"},
        {"q": 1, "u": "colher de sopa", "up": "colheres de sopa", "n": "açúcar"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "canela"},
        {"q": 1, "u": "colher de chá", "up": "colheres de chá", "n": "extrato de baunilha"},
        {"q": 30, "u": "g", "n": "manteiga"},
        {"q": 100, "u": "g", "n": "frutos vermelhos"},
        {"q": 2, "u": "colher de sopa", "up": "colheres de sopa", "n": "mel"}
      ]}
    ],
    passos: [
      { t: "Preparar a mistura",
        x: "Bate os ovos com o leite, o açúcar, a canela e a baunilha numa travessa funda." },
      { t: "Embeber",
        x: "Mergulha cada fatia na mistura 20 segundos de cada lado." },
      { t: "Dourar",
        x: "Derrete um pouco de manteiga numa frigideira e doura as fatias 2 a 3 minutos de cada lado." },
      { t: "Servir",
        x: "Serve com os frutos vermelhos e um fio de mel." }
    ],
    dicas: [
      { t: "Pão do dia anterior", x: "Pão um pouco seco absorve melhor e não se desfaz." },
      { t: "Lume médio", x: "Com lume forte queima por fora e fica cru por dentro." },
      { t: "Manter quentes", x: "Mantém as torradas no forno a 100 °C enquanto fazes as restantes." }
    ],
    nutricao: { calorias: 380, proteina: 13, hidratos: 50, acucares: 16, gordura: 14, saturada: 6, fibra: 3, sal: 0.8 }
  },
  /* 100. TARTE DE LIMÃO (francesa, sobremesas) */
  {
    id: "tarte-de-limao",
    titulo: "Tarte de limão",
    descricao: "Base de bolacha com creme de limão ácido e doce. Fresca e fácil, sem forno em grande parte.",
    categoria: { pais: "francesa", tipo: "sobremesas" },
    alimento: ["vegetariano"],
    dieta: [],
    imagem: criarImagem("🍋", "lemon", "Fatia de tarte de limão"),
    galeria: [
      { emoji: "🍋", tom: "lemon", alt: "Fatia de tarte de limão" },
      { emoji: "🍴", tom: "lemon", alt: "Tarte com creme de limão e base de bolacha" }
    ],
    icone: "🍋",
    tom: "lemon",
    preparacao: 25,
    cozedura: 20,
    porcoes: 8,
    dificuldade: "medio",
    ingredientes: [
      { titulo: "Base", itens: [
        {"q": 200, "u": "g", "n": "bolacha Maria"},
        {"q": 100, "u": "g", "n": "manteiga derretida"}
      ]},
      { titulo: "Recheio", itens: [
        {"q": 1, "u": "lata", "up": "latas", "n": "leite condensado"},
        {"q": 3, "u": "", "n": "gemas", "ns": "gema", "inteiro": true},
        {"q": 120, "u": "ml", "n": "sumo de limão"},
        {"q": 1, "u": "", "n": "limões (raspa)", "ns": "limão (raspa)", "inteiro": true}
      ]}
    ],
    passos: [
      { t: "Fazer a base",
        x: "Tritura as bolachas e mistura com a manteiga derretida. Forra o fundo e as paredes de uma forma e leva ao frigorífico." },
      { t: "Fazer o recheio",
        x: "Mistura o leite condensado com as gemas, o sumo e a raspa de limão até ficar liso." },
      { t: "Cozer",
        x: "Verte sobre a base e coze a 160 °C, 15 a 18 minutos, até estar firme com o centro a tremer." },
      { t: "Arrefecer",
        x: "Deixa arrefecer e leva ao frigorífico 3 horas antes de servir." }
    ],
    dicas: [
      { t: "Limão fresco", x: "O sumo fresco dá muito mais sabor." },
      { t: "Base firme", x: "Pressiona bem a base para não desfazer ao cortar." },
      { t: "Com merengue", x: "Cobre com merengue e gratina para uma versão clássica." }
    ],
    nutricao: { calorias: 380, proteina: 6, hidratos: 50, acucares: 40, gordura: 17, saturada: 10, fibra: 0, sal: 0.4 }
  }
];


/* =========================================================
   FUNÇÕES DE APOIO
   ========================================================= */

/* Procura uma receita pelo id. Devolve null se não existir.
   Ex.: obterReceita('tiramisu').titulo  ->  'Tiramisù' */
function obterReceita(id) {
  return BASE_DE_RECEITAS.find(function (r) { return r.id === id; }) || null;
}

/* Tempo total em minutos (preparação + cozedura + repouso, se houver). */
function tempoTotal(receita) {
  return receita.preparacao + receita.cozedura + (receita.repouso || 0);
}

/* Verifica se os dados estão certos (ids repetidos, campos em falta,
   categorias que não existem). Útil depois de acrescentares receitas:
   abre a consola do browser e escreve validarBaseDeReceitas().
   Devolve a lista de problemas (vazia = tudo bem). */
function validarBaseDeReceitas() {
  const validos = {
    pais: ['portuguesa', 'italiana', 'brasileira', 'japonesa', 'mexicana', 'indiana', 'espanhola', 'francesa'],
    tipo: ['pequeno-almoco', 'entradas', 'pratos-principais', 'sobremesas', 'bebidas'],
    alimento: ['carne', 'aves', 'peixe-e-marisco', 'massas', 'arroz', 'sopas', 'saladas', 'vegetariano', 'vegan'],
    dieta: ['sem-gluten', 'sem-lactose', 'low-carb', 'fitness', 'rica-em-proteina'],
    dificuldade: ['facil', 'medio', 'dificil']
  };
  const obrigatorios = ['id', 'titulo', 'categoria', 'imagem', 'preparacao', 'cozedura',
                        'porcoes', 'dificuldade', 'ingredientes', 'passos', 'dicas'];
  const problemas = [];
  const vistos = {};

  BASE_DE_RECEITAS.forEach(function (r) {
    if (vistos[r.id]) problemas.push('id repetido: ' + r.id);
    vistos[r.id] = true;

    obrigatorios.forEach(function (campo) {
      if (r[campo] === undefined || r[campo] === null) problemas.push(r.id + ': falta o campo "' + campo + '"');
    });
    if (!r.categoria) return;

    if (validos.pais.indexOf(r.categoria.pais) === -1) problemas.push(r.id + ': país inválido (' + r.categoria.pais + ')');
    if (validos.tipo.indexOf(r.categoria.tipo) === -1) problemas.push(r.id + ': tipo inválido (' + r.categoria.tipo + ')');
    if (validos.dificuldade.indexOf(r.dificuldade) === -1) problemas.push(r.id + ': dificuldade inválida (' + r.dificuldade + ')');
    (r.alimento || []).forEach(function (a) {
      if (validos.alimento.indexOf(a) === -1) problemas.push(r.id + ': alimento inválido (' + a + ')');
    });
    (r.dieta || []).forEach(function (d) {
      if (validos.dieta.indexOf(d) === -1) problemas.push(r.id + ': dieta inválida (' + d + ')');
    });
    if (!r.ingredientes.length || !r.passos.length || !r.dicas.length) {
      problemas.push(r.id + ': ingredientes, passos ou dicas vazios');
    }
  });

  return problemas;
}


/* Idioma: troca títulos, ingredientes, passos e dicas pelos do idioma escolhido
   (as traduções estão em panlab-lang-XX.js; ver panlab-i18n.js). */
if (window.PL) PL.traduzirReceitas(BASE_DE_RECEITAS);


/* =========================================================
   LISTA RESUMIDA (RECEITAS)
   Esta é a ÚNICA fonte de dados do site. Para as páginas que só precisam
   de um resumo (cartões, filtros, receitas relacionadas, favoritos), a lista
   RECEITAS é gerada automaticamente a partir de BASE_DE_RECEITAS.
   Assim, acrescentas uma receita num só sítio e ela aparece em todo o lado.

   Campos: id, titulo, icone, tom, pais, refeicao, dificuldade,
           alimento, dieta e tempo.
   "tempo" = preparação + cozedura (é o que conta para o filtro de tempo).
   O repouso (frio, demolha, marinada) fica de fora.
   Depende de panlab-dados.js? Não: só usa os ids das categorias.
   ========================================================= */
const RECEITAS = BASE_DE_RECEITAS.map(function (r) {
  return {
    id: r.id,
    titulo: r.titulo,
    icone: r.icone,
    tom: r.tom,
    pais: r.categoria.pais,
    refeicao: r.categoria.tipo,
    alimento: r.alimento,
    dieta: r.dieta,
    tempo: r.preparacao + r.cozedura,
    dificuldade: r.dificuldade
  };
});
