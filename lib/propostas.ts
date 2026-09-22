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
  status?: 'pendente' | 'fechado' | 'desistiu';
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
        installments: calculateDefaultInstallments('R$ 250')
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
        installments: calculateDefaultInstallments('R$ 350')
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
        installments: calculateDefaultInstallments('R$ 450')
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
        installments: calculateDefaultInstallments('R$ 550')
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
        installments: calculateDefaultInstallments('R$ 150')
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
        installments: calculateDefaultInstallments('R$ 560')
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
        installments: calculateDefaultInstallments('R$ 1.040')
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
        installments: calculateDefaultInstallments('R$ 1.440')
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
    investmentNote: 'Reserva confirmada mediante sinal de 30% e o restante no dia do ensaio, ou valor integral parcelado em até 12x no cartão de crédito.',
    isTemplate: true,
    packages: [
      {
        id: 'casal-01',
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
        installments: calculateDefaultInstallments('R$ 250')
      },
      {
        id: 'casal-02',
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
        installments: calculateDefaultInstallments('R$ 350')
      },
      {
        id: 'casal-03',
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
        installments: calculateDefaultInstallments('R$ 450')
      },
      {
        id: 'casal-04',
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
        installments: calculateDefaultInstallments('R$ 550')
      }
    ],
    videoPackages: [
      {
        id: 'vid-c-01',
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
        installments: calculateDefaultInstallments('R$ 150')
      },
      {
        id: 'vid-c-02',
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
        installments: calculateDefaultInstallments('R$ 560')
      },
      {
        id: 'vid-c-03',
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
        installments: calculateDefaultInstallments('R$ 1.040')
      },
      {
        id: 'vid-c-04',
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
        installments: calculateDefaultInstallments('R$ 1.440')
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
        installments: calculateDefaultInstallments('R$ 250')
      },
      {
        id: 'corp-02',
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
        installments: calculateDefaultInstallments('R$ 350')
      },
      {
        id: 'corp-03',
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
        installments: calculateDefaultInstallments('R$ 450')
      },
      {
        id: 'corp-04',
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
        installments: calculateDefaultInstallments('R$ 550')
      }
    ],
    videoPackages: [
      {
        id: 'vid-co-01',
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
        installments: calculateDefaultInstallments('R$ 150')
      },
      {
        id: 'vid-co-02',
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
        installments: calculateDefaultInstallments('R$ 560')
      },
      {
        id: 'vid-co-03',
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
        installments: calculateDefaultInstallments('R$ 1.040')
      },
      {
        id: 'vid-co-04',
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
        installments: calculateDefaultInstallments('R$ 1.440')
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
    investmentNote: 'Contrato formal com garantia de data. Pagamento facilitado em até 12x no cartão ou entrada de 30% + parcelas.',
    isTemplate: true,
    packages: [
      {
        id: 'cas-01',
        name: 'Cobertura Essencial',
        highlight: false,
        price: 'R$ 4.500',
        paymentMethod: 'Pix',
        duration: '2 horas de cobertura',
        features: [
          '60 fotos selecionadas',
          '1 vídeo de até 1min30',
          'Registro dos principais momentos',
          'Prazo de entrega de até 10 dias',
          'Foto extra R$ 25,00'
        ],
        installments: calculateDefaultInstallments('R$ 4.500')
      },
      {
        id: 'cas-02',
        name: 'Cobertura Especial',
        highlight: false,
        price: 'R$ 4.600',
        paymentMethod: 'Pix',
        duration: '3 horas de cobertura',
        features: [
          '70 fotos selecionadas',
          '2 vídeos de até 1min30',
          'Cobertura ampliada da cerimônia',
          'Prazo de entrega de até 15 dias',
          'Foto extra R$ 23,00'
        ],
        installments: calculateDefaultInstallments('R$ 4.600')
      },
      {
        id: 'cas-03',
        name: 'Cobertura Completa',
        highlight: false,
        price: 'R$ 4.750',
        paymentMethod: 'Pix',
        duration: '4 horas de cobertura',
        features: [
          '80 fotos selecionadas',
          '3 vídeos de até 1min30',
          'Maior tempo de cobertura',
          'Prazo de entrega de até 20 dias',
          'Foto extra R$ 20,00'
        ],
        installments: calculateDefaultInstallments('R$ 4.750')
      },
      {
        id: 'cas-04',
        name: 'Para guardar tudo.',
        highlight: true,
        price: 'R$ 5.000',
        paymentMethod: 'Pix',
        duration: '2 horas de Making Of da noiva + 4 horas de cobertura',
        features: [
          'Todas as fotos realizadas durante a cobertura',
          'Média de aproximadamente 200 fotos',
          'Making Of da noiva',
          '3 vídeos de até 1min30',
          'Cobertura completa do evento',
          'Prazo de entrega de até 25 dias'
        ],
        extraNote: 'Porque você não precisa escolher quais memórias merecem permanecer.',
        installments: calculateDefaultInstallments('R$ 5.000')
      }
    ],
    videoPackages: []
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
        installments: calculateDefaultInstallments('R$ 250')
      },
      {
        id: 'evt-02',
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
        installments: calculateDefaultInstallments('R$ 350')
      },
      {
        id: 'evt-03',
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
        installments: calculateDefaultInstallments('R$ 450')
      },
      {
        id: 'evt-04',
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
        installments: calculateDefaultInstallments('R$ 550')
      }
    ],
    videoPackages: [
      {
        id: 'vid-e-01',
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
        installments: calculateDefaultInstallments('R$ 150')
      },
      {
        id: 'vid-e-02',
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
        installments: calculateDefaultInstallments('R$ 560')
      },
      {
        id: 'vid-e-03',
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
        installments: calculateDefaultInstallments('R$ 1.040')
      },
      {
        id: 'vid-e-04',
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
        installments: calculateDefaultInstallments('R$ 1.440')
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
        installments: calculateDefaultInstallments('R$ 250')
      },
      {
        id: 'pers-02',
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
        installments: calculateDefaultInstallments('R$ 350')
      },
      {
        id: 'pers-03',
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
        installments: calculateDefaultInstallments('R$ 450')
      },
      {
        id: 'pers-04',
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
        installments: calculateDefaultInstallments('R$ 550')
      }
    ],
    videoPackages: [
      {
        id: 'vid-p-01',
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
        installments: calculateDefaultInstallments('R$ 150')
      },
      {
        id: 'vid-p-02',
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
        installments: calculateDefaultInstallments('R$ 560')
      },
      {
        id: 'vid-p-03',
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
        installments: calculateDefaultInstallments('R$ 1.040')
      },
      {
        id: 'vid-p-04',
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
        installments: calculateDefaultInstallments('R$ 1.440')
      }
    ]
  }
};
