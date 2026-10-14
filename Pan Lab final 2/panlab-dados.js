/* =========================================================
   PAN LAB - panlab-dados.js
   Aqui ficam as CATEGORIAS do site (países, refeições, dietas, etc.) e as
   funções que ajudam a filtrar. As receitas vivem em panlab-receitas.js.
   Para acrescentar uma receita, copia um bloco de panlab-receitas.js e muda os valores.

   Porque é um ficheiro .js e não .json?
   Os browsers bloqueiam a leitura de ficheiros .json quando abres o
   site com duplo clique (file://). Assim funciona em qualquer lado.
   Mais tarde, quando o site estiver online, podemos passar para JSON.

   ÍNDICE
   1. GRUPOS   - os 6 grupos de categorias e os seus itens
   2. RECEITAS - (movidas para panlab-receitas.js)
   3. Funções de apoio usadas pelas páginas
   ========================================================= */


/* =========================================================
   1. GRUPOS DE CATEGORIAS
   - id:        identificador sem acentos nem espaços (usado no URL)
   - nome:      texto que aparece no site
   - icone:     emoji do cartão
   - detalhe:   linha extra opcional no cartão
   Para criar uma categoria nova, acrescenta um item ao grupo certo
   e usa o mesmo id nas receitas.
   ========================================================= */
const GRUPOS = [
  {
    id: 'pais',
    nome: 'País',
    descricao: 'Viaja pelos sabores de cada país.',
    itens: [
      { id: 'portuguesa', nome: 'Portuguesa', icone: '🍲' },
      { id: 'italiana',   nome: 'Italiana',   icone: '🍕' },
      { id: 'brasileira', nome: 'Brasileira', icone: '🥥' },
      { id: 'japonesa',   nome: 'Japonesa',   icone: '🍣' },
      { id: 'mexicana',   nome: 'Mexicana',   icone: '🌮' },
      { id: 'indiana',    nome: 'Indiana',    icone: '🍛' },
      { id: 'espanhola',  nome: 'Espanhola',  icone: '🥘' },
      { id: 'francesa',   nome: 'Francesa',   icone: '🥐' }
    ]
  },
  {
    id: 'refeicao',
    nome: 'Tipo de refeição',
    descricao: 'Do pequeno-almoço à sobremesa.',
    itens: [
      { id: 'pequeno-almoco',  nome: 'Pequeno-almoço',    icone: '🥞' },
      { id: 'entradas',        nome: 'Entradas',          icone: '🧀' },
      { id: 'pratos-principais', nome: 'Pratos principais', icone: '🍽️' },
      { id: 'sobremesas',      nome: 'Sobremesas',        icone: '🍰' },
      { id: 'bebidas',         nome: 'Bebidas',           icone: '🍹' }
    ]
  },
  {
    id: 'alimento',
    nome: 'Tipo de alimento',
    descricao: 'Escolhe pelo ingrediente principal.',
    itens: [
      { id: 'carne',           nome: 'Carne',           icone: '🥩' },
      { id: 'aves',            nome: 'Aves',            icone: '🍗' },
      { id: 'peixe-e-marisco', nome: 'Peixe e marisco', icone: '🐟' },
      { id: 'massas',          nome: 'Massas',          icone: '🍝' },
      { id: 'arroz',           nome: 'Arroz',           icone: '🍚' },
      { id: 'sopas',           nome: 'Sopas',           icone: '🥣' },
      { id: 'saladas',         nome: 'Saladas',         icone: '🥗' },
      { id: 'vegetariano',     nome: 'Vegetariano',     icone: '🥦' },
      { id: 'vegan',           nome: 'Vegan',           icone: '🌱' }
    ]
  },
  {
    id: 'dieta',
    nome: 'Dieta',
    descricao: 'Para cada forma de comer.',
    itens: [
      { id: 'sem-gluten',      nome: 'Sem glúten',        icone: '🌾' },
      { id: 'sem-lactose',     nome: 'Sem lactose',       icone: '🥛' },
      { id: 'low-carb',        nome: 'Low carb',          icone: '🥑' },
      { id: 'fitness',         nome: 'Fitness',           icone: '💪' },
      { id: 'rica-em-proteina', nome: 'Rica em proteína', icone: '🥚' }
    ]
  },
  {
    id: 'tempo',
    nome: 'Tempo de preparação',
    descricao: 'Para quando tens pouco tempo, ou todo o tempo do mundo.',
    itens: [
      { id: 'rapidas',   nome: 'Rápidas',   icone: '⚡', detalhe: 'até 30 min' },
      { id: 'medias',    nome: 'Médias',    icone: '⏱️', detalhe: '31 a 60 min' },
      { id: 'demoradas', nome: 'Demoradas', icone: '🕰️', detalhe: 'mais de 1 hora' }
    ]
  },
  {
    id: 'dificuldade',
    nome: 'Dificuldade',
    descricao: 'Do primeiro tacho ao prato de desafio.',
    itens: [
      { id: 'facil',   nome: 'Fácil',   icone: '🥄', detalhe: 'poucos passos' },
      { id: 'medio',   nome: 'Médio',   icone: '🔪', detalhe: 'alguma prática' },
      { id: 'dificil', nome: 'Difícil', icone: '🔥', detalhe: 'para quem já cozinha' }
    ]
  }
];

// Idioma: troca os nomes das categorias pelos do idioma escolhido (ver panlab-i18n.js)
if (window.PL) PL.traduzirGrupos(GRUPOS);


/* =========================================================
   2. RECEITAS
   A lista de receitas já não está aqui: vive toda em panlab-receitas.js
   (BASE_DE_RECEITAS), que também gera a lista resumida RECEITAS usada
   pelos filtros e cartões. Carrega este ficheiro ANTES de panlab-receitas.js.
   ========================================================= */


/* =========================================================
   3. FUNÇÕES DE APOIO
   ========================================================= */

/* Converte minutos na faixa de tempo do grupo "Tempo de preparação".
   Para mudar os limites, altera os números aqui. */
function faixaDeTempo(minutos) {
  if (minutos <= 30) return 'rapidas';
  if (minutos <= 60) return 'medias';
  return 'demoradas';
}

/* Devolve sempre uma LISTA com os valores que a receita tem num grupo.
   Ex.: valoresDaReceita(receita, 'dieta')  ->  ['sem-gluten', 'low-carb'] */
function valoresDaReceita(receita, grupoId) {
  switch (grupoId) {
    case 'tempo':    return [faixaDeTempo(receita.tempo)];
    case 'alimento': return receita.alimento;
    case 'dieta':    return receita.dieta;
    default:         return [receita[grupoId]]; // pais, refeicao, dificuldade
  }
}
