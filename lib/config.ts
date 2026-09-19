export interface InstallmentOption {
  times: string;
  value: string;
}

export interface PackageItem {
  id: string;
  name: string;
  duration?: string;
  features: string[];
  price: string;
  paymentMethod: string;
  isFeatured?: boolean;
  badge?: string;
  whatsAppText: string;
  installments: InstallmentOption[];
}

export const brandConfig = {
  name: "Modkovski Fotografia",
  subName: "Fotografia · Vídeo · Histórias reais",
  color: "#4E0000",
  instagram: {
    handle: "@modkovskifotografia",
    url: "https://www.instagram.com/modkovskifotografia/",
  },
  whatsApp: {
    number: "5569999718820",
    url: "https://wa.me/5569999718820",
  },
  client: {
    name: "Letícia Faustino",
    event: "Cerimônia de Casamento",
    date: "23 de janeiro de 2027",
    time: "20h",
    dateFormatted: "23 de janeiro de 2027 · 20h",
  },
  hero: {
    tagline: "Portfólio",
    title: "O seu momento. Para sempre.",
    quote: "Alguns momentos passam em poucos segundos. O registro certo faz com que eles permaneçam eternos.",
    ctaText: "Ver Proposta Comercial",
    image: "/images/capa.jpg",
    // Premium wedding editorial photography fallback
    imageFallback: "https://picsum.photos/seed/modkovski-hero/1920/1280",
  },
  about: {
    title: "Modkovski Fotografia",
    eyebrow: "Quem vai registrar esse momento?",
    paragraphs: [
      "Sou Alessandra Modkovski, fotógrafa, videomaker e produtora de conteúdo, atuando há mais de dois anos.",
      "Meu trabalho une um olhar atento aos detalhes, sensibilidade e direção cuidadosa para transformar momentos reais em registros que tenham significado.",
      "Mais do que simplesmente fotografar ou filmar, busco registrar a essência de cada história com naturalidade, profissionalismo e olhar artístico.",
      "Para que, ao rever essas imagens, você não apenas lembre do que aconteceu, mas sinta novamente como aquele momento foi vivido."
    ],
    image: "/images/fotografa.jpg",
    imageFallback: "/images/fotografa.jpeg",
  },
  portfolio: {
    eyebrow: "Um pouco do meu trabalho",
    title: "Histórias reais.",
    items: [
      { 
        id: "p1", 
        type: "image", 
        src: "/images/portfolio-01.jpg", 
        fallbackSrc: "https://picsum.photos/seed/modkovski-p1/1200/1500", 
        caption: "Fotografia", 
        description: "Registros naturais e atentos aos detalhes." 
      },
      { 
        id: "v1", 
        type: "video", 
        src: "https://youtube.com/shorts/kRgbwZ1eCCE?feature=share", 
        fallbackVideo: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-42289-large.mp4", 
        fallbackPoster: "https://img.youtube.com/vi/kRgbwZ1eCCE/hqdefault.jpg", 
        caption: "Em movimento", 
        description: "Vídeos para reviver cada instante." 
      },
      { 
        id: "p2", 
        type: "image", 
        src: "/images/portfolio-02.jpg", 
        fallbackSrc: "https://picsum.photos/seed/modkovski-p2/1200/1500", 
        caption: "Detalhes", 
        description: "Porque são eles que tornam cada história única." 
      },
      { 
        id: "p3", 
        type: "image", 
        src: "/images/portfolio-03.jpg", 
        fallbackSrc: "https://picsum.photos/seed/modkovski-p3/1200/1500", 
        caption: "Cumplicidade", 
        description: "A conexão capturada de forma pura." 
      },
      { 
        id: "p4", 
        type: "image", 
        src: "/images/portfolio-04.jpg", 
        fallbackSrc: "https://picsum.photos/seed/modkovski-p4/1200/1500", 
        caption: "Emoção", 
        description: "Sorrisos e lágrimas que contam a história." 
      },
      { 
        id: "v2", 
        type: "video", 
        src: "https://youtube.com/shorts/rGvfYD5-I2M?feature=share", 
        fallbackVideo: "https://assets.mixkit.co/videos/preview/mixkit-putting-on-the-wedding-ring-40019-large.mp4", 
        fallbackPoster: "https://img.youtube.com/vi/rGvfYD5-I2M/hqdefault.jpg", 
        caption: "Essência", 
        description: "O ritmo e a atmosfera em formato de filme." 
      },
      { 
        id: "p5", 
        type: "image", 
        src: "/images/portfolio-05.jpg", 
        fallbackSrc: "https://picsum.photos/seed/modkovski-p5/1200/1500", 
        caption: "A Cerimônia", 
        description: "O ápice do compromisso e da promessa." 
      },
      { 
        id: "p6", 
        type: "image", 
        src: "/images/portfolio-06.jpg", 
        fallbackSrc: "https://picsum.photos/seed/modkovski-p6/1200/1500", 
        caption: "Para Sempre", 
        description: "O início de um novo capítulo registrado para sempre." 
      },
    ]
  },
  process: {
    eyebrow: "Depois da escolha",
    title: "Como funciona o processo?",
    steps: [
      { number: "01", title: "Escolha e Reserva", description: "Você escolhe a experiência e reserva a data mediante sinal de 30% do valor contratado, e o restante no dia do ensaio ou gravação, ou integral parcelado no cartão de crédito." },
      { number: "02", title: "Contrato", description: "A contratação é formalizada através de contrato e emissão de nota fiscal." },
      { number: "03", title: "Alinhamento", description: "Vamos marcar uma reunião para alinhar as expectativas, referências e passar algumas orientações." },
      { number: "04", title: "Captação", description: "Um dia antes da captação vamos reforçar algumas orientações, e vamos estar presentes no local e hora combinada." },
      { number: "05", title: "Seleção", description: "Após o pagamento do restante do valor e um pré-tratamento das fotos, vamos encaminhar um link para seleção na nossa plataforma. É possível adquirir fotos extras." },
      { number: "06", title: "Entrega", description: "Após o processo de seleção, tratamento e edição, todos os materiais são entregues de acordo com o prazo de cada pacote." },
    ]
  },
  testimonial: {
    eyebrow: "Experiências reais",
    title: "Quem já viveu essa experiência.",
    items: [
      {
        id: 1,
        occasion: "1 ANO DE CASADOS",
        quote: "“Eu queria muito eternizar esse momento e compartilhar a nossa alegria, sou muito grata. A gente começou com vergonha e depois fomos nos soltando, foi muito divertido. A equipe nos conduziu de forma leve e divertida.”",
        client: "ANDRESSA E DEIVISON",
      },
      {
        id: 2,
        occasion: "ENSAIO FOTOGRÁFICO E VÍDEOS",
        quote: "“Meninas, passando para agradecer por toda a experiência de hoje! Vocês foram maravilhosas do início ao fim. Amei a sessão de fotos, me deixaram super à vontade, foram muito acolhedoras, tiveram toda a paciência e ainda foram dando ideias e direcionamentos durante o ensaio, o que fez toda a diferença. Me senti muito tranquila e confiante. Dá para perceber o carinho e o profissionalismo de vocês em cada detalhe. Foi uma experiência leve e especial, e eu só tenho elogios. Com certeza vou indicar o trabalho de vocês para todo mundo que eu puder! Muito obrigada por tornarem esse momento tão incrível.”",
        client: "ANA LETÍCIA | ADVOGADA",
      },
      {
        id: 3,
        occasion: "ANIVERSÁRIO 1 ANO DA HELOÍSA",
        quote: "“A gente recebeu o serviço de fotografia e de filmagem, gostamos muito, elas foram bem atenciosas com todos os nossos convidados. A gente teve algumas intercorrências aqui na festa, elas aguardaram e fizeram um serviço maravilhoso. A gente ficou encantado, agradecemos muito.”",
        client: "POLIANE E JULIAN",
      },
      {
        id: 4,
        occasion: "FOTOGRAFIA E PRODUÇÃO DE VÍDEO MENSAL",
        quote: "“Nós tivemos muita dificuldade com equipes de mídia por questão de criatividade, compromisso e prazo, essa é uma dor de várias empresas. Elas fornecem o serviço pra gente um pouco mais de 1 ano, sempre entregam no prazo, com criatividade, ideias, roteiro pronto, tudo organizado com planejamento. Temos reuniões mensais e eu não me preocupo com nada. A gente vê que elas fazem o serviço com amor e com excelência.”",
        client: "LAURA DA MAMTUR VIAGENS",
      },
      {
        id: 5,
        occasion: "FOTOGRAFIA E PRODUÇÃO DE VÍDEO",
        quote: "“Contratar o trabalho delas foi fundamental no contexto profissional, as pessoas começaram a alcançar temas importantes a respeito da saúde mental, não só clientes, mas pessoas que assistem e passam a colocar em prática o que é falado. Esse serviço foi fundamental na minha profissão.”",
        client: "SÉRGIO | PSICÓLOGO",
      }
    ],
    // Mantido para compatibilidade
    occasion: "1 ano de casados",
    quote: "“Eu queria muito eternizar esse momento e compartilhar a nossa alegria, sou muito grata. A gente começou com vergonha e depois fomos nos soltando, foi muito divertido. A equipe nos conduziu de forma leve e divertida.”",
    client: "Andressa e Deivison",
  },
  finalCta: {
    title: "Vamos registrar esse momento?",
    description: "O seu momento vai acontecer uma única vez. Mas as lembranças podem permanecer por toda a vida.",
    buttonText: "QUERO RESERVAR MINHA DATA",
    whatsAppText: "Olá! Vi minha proposta da Modkovski Fotografia e quero conversar sobre a cobertura da cerimônia."
  },
  packageSections: [
    {
      id: "sec-1",
      eyebrow: "A proposta",
      title: "Ensaio fotográfico",
      description: "Preparamos quatro possibilidades de ensaio para que você escolha o formato que mais combina com aquilo que deseja guardar. Desde um ensaio mais objetivo até uma experiência completa.",
      packages: [
        {
          id: "pkg-01",
          name: "Ensaio Essencial",
          duration: "Duração de até 01 hora",
          features: [
            "10 fotos selecionadas",
            "01 vídeo brinde Making Of",
            "Prazo de entrega de até 10 dias",
            "Foto extra R$ 25,00 (desconto a partir de 13 extras)"
          ],
          price: "R$ 250",
          paymentMethod: "Pix",
          whatsAppText: "Olá! Vi minha proposta da Modkovski Fotografia e gostei do Ensaio Essencial. Gostaria de conversar sobre o ensaio fotográfico.",
          installments: [
            { times: "1x", value: "R$ 260,96" },
            { times: "2x", value: "R$ 133,11 (R$ 266,22)" },
            { times: "3x", value: "R$ 89,62 (R$ 268,85)" },
            { times: "4x", value: "R$ 67,87 (R$ 271,48)" },
            { times: "5x", value: "R$ 54,83 (R$ 274,13)" },
            { times: "6x", value: "R$ 46,13 (R$ 276,77)" },
            { times: "7x", value: "R$ 40,86 (R$ 286,01)" },
            { times: "8x", value: "R$ 36,09 (R$ 288,75)" },
            { times: "9x", value: "R$ 32,39 (R$ 291,55)" },
            { times: "10x", value: "R$ 29,43 (R$ 294,33)" },
            { times: "11x", value: "R$ 27,01 (R$ 297,16)" },
            { times: "12x", value: "R$ 25,00 (R$ 299,98)" },
          ]
        },
        {
          id: "pkg-02",
          name: "Ensaio Clássico",
          duration: "Duração de até 01 hora",
          features: [
            "15 fotos selecionadas",
            "01 vídeo brinde Making Of",
            "Prazo de entrega de até 15 dias",
            "Foto extra R$ 23,00 (desconto a partir de 13 extras)"
          ],
          price: "R$ 350",
          paymentMethod: "Pix",
          whatsAppText: "Olá! Vi minha proposta da Modkovski Fotografia e gostei do Ensaio Clássico. Gostaria de conversar sobre o ensaio fotográfico.",
          installments: [
            { times: "1x", value: "R$ 365,34" },
            { times: "2x", value: "R$ 186,35 (R$ 372,70)" },
            { times: "3x", value: "R$ 125,47 (R$ 376,42)" },
            { times: "4x", value: "R$ 95,01 (R$ 380,05)" },
            { times: "5x", value: "R$ 76,76 (R$ 383,82)" },
            { times: "6x", value: "R$ 64,59 (R$ 387,55)" },
            { times: "7x", value: "R$ 57,21 (R$ 400,47)" },
            { times: "8x", value: "R$ 50,53 (R$ 404,24)" },
            { times: "9x", value: "R$ 45,35 (R$ 408,18)" },
            { times: "10x", value: "R$ 41,20 (R$ 412,04)" },
            { times: "11x", value: "R$ 37,82 (R$ 416,04)" },
            { times: "12x", value: "R$ 35,00 (R$ 420,00)" },
          ]
        },
        {
          id: "pkg-03",
          name: "Ensaio Especial",
          duration: "Duração de até 02 horas",
          features: [
            "20 fotos selecionadas",
            "01 vídeo brinde Making Of",
            "Prazo de entrega de até 15 dias",
            "Foto extra R$ 22,00 (desconto a partir de 13 extras)"
          ],
          price: "R$ 450",
          paymentMethod: "Pix",
          whatsAppText: "Olá! Vi minha proposta da Modkovski Fotografia e gostei do Ensaio Especial. Gostaria de conversar sobre o ensaio fotográfico.",
          installments: [
            { times: "1x", value: "R$ 469,73" },
            { times: "2x", value: "R$ 239,59 (R$ 479,19)" },
            { times: "3x", value: "R$ 161,31 (R$ 483,93)" },
            { times: "4x", value: "R$ 122,17 (R$ 488,66)" },
            { times: "5x", value: "R$ 98,69 (R$ 493,43)" },
            { times: "6x", value: "R$ 83,03 (R$ 498,18)" },
            { times: "7x", value: "R$ 73,55 (R$ 514,82)" },
            { times: "8x", value: "R$ 64,97 (R$ 519,75)" },
            { times: "9x", value: "R$ 58,31 (R$ 524,79)" },
            { times: "10x", value: "R$ 52,98 (R$ 529,79)" },
            { times: "11x", value: "R$ 48,63 (R$ 534,89)" },
            { times: "12x", value: "R$ 45,00 (R$ 539,96)" },
          ]
        },
        {
          id: "pkg-04",
          name: "Ensaio Completo",
          duration: "Duração de até 02 horas",
          isFeatured: true,
          badge: "EXPERIÊNCIA COMPLETA",
          features: [
            "30 fotos selecionadas",
            "01 vídeo brinde Making Of",
            "Prazo de entrega de até 20 dias",
            "Foto extra R$ 19,00 (desconto a partir de 13 extras)"
          ],
          price: "R$ 550",
          paymentMethod: "Pix",
          whatsAppText: "Olá! Vi minha proposta da Modkovski Fotografia e gostei do Ensaio Completo. Gostaria de conversar sobre o ensaio fotográfico.",
          installments: [
            { times: "1x", value: "R$ 574,12" },
            { times: "2x", value: "R$ 292,83 (R$ 585,67)" },
            { times: "3x", value: "R$ 197,16 (R$ 591,47)" },
            { times: "4x", value: "R$ 149,31 (R$ 597,25)" },
            { times: "5x", value: "R$ 120,61 (R$ 603,07)" },
            { times: "6x", value: "R$ 101,48 (R$ 608,88)" },
            { times: "7x", value: "R$ 89,89 (R$ 629,22)" },
            { times: "8x", value: "R$ 79,41 (R$ 635,25)" },
            { times: "9x", value: "R$ 71,27 (R$ 641,40)" },
            { times: "10x", value: "R$ 64,75 (R$ 647,52)" },
            { times: "11x", value: "R$ 59,43 (R$ 653,75)" },
            { times: "12x", value: "R$ 55,00 (R$ 659,95)" },
          ]
        }
      ]
    },
    {
      id: "sec-2",
      eyebrow: "A proposta",
      title: "Produção de vídeo",
      description: "Preparamos quatro formatos de produção de vídeo para atender à sua estratégia, do modelo prático ao nível autoridade. Caso sua estratégia necessite de uma quantidade específica de vídeos, nos informe para ajustarmos.",
      packages: [
        {
          id: "pkg-dup-01",
          name: "Prático",
          features: [
            "01 vídeo até 1:30seg",
            "01 capa pra vídeo",
            "Roteirização, direção e posicionamento",
            "Edição dinâmica, cortes essenciais, legenda e trilha sonora",
            "Prazo de entrega de até 72 horas"
          ],
          price: "R$ 150",
          paymentMethod: "Pix",
          whatsAppText: "Olá! Vi minha proposta da Modkovski Fotografia e gostei do pacote Prático de vídeo. Gostaria de conversar.",
          installments: [
            { times: "1x", value: "R$ 156,58" },
            { times: "2x", value: "R$ 79,87 (R$ 159,74)" },
            { times: "3x", value: "R$ 53,77 (R$ 161,31)" },
            { times: "4x", value: "R$ 40,72 (R$ 162,88)" },
            { times: "5x", value: "R$ 32,90 (R$ 164,50)" },
            { times: "6x", value: "R$ 27,68 (R$ 166,08)" },
            { times: "7x", value: "R$ 24,52 (R$ 171,64)" },
            { times: "8x", value: "R$ 21,65 (R$ 173,20)" },
            { times: "9x", value: "R$ 19,43 (R$ 174,87)" },
            { times: "10x", value: "R$ 17,66 (R$ 176,60)" },
            { times: "11x", value: "R$ 16,21 (R$ 178,31)" },
            { times: "12x", value: "R$ 15,00 (R$ 180,00)" },
          ]
        },
        {
          id: "pkg-dup-02",
          name: "Essencial",
          features: [
            "04 vídeos até 1:30seg",
            "04 capas pra vídeo",
            "Roteirização, direção e posicionamento",
            "Edição dinâmica, cortes essenciais, legenda e trilha sonora",
            "02 vídeos brindes curtos até 15seg",
            "Prazo de entrega de até 10 dias"
          ],
          price: "R$ 560",
          paymentMethod: "Pix",
          whatsAppText: "Olá! Vi minha proposta da Modkovski Fotografia e gostei do pacote Essencial de vídeo. Gostaria de conversar.",
          installments: [
            { times: "1x", value: "R$ 584,56" },
            { times: "2x", value: "R$ 298,05 (R$ 596,10)" },
            { times: "3x", value: "R$ 200,74 (R$ 602,22)" },
            { times: "4x", value: "R$ 152,02 (R$ 608,08)" },
            { times: "5x", value: "R$ 122,79 (R$ 613,95)" },
            { times: "6x", value: "R$ 103,32 (R$ 619,92)" },
            { times: "7x", value: "R$ 91,52 (R$ 640,64)" },
            { times: "8x", value: "R$ 80,85 (R$ 646,80)" },
            { times: "9x", value: "R$ 72,56 (R$ 653,04)" },
            { times: "10x", value: "R$ 65,92 (R$ 659,20)" },
            { times: "11x", value: "R$ 60,50 (R$ 665,50)" },
            { times: "12x", value: "R$ 56,00 (R$ 672,00)" },
          ]
        },
        {
          id: "pkg-dup-03",
          name: "Presença",
          features: [
            "08 vídeos até 1:30seg",
            "08 capas pra vídeo",
            "Roteirização, direção e posicionamento",
            "Edição dinâmica, cortes essenciais, legenda e trilha sonora",
            "04 vídeos brindes curtos até 15seg",
            "Prazo de entrega de até 15 dias"
          ],
          price: "R$ 1.040",
          paymentMethod: "Pix",
          whatsAppText: "Olá! Vi minha proposta da Modkovski Fotografia e gostei do pacote Presença de vídeo. Gostaria de conversar.",
          installments: [
            { times: "1x", value: "R$ 1.085,60" },
            { times: "2x", value: "R$ 553,68 (R$ 1.107,36)" },
            { times: "3x", value: "R$ 372,97 (R$ 1.118,91)" },
            { times: "4x", value: "R$ 282,53 (R$ 1.130,12)" },
            { times: "5x", value: "R$ 228,29 (R$ 1.141,45)" },
            { times: "6x", value: "R$ 192,10 (R$ 1.152,60)" },
            { times: "7x", value: "R$ 170,16 (R$ 1.191,12)" },
            { times: "8x", value: "R$ 150,33 (R$ 1.202,64)" },
            { times: "9x", value: "R$ 134,93 (R$ 1.214,37)" },
            { times: "10x", value: "R$ 122,63 (R$ 1.226,30)" },
            { times: "11x", value: "R$ 112,54 (R$ 1.237,94)" },
            { times: "12x", value: "R$ 104,00 (R$ 1.248,00)" },
          ]
        },
        {
          id: "pkg-dup-04",
          name: "Autoridade",
          isFeatured: true,
          badge: "EXPERIÊNCIA COMPLETA",
          features: [
            "12 vídeos até 1:30seg",
            "12 capas pra vídeo",
            "Roteirização, direção e posicionamento",
            "Edição dinâmica, cortes essenciais, legenda e trilha sonora",
            "06 vídeos brindes curtos até 15seg",
            "Prazo de entrega de até 20 dias"
          ],
          price: "R$ 1.440",
          paymentMethod: "Pix",
          whatsAppText: "Olá! Vi minha proposta da Modkovski Fotografia e gostei do pacote Autoridade de vídeo. Gostaria de conversar.",
          installments: [
            { times: "1x", value: "R$ 1.502,40" },
            { times: "2x", value: "R$ 766,22 (R$ 1.532,44)" },
            { times: "3x", value: "R$ 516,19 (R$ 1.548,57)" },
            { times: "4x", value: "R$ 391,13 (R$ 1.564,52)" },
            { times: "5x", value: "R$ 316,06 (R$ 1.580,30)" },
            { times: "6x", value: "R$ 265,95 (R$ 1.595,70)" },
            { times: "7x", value: "R$ 235,53 (R$ 1.648,71)" },
            { times: "8x", value: "R$ 208,09 (R$ 1.664,72)" },
            { times: "9x", value: "R$ 186,78 (R$ 1.681,02)" },
            { times: "10x", value: "R$ 169,76 (R$ 1.697,60)" },
            { times: "11x", value: "R$ 155,80 (R$ 1.713,80)" },
            { times: "12x", value: "R$ 144,00 (R$ 1.728,00)" },
          ]
        }
      ]
    }
  ]
};
