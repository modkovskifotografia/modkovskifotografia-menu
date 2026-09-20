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
  individual: 'Ensaios individuais femininos, masculinos e retratos artísticos.',
  casal: 'Ensaios de casais, pré-wedding, noivados e celebração de bodas.',
  corporativo: 'Retratos profissionais, posicionamento de autoridade e produção de vídeos.',
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

export const STANDARD_TEMPLATES: Record<ProposalCategory, Proposal> = {
  individual: {
    id: 'template-individual',
    category: 'individual',
    clientName: 'Cliente',
    clientSlug: 'padrao',
    title: 'Proposta de Ensaio Fotográfico Individual',
    subtitle: 'Uma experiência leve e acolhedora para valorizar sua essência e registrar sua melhor versão.',
    welcomeMessage: 'É uma alegria apresentar esta proposta personalizada para o seu ensaio! Conduzirei cada detalhe com direção leve para você se sentir à vontade desde o primeiro clique.',
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
        paymentMethod: 'Pix à vista ou cartão',
        duration: 'Até 01 hora de ensaio',
        features: [
          '10 fotos com tratamento profissional em alta resolução',
          '01 vídeo Making Of de brinde',
          'Galeria online privada para seleção das fotos',
          'Prazo de entrega de até 10 dias úteis',
          'Opção de adquirir fotos extras'
        ],
        installments: [
          { times: '1x', value: 'R$ 260,96' },
          { times: '3x', value: 'R$ 89,62' },
          { times: '6x', value: 'R$ 46,13' },
          { times: '12x', value: 'R$ 25,00' }
        ]
      },
      {
        id: 'ind-02',
        name: 'Ensaio Clássico',
        highlight: true,
        price: 'R$ 350',
        paymentMethod: 'Pix à vista ou cartão',
        duration: 'Até 01 hora de ensaio',
        features: [
          '15 fotos com tratamento profissional em alta resolução',
          '01 vídeo Making Of de brinde',
          'Direção leve e consultoria de figurino e locação',
          'Galeria online privada para seleção das fotos',
          'Prazo de entrega de até 12 dias úteis'
        ],
        installments: [
          { times: '1x', value: 'R$ 365,34' },
          { times: '3x', value: 'R$ 125,47' },
          { times: '6x', value: 'R$ 64,58' },
          { times: '12x', value: 'R$ 35,00' }
        ]
      },
      {
        id: 'ind-03',
        name: 'Ensaio Completo',
        highlight: false,
        price: 'R$ 480',
        paymentMethod: 'Pix à vista ou cartão',
        duration: 'Até 01h30 de ensaio',
        features: [
          '25 fotos tratadas em altíssima resolução',
          '02 vídeos dinâmicos de Making Of em formato Reels',
          'Troca de até 3 figurinos',
          'Galeria online privada com entrega rápida',
          'Prazo de entrega de até 15 dias úteis'
        ],
        installments: [
          { times: '1x', value: 'R$ 501,00' },
          { times: '3x', value: 'R$ 172,00' },
          { times: '6x', value: 'R$ 88,50' },
          { times: '12x', value: 'R$ 48,00' }
        ]
      }
    ]
  },

  casal: {
    id: 'template-casal',
    category: 'casal',
    clientName: 'Casal',
    clientSlug: 'padrao',
    title: 'Proposta de Ensaio de Casal / Pré-Wedding',
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
