export const mockRecipes = [
  {
    id: 'r1',
    title: 'Pizza de Frigideira',
    imageUrl: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=600',
    rating: 5,
    favorite: false,
    tempoPreparo: 20,
    description:
      'Uma pizza rápida e prática feita direto na frigideira, perfeita para aproveitar ingredientes que estão perto de vencer.',
    modoPreparo:
      'Abra a massa na frigideira untada e leve ao fogo baixo. Espalhe o molho, cubra com o queijo e as rodelas de tomate. Tampe e deixe cozinhar até o queijo derreter. Finalize com orégano e sirva ainda quente.',
    tag: 'expiring',
    tagLabel: 'Contém um produto próximo do vencimento',
    ingredients: [
      { id: 'i1', name: 'Pão de forma', have: true },
      { id: 'i2', name: 'Queijo mussarela', have: true },
      { id: 'i3', name: 'Tomate', have: false },
      { id: 'i4', name: 'Orégano', have: false },
    ],
  },
  {
    id: 'r2',
    title: 'Omelete de queijo',
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600',
    rating: 5,
    favorite: false,
    tempoPreparo: 10,
    description: 'Um omelete simples, cremoso e cheio de queijo derretido.',
    modoPreparo:
      'Bata os ovos com uma pitada de sal. Aqueça a frigideira com um fio de azeite e despeje os ovos. Quando começar a firmar, cubra metade com o queijo ralado, dobre ao meio e deixe mais um minuto até derreter.',
    tag: 'stock',
    tagLabel: 'Contém um produto do seu estoque',
    ingredients: [
      { id: 'i5', name: 'Ovos', have: true },
      { id: 'i6', name: 'Queijo Parmesão', have: true },
      { id: 'i7', name: 'Sal', have: true },
    ],
  },
  {
    id: 'r3',
    title: 'Panqueca',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600',
    rating: 4,
    favorite: false,
    tempoPreparo: 25,
    description: 'Panquecas fofinhas para o café da manhã ou lanche da tarde.',
    modoPreparo:
      'Bata no liquidificador o leite, os ovos e a farinha até obter uma massa lisa. Aqueça uma frigideira antiaderente, despeje uma concha da massa e espalhe. Doure dos dois lados e repita até acabar a massa.',
    tag: null,
    tagLabel: null,
    ingredients: [
      { id: 'i8', name: 'Farinha de trigo', have: true },
      { id: 'i9', name: 'Leite integral', have: true },
      { id: 'i10', name: 'Ovos', have: true },
    ],
  },
];

export default mockRecipes;
