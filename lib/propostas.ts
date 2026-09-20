export type ProposalCategory = 
  | 'individual' 
  | 'casal' 
  | 'corporativo' 
  | 'casamento' 
  | 'evento' 
  | 'personalizado';

export interface ProposalPackage {
  id: string;
  name: string;
  highlight?: boolean;
  price: string;
  paymentMethod: string;
  duration: string;
  features: string[];
  installments?: { times: string; value: string }[];
  extraNote?: string;
}

export interface Proposal {
  id: string;
  category: ProposalCategory;
  clientName: string;
  clientSlug: string; // e.g., "techcorp" or "mariana-e-joao"
  title: string;
  subtitle: string;
  welcomeMessage: string;
  validityDays: number;
  createdAt: string;
  investmentNote: string;
  packages: ProposalPackage[];
  videoPackages?: ProposalPackage[];
  customObservations?: string;
  isTemplate?: boolean;
}

export const CATEGORY_LABELS: Record<ProposalCategory, string> = {
  individual: 'Individual',
  casal: 'Casal',
  corporativo: 'Corporativo',
  casamento: 'Casamento',
  evento: 'Evento',
  personalizado: 'Personalizado',
};

export const CATEGORY_DESCRIPTIONS: Record<ProposalCategory, string> = {
  individual: 'Ensaios individuais, externos ou em studio.',
  casal: 'Ensaios de casais, externos ou em studio.',
  corporativo: 'Ensaios de profissionais, posicionamento de autoridade e produção de vídeos.',
  casamento: 'Cobertura de cerimônias civis, mini-weddings e recepções completas.',
  evento: 'Aniversários, celebrações sociais, batizados e confraternizações.',
  personalizado: 'Orçamentos e propostas desenhadas sob medida para demandas específicas.',
};

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function calculateDefaultInstallments(priceStr: string): { times: string; value: string }[] {
  const clean = priceStr.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const num = parseFloat(clean);
  if (isNaN(num) || num <= 0) return [];
  const rates: Record<number, number> = {
    1: 1.0438, 2: 1.0649, 3: 1.0754, 4: 1.086, 5: 1.0965, 6: 1.1071,
    7: 1.144, 8: 1.155, 9: 1.166, 10: 1.177, 11: 1.189, 12: 1.20
  };
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((times) => {
    const total = num * (rates[times] || 1.20);
    const perTime = total / times;
    const formatBRL = (val: number) =>
      val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (times === 1) {
      return { times: '1x', value: `R$ ${formatBRL(total)}` };
    }
    return { times: `${times}x`, value: `R$ ${formatBRL(perTime)} (R$ ${formatBRL(total)})` };
  });
}

export const STANDARD_TEMPLATES: Record<ProposalCategory, Proposal> = {
  individual: {
    id: 'template-individual',
    category: 'individual',
    clientName: 'Cliente',
    clientSlug: 'padrao',
    title: 'Proposta de Ensaio Fotográfico Individual',
    subtitle: 'Uma experiência leve e acolhedora para valorizar sua essência e registrar sua melhor versão.',
    welcomeMessage: 'Meu objetivo é transformar o nosso ensaio em um momento leve e divertido. Vou te guiar em cada passo para que a timidez vá embora e você se sinta em casa logo no primeiro clique.',
    validityDays: 10,
    createdAt: new Date().toISOString(),
    investmentNote: 'Reserva mediante sinal de 30% e o restante no dia do ensaio, ou valor integral parcelado em até 12x no cartão de crédito.',
    isTemplate: true,
    packages: [
      {
        id: 'ind-01',
        name: 'Ensaio Essencial',
        highlight: false,
        price: 'R$ 250',
        paymentMethod: 'Pix',
        duration: 'Duração de até 01 hora',
        features: [
          '10 fotos selecionadas',
          '01 vídeo brinde Making Of',
          'Prazo de entrega de até 10 dias',
          'Foto extra R$ 25,00 (desconto a partir de 13 extras)'
        ],
        installments: [
          { times: '1x', value: 'R$ 260,96' },
          { times: '2x', value: 'R$ 133,11 (R$ 266,22)' },
          { times: '3x', value: 'R$ 89,62 (R$ 268,85)' },
          { times: '4x', value: 'R$ 67,87 (R$ 271,48)' },
          { times: '5x', value: 'R$ 54,83 (R$ 274,13)' },
          { times: '6x', value: 'R$ 46,13 (R$ 276,77)' },
          { times: '7x', value: 'R$ 40,86 (R$ 286,01)' },
          { times: '8x', value: 'R$ 36,09 (R$ 288,75)' },
          { times: '9x', value: 'R$ 32,39 (R$ 291,55)' },
          { times: '10x', value: 'R$ 29,43 (R$ 294,33)' },
          { times: '11x', value: 'R$ 27,01 (R$ 297,16)' },
          { times: '12x', value: 'R$ 25,00 (R$ 299,98)' }
        ]
      },
      {
        id: 'ind-02',
        name: 'Ensaio Clássico',
        highlight: false,
        price: 'R$ 350',
        paymentMethod: 'Pix',
        duration: 'Duração de até 01 hora',
        features: [
          '15 fotos selecionadas',
          '01 vídeo brinde Making Of',
          'Prazo de entrega de até 15 dias',
          'Foto extra R$ 23,00 (desconto a partir de 13 extras)'
        ],
        installments: [
          { times: '1x', value: 'R$ 365,34' },
          { times: '2x', value: 'R$ 186,35 (R$ 372,70)' },
          { times: '3x', value: 'R$ 125,47 (R$ 376,42)' },
          { times: '4x', value: 'R$ 95,01 (R$ 380,05)' },
          { times: '5x', value: 'R$ 76,76 (R$ 383,82)' },
          { times: '6x', value: 'R$ 64,59 (R$ 387,55)' },
          { times: '7x', value: 'R$ 57,21 (R$ 400,47)' },
          { times: '8x', value: 'R$ 50,53 (R$ 404,24)' },
          { times: '9x', value: 'R$ 45,35 (R$ 408,18)' },
          { times: '10x', value: 'R$ 41,20 (R$ 412,04)' },
          { times: '11x', value: 'R$ 37,82 (R$ 416,04)' },
          { times: '12x', value: 'R$ 35,00 (R$ 420,00)' }
        ]
      },
      {
        id: 'ind-03',
        name: 'Ensaio Especial',
        highlight: false,
        price: 'R$ 450',
        paymentMethod: 'Pix',
        duration: 'Duração de até 02 horas',
        features: [
          '20 fotos selecionadas',
          '01 vídeo brinde Making Of',
          'Prazo de entrega de até 15 dias',
          'Foto extra R$ 22,00 (desconto a partir de 13 extras)'
        ],
        installments: [
          { times: '1x', value: 'R$ 469,73' },
          { times: '2x', value: 'R$ 239,59 (R$ 479,19)' },
          { times: '3x', value: 'R$ 161,31 (R$ 483,93)' },
          { times: '4x', value: 'R$ 122,17 (R$ 488,66)' },
          { times: '5x', value: 'R$ 98,69 (R$ 493,43)' },
          { times: '6x', value: 'R$ 83,03 (R$ 498,18)' },
          { times: '7x', value: 'R$ 73,55 (R$ 514,82)' },
          { times: '8x', value: 'R$ 64,97 (R$ 519,75)' },
          { times: '9x', value: 'R$ 58,31 (R$ 524,79)' },
          { times: '10x', value: 'R$ 52,98 (R$ 529,79)' },
          { times: '11x', value: 'R$ 48,63 (R$ 534,89)' },
          { times: '12x', value: 'R$ 45,00 (R$ 539,96)' }
        ]
      },
      {
        id: 'ind-04',
        name: 'Ensaio Completo',
        highlight: true,
        price: 'R$ 550',
        paymentMethod: 'Pix',
        duration: 'Duração de até 02 horas',
        features: [
          '30 fotos selecionadas',
          '01 vídeo brinde Making Of',
          'Prazo de entrega de até 20 dias',
          'Foto extra R$ 19,00 (desconto a partir de 13 extras)'
        ],
        installments: [
          { times: '1x', value: 'R$ 574,12' },
          { times: '2x', value: 'R$ 292,83 (R$ 585,67)' },
          { times: '3x', value: 'R$ 197,16 (R$ 591,47)' },
          { times: '4x', value: 'R$ 149,31 (R$ 597,25)' },
          { times: '5x', value: 'R$ 120,61 (R$ 603,07)' },
          { times: '6x', value: 'R$ 101,48 (R$ 608,88)' },
          { times: '7x', value: 'R$ 89,89 (R$ 629,22)' },
          { times: '8x', value: 'R$ 79,41 (R$ 635,25)' },
          { times: '9x', value: 'R$ 71,27 (R$ 641,40)' },
          { times: '10x', value: 'R$ 64,75 (R$ 647,52)' },
          { times: '11x', value: 'R$ 59,43 (R$ 653,75)' },
          { times: '12x', value: 'R$ 55,00 (R$ 659,95)' }
        ]
      }
    ],
    videoPackages: [
      {
        id: 'vid-01',
        name: 'Prático',
        highlight: false,
        price: 'R$ 150',
        paymentMethod: 'Pix',
        duration: '01 vídeo até 1:30seg',
        features: [
          '01 vídeo até 1:30seg',
          '01 capa pra vídeo',
          'Roteirização, direção e posicionamento',
          'Edição dinâmica, cortes essenciais, legenda e trilha sonora',
          'Prazo de entrega de até 72 horas'
        ],
        installments: [
          { times: '1x', value: 'R$ 156,58' },
          { times: '2x', value: 'R$ 79,87 (R$ 159,74)' },
          { times: '3x', value: 'R$ 53,77 (R$ 161,31)' },
          { times: '4x', value: 'R$ 40,72 (R$ 162,88)' },
          { times: '5x', value: 'R$ 32,90 (R$ 164,50)' },
          { times: '6x', value: 'R$ 27,68 (R$ 166,08)' },
          { times: '7x', value: 'R$ 24,52 (R$ 171,64)' },
          { times: '8x', value: 'R$ 21,65 (R$ 173,20)' },
          { times: '9x', value: 'R$ 19,43 (R$ 174,87)' },
          { times: '10x', value: 'R$ 17,66 (R$ 176,60)' },
          { times: '11x', value: 'R$ 16,21 (R$ 178,31)' },
          { times: '12x', value: 'R$ 15,00 (R$ 180,00)' }
        ]
      },
      {
        id: 'vid-02',
        name: 'Essencial',
        highlight: false,
        price: 'R$ 560',
        paymentMethod: 'Pix',
        duration: '04 vídeos até 1:30seg',
        features: [
          '04 vídeos até 1:30seg',
          '04 capas pra vídeo',
          'Roteirização, direção e posicionamento',
          'Edição dinâmica, cortes essenciais, legenda e trilha sonora',
          '02 vídeos brindes curtos até 15seg',
          'Prazo de entrega de até 10 dias'
        ],
        installments: [
          { times: '1x', value: 'R$ 584,56' },
          { times: '2x', value: 'R$ 298,05 (R$ 596,10)' },
          { times: '3x', value: 'R$ 200,74 (R$ 602,22)' },
          { times: '4x', value: 'R$ 152,02 (R$ 608,08)' },
          { times: '5x', value: 'R$ 122,79 (R$ 613,95)' },
          { times: '6x', value: 'R$ 103,32 (R$ 619,92)' },
          { times: '7x', value: 'R$ 91,52 (R$ 640,64)' },
          { times: '8x', value: 'R$ 80,85 (R$ 646,80)' },
          { times: '9x', value: 'R$ 72,56 (R$ 653,04)' },
          { times: '10x', value: 'R$ 65,92 (R$ 659,20)' },
          { times: '11x', value: 'R$ 60,50 (R$ 665,50)' },
          { times: '12x', value: 'R$ 56,00 (R$ 672,00)' }
        ]
      },
      {
        id: 'vid-03',
        name: 'Presença',
        highlight: false,
        price: 'R$ 1.040',
        paymentMethod: 'Pix',
        duration: '08 vídeos até 1:30seg',
        features: [
          '08 vídeos até 1:30seg',
          '08 capas pra vídeo',
          'Roteirização, direção e posicionamento',
          'Edição dinâmica, cortes essenciais, legenda e trilha sonora',
          '04 vídeos brindes curtos até 15seg',
          'Prazo de entrega de até 15 dias'
        ],
        installments: [
          { times: '1x', value: 'R$ 1.085,60' },
          { times: '2x', value: 'R$ 553,68 (R$ 1.107,36)' },
          { times: '3x', value: 'R$ 372,97 (R$ 1.118,91)' },
          { times: '4x', value: 'R$ 282,53 (R$ 1.130,12)' },
          { times: '5x', value: 'R$ 228,29 (R$ 1.141,45)' },
          { times: '6x', value: 'R$ 192,10 (R$ 1.152,60)' },
          { times: '7x', value: 'R$ 170,16 (R$ 1.191,12)' },
          { times: '8x', value: 'R$ 150,33 (R$ 1.202,64)' },
          { times: '9x', value: 'R$ 134,93 (R$ 1.214,37)' },
          { times: '10x', value: 'R$ 122,63 (R$ 1.226,30)' },
          { times: '11x', value: 'R$ 112,54 (R$ 1.237,94)' },
          { times: '12x', value: 'R$ 104,00 (R$ 1.248,00)' }
        ]
      },
      {
        id: 'vid-04',
        name: 'Autoridade',
        highlight: true,
        price: 'R$ 1.440',
        paymentMethod: 'Pix',
        duration: '12 vídeos até 1:30seg',
        features: [
          '12 vídeos até 1:30seg',
          '12 capas pra vídeo',
          'Roteirização, direção e posicionamento',
          'Edição dinâmica, cortes essenciais, legenda e trilha sonora',
          '06 vídeos brindes curtos até 15seg',
          'Prazo de entrega de até 20 dias'
        ],
        installments: [
          { times: '1x', value: 'R$ 1.502,40' },
          { times: '2x', value: 'R$ 766,22 (R$ 1.532,44)' },
          { times: '3x', value: 'R$ 516,19 (R$ 1.548,57)' },
          { times: '4x', value: 'R$ 391,13 (R$ 1.564,52)' },
          { times: '5x', value: 'R$ 316,06 (R$ 1.580,30)' },
          { times: '6x', value: 'R$ 265,95 (R$ 1.595,70)' },
          { times: '7x', value: 'R$ 235,53 (R$ 1.648,71)' },
          { times: '8x', value: 'R$ 208,09 (R$ 1.664,72)' },
          { times: '9x', value: 'R$ 186,78 (R$ 1.681,02)' },
          { times: '10x', value: 'R$ 169,76 (R$ 1.697,60)' },
          { times: '11x', value: 'R$ 155,80 (R$ 1.713,80)' },
          { times: '12x', value: 'R$ 144,00 (R$ 1.728,00)' }
        ]
      }
    ]
  },

  casal: {
    id: 'template-casal',
    category: 'casal',
    clientName: 'Casal',
    clientSlug: 'padrao',
    title: 'Proposta de Ensaio de Casal',
    subtitle: 'Um momento a dois para eternizar a cumplicidade, o carinho e a história única de vocês.',
    welcomeMessage: 'Fotografar casais é capturar o afeto nos pequenos gestos e olhares espontâneos. Esta proposta foi pensada para criar uma lembrança inesquecível da conexão de vocês.',
    validityDays: 10,
    createdAt: new Date().toISOString(),
    investmentNote: 'Reserva confirmada mediante sinal de 30% e o restante no dia do ensaio, ou valor integral parcelado no cartão.',
    isTemplate: true,
    packages: [
      {
        id: 'casal-01',
        name: 'Ensaio Afetivo',
        highlight: false,
        price: 'R$ 380',
        paymentMethod: 'Pix à vista ou cartão',
        duration: 'Até 01h15 de ensaio',
        features: [
          '15 fotos selecionadas e tratadas',
          '01 vídeo Making Of com trilha sonora afetiva',
          'Locação externa à escolha do casal (parque, praia ou urbana)',
          'Prazo de entrega em até 12 dias'
        ],
        installments: [
          { times: '1x', value: 'R$ 396,65' },
          { times: '3x', value: 'R$ 136,22' },
          { times: '6x', value: 'R$ 70,11' },
          { times: '12x', value: 'R$ 38,00' }
        ]
      },
      {
        id: 'casal-02',
        name: 'Ensaio Pré-Wedding Completo',
        highlight: true,
        price: 'R$ 550',
        paymentMethod: 'Pix à vista ou cartão',
        duration: 'Até 02 horas de ensaio',
        features: [
          '30 fotos selecionadas e tratadas em alta resolução',
          '01 vídeo cinematográfico (Reels) editado para o casal',
          '01 vídeo Making Of espontâneo',
          'Direção leve e descontraída sem poses engessadas',
          'Prazo de entrega de até 15 dias'
        ],
        installments: [
          { times: '1x', value: 'R$ 574,10' },
          { times: '3x', value: 'R$ 197,16' },
          { times: '6x', value: 'R$ 101,48' },
          { times: '12x', value: 'R$ 55,00' }
        ]
      }
    ]
  },

  corporativo: {
    id: 'template-corporativo',
    category: 'corporativo',
    clientName: 'Empresa / Profissional',
    clientSlug: 'padrao',
    title: 'Proposta de Posicionamento de Imagem & Conteúdo Corporativo',
    subtitle: 'Fotografia e vídeos estratégicos para elevar a percepção de autoridade e credibilidade da sua marca.',
    welcomeMessage: 'A imagem profissional é o primeiro ponto de confiança com seu cliente. Desenvolvemos esta proposta corporativa focada em destacar a essência do seu negócio com excelência técnica e visual sofisticado.',
    validityDays: 10,
    createdAt: new Date().toISOString(),
    investmentNote: 'Condições comerciais: 30% na reserva e 70% na entrega das fotos, ou faturamento em até 12x no cartão de crédito. Emissão de Nota Fiscal.',
    isTemplate: true,
    packages: [
      {
        id: 'corp-01',
        name: 'Retratos Profissionais de Autoridade',
        highlight: false,
        price: 'R$ 350',
        paymentMethod: 'Pix / Boleto / Cartão',
        duration: 'Até 01 hora de sessão',
        features: [
          '10 fotos tratadas com retoque fino de pele e alta frequência',
          'Direção de postura e expressão focada no seu nicho',
          'Arquivos em alta resolução para site e redes sociais',
          'Entrega em até 5 dias úteis'
        ],
        installments: [
          { times: '1x', value: 'R$ 365,34' },
          { times: '3x', value: 'R$ 125,47' },
          { times: '6x', value: 'R$ 64,58' }
        ]
      },
      {
        id: 'corp-02',
        name: 'Produção de Vídeos Estratégicos (Reels)',
        highlight: true,
        price: 'R$ 560',
        paymentMethod: 'Pix / Boleto / Cartão',
        duration: 'Sessão de gravação até 02 horas',
        features: [
          '04 vídeos gravados e editados de até 1:30 min cada',
          'Roteirização prévia, direcionamento de fala e iluminação profissional',
          'Edição dinâmica com legendas sincronizadas e trilha sonora',
          '02 vídeos curtos de brinde para stories',
          'Prazo de entrega em até 7 dias úteis'
        ],
        installments: [
          { times: '1x', value: 'R$ 584,50' },
          { times: '3x', value: 'R$ 200,74' },
          { times: '6x', value: 'R$ 103,32' }
        ]
      },
      {
        id: 'corp-03',
        name: 'Combo Imagem Total (Fotos + Vídeos)',
        highlight: false,
        price: 'R$ 850',
        paymentMethod: 'Pix / Boleto / Cartão',
        duration: 'Sessão completa de até 03 horas',
        features: [
          '15 retratos profissionais com edição avançada',
          '04 vídeos para Reels com legendas e identidade visual',
          'Fotos em ação/trabalho no seu ambiente ou consultório',
          'Capas personalizadas para cada vídeo',
          'Entrega prioritária em até 7 dias'
        ],
        installments: [
          { times: '1x', value: 'R$ 887,26' },
          { times: '3x', value: 'R$ 304,70' },
          { times: '6x', value: 'R$ 156,86' },
          { times: '12x', value: 'R$ 85,00' }
        ]
      }
    ]
  },

  casamento: {
    id: 'template-casamento',
    category: 'casamento',
    clientName: 'Noivos',
    clientSlug: 'padrao',
    title: 'Proposta de Cobertura de Casamento',
    subtitle: 'Registros espontâneos, poéticos e inesquecíveis do dia mais emocionante da vida de vocês.',
    welcomeMessage: 'O casamento é o início de um novo capítulo. Estamos preparados para captar cada lágrima de alegria, abraço sincero e sorriso com máxima sensibilidade e atenção aos detalhes.',
    validityDays: 10,
    createdAt: new Date().toISOString(),
    investmentNote: 'Contrato formal com garantia de data. Pagamento facilitado em até 12x no cartão ou entrada de 30% + parcelas até o mês do casamento.',
    isTemplate: true,
    packages: [
      {
        id: 'cas-01',
        name: 'Cerimônia Civil & Intimista',
        highlight: false,
        price: 'R$ 890',
        paymentMethod: 'Pix ou Cartão até 12x',
        duration: 'Até 02 horas de cobertura',
        features: [
          'Cobertura fotográfica da cerimônia civil e cumprimentos',
          'Mini ensaio fotográfico dos noivos logo após a cerimônia',
          'Todas as melhores fotos tratadas em alta resolução (mínimo de 80 fotos)',
          'Galeria online privada para download e compartilhamento com familiares',
          'Prazo de entrega de até 20 dias'
        ]
      },
      {
        id: 'cas-02',
        name: 'Casamento Clássico',
        highlight: true,
        price: 'R$ 1.800',
        paymentMethod: 'Pix ou Cartão até 12x',
        duration: 'Até 05 horas de cobertura',
        features: [
          'Making Of da Noiva ou Noivo',
          'Cobertura completa da Cerimônia religiosa ou celebração',
          'Ensaio exclusivo do casal após a cerimônia',
          'Cobertura dos brindes e início da recepção',
          'Mínimo de 200 fotos tratadas e entregues em alta resolução',
          '01 Teaser em vídeo em formato Reels para redes sociais'
        ]
      },
      {
        id: 'cas-03',
        name: 'Cobertura Completa dos Sonhos',
        highlight: false,
        price: 'R$ 2.600',
        paymentMethod: 'Pix ou Cartão até 12x',
        duration: 'Até 08 horas de cobertura',
        features: [
          'Ensaio Pré-Wedding incluso antes do casamento',
          'Making Of da Noiva e do Noivo',
          'Cerimônia + Recepção e Festa até o final',
          'Mínimo de 350 fotos tratadas',
          '02 Vídeos em formato Reels entregues em até 48h para postar',
          'Galeria online premium com acesso vitalício'
        ]
      }
    ]
  },

  evento: {
    id: 'template-evento',
    category: 'evento',
    clientName: 'Anfitrião',
    clientSlug: 'padrao',
    title: 'Proposta de Cobertura de Evento',
    subtitle: 'Comemorações merecem ser vividas intensamente enquanto nós cuidamos de eternizar cada momento.',
    welcomeMessage: 'Seja um aniversário marcante, batizado ou celebração em família, nossa cobertura garante registros alegres, vivos e espontâneos para recordar para sempre.',
    validityDays: 10,
    createdAt: new Date().toISOString(),
    investmentNote: 'Reserva mediante sinal de 30% e o restante no dia do evento, ou parcelado em até 12x no cartão.',
    isTemplate: true,
    packages: [
      {
        id: 'evt-01',
        name: 'Cobertura Essencial',
        highlight: false,
        price: 'R$ 450',
        paymentMethod: 'Pix ou Cartão',
        duration: 'Até 02 horas de evento',
        features: [
          'Registro da decoração, família, convidados e momentos principais',
          'Mínimo de 70 fotos tratadas em alta resolução',
          'Galeria online para download fácil',
          'Prazo de entrega em até 10 dias úteis'
        ]
      },
      {
        id: 'evt-02',
        name: 'Cobertura Completa & Dinâmica',
        highlight: true,
        price: 'R$ 750',
        paymentMethod: 'Pix ou Cartão',
        duration: 'Até 04 horas de evento',
        features: [
          'Cobertura fotográfica do início ao fim da festa',
          'Mínimo de 150 fotos tratadas em alta resolução',
          '01 vídeo resumo (Reels) com os melhores momentos do evento',
          'Prazo de entrega em até 12 dias úteis',
          'Prioridade no envio das primeiras fotos em 48 horas'
        ]
      }
    ]
  },

  personalizado: {
    id: 'template-personalizado',
    category: 'personalizado',
    clientName: 'Cliente Especial',
    clientSlug: 'padrao',
    title: 'Proposta Personalizada Sob Medida',
    subtitle: 'Soluções de fotografia e vídeo customizadas especialmente para atender suas necessidades.',
    welcomeMessage: 'Analisamos todos os detalhes do seu projeto para construir esta proposta personalizada, integrando os serviços ideias para o seu objetivo.',
    validityDays: 10,
    createdAt: new Date().toISOString(),
    investmentNote: 'Valores e prazos customizados conforme acordado. Pagamento facilitado via Pix ou em até 12x no cartão de crédito.',
    isTemplate: true,
    packages: [
      {
        id: 'pers-01',
        name: 'Pacote Customizado Exclusivo',
        highlight: true,
        price: 'R$ 600',
        paymentMethod: 'Pix / Cartão até 12x',
        duration: 'Duração sob demanda',
        features: [
          'Escopo definido sob medida para o seu projeto',
          'Captação de fotos e/ou vídeos de acordo com alinhamento prévio',
          'Tratamento profissional e curadoria dos materiais',
          'Galeria privada online com entrega no prazo acordado'
        ]
      }
    ]
  }
};
