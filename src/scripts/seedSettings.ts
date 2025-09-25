import { Settings } from '../config/db';

// Dados das configurações baseados no mock do frontend
const defaultSettings = {
  companyInfo: {
    name: 'Vagner, Luiz e Adriana Corretores de Imóveis',
    cnpj: '12.345.678/0001-90',
    address: {
      street: 'Rua Marechal Floriano',
      number: '278',
      complement: 'Loja A',
      neighborhood: 'Centro',
      city: 'Miracema',
      state: 'RJ',
      zipCode: '28460-000',
      googleMapsEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4202.816849559726!2d-42.1990069!3d-21.415791900000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbce04b016934d7%3A0x84d564ec6ecab03f!2sVagner%20e%20Luiz%20Corretores%20de%20Im%C3%B3veis!5e1!3m2!1spt-BR!2sbr!4v1757199837614!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    contact: {
      phone: '22992635400',
      whatsapp: '22992635400',
      email: 'vagnercorretordeimoveis@gmail.com',
      website: 'https://vagnerluizadriana.com.br'
    },
    businessHours: {
      weekdays: 'Segunda a sexta-feira das 8h às 17h',
      weekend: 'Sábados das 8h às 12h'
    },
    socialMedia: {
      facebook: 'https://facebook.com/vagnerluizadrianaimoveis',
      instagram: 'https://instagram.com/vagnerluizadrianaimoveis',
      linkedin: 'https://linkedin.com/company/vagnerluizadrianaimoveis'
    }
  },
  visualIdentity: {
    logo: '/src/assets/logo.png',
    favicon: '/src/assets/favicon.ico',
    colors: {
      primary: '#1E3932',      // Verde escuro
      secondary: '#9D6B53',    // Marrom suave
      accent: '#C0A062',       // Dourado suave
      background: '#F4EDE4',   // Bege claro
      text: '#FAFAFA'          // Branco gelo
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Georgia, serif'
    },
    heroImage: '/src/assets/hero.jpg',
    aboutImage: '/src/assets/about-team.jpg'
  },
  siteContent: {
    hero: {
      title: 'Encontre o imóvel dos seus sonhos',
      subtitle: 'Mais de 10 anos conectando pessoas aos seus lares ideais',
      searchPlaceholder: 'Digite o bairro ou tipo de imóvel...'
    },
    about: {
      title: 'Nossa História',
      content: 'Vagner, Luiz e Adriana Corretores de Imóveis nasceu em 2014, da união entre experiência, confiança e laços familiares. Fundada por Luiz, corretor experiente e apaixonado pelo mercado imobiliário, e seu filho Vagner, o grupo carrega em sua essência o compromisso de oferecer um atendimento humano, transparente e dedicado. Com o passar dos anos, o amor pela profissão se estendeu à família — e hoje quem também integra a equipe é Adriana, esposa de Vagner, que chegou para somar com sua visão sensível, atenção aos detalhes e dedicação no atendimento aos clientes. Juntos, formamos um time que vai além da relação profissional: somos uma família unida por valores sólidos e pelo desejo de ajudar outras famílias a encontrarem o lar ideal ou realizarem bons negócios.',
      mission: 'Conectar pessoas aos seus lares ideais com transparência e dedicação.',
      vision: 'Ser referência em corretagem na região, reconhecida pela excelência no atendimento.',
      values: [
        'Transparência em todas as negociações',
        'Atendimento humanizado e personalizado',
        'Comprometimento com resultados',
        'Ética profissional',
        'Inovação constante'
      ]
    },
    services: {
      title: 'Nossos Serviços',
      items: [
        {
          title: 'Venda de Imóveis',
          description: 'Assessoria completa na venda do seu imóvel, desde a avaliação até a escritura.',
          icon: 'home'
        },
        {
          title: 'Locação',
          description: 'Administração completa de locações com segurança jurídica e financeira.',
          icon: 'key'
        },
        {
          title: 'Consultoria',
          description: 'Orientação especializada para investimentos imobiliários e negociações.',
          icon: 'users'
        },
        {
          title: 'Avaliação',
          description: 'Laudos técnicos precisos para compra, venda ou financiamento.',
          icon: 'calculator'
        }
      ]
    },
    team: [
      {
        name: 'Luiz Corretor',
        role: 'Fundador & Corretor de Imóveis',
        description: 'Com mais de 15 anos de experiência no mercado imobiliário, Luiz é especialista em negociações e avaliações.',
        photo: '/src/assets/team/luiz.jpg',
        creci: 'CRECI/RJ 12345',
        email: 'luiz@vagnerluizadriana.com.br',
        phone: '22992635401'
      },
      {
        name: 'Vagner Corretor',
        role: 'Corretor de Imóveis',
        description: 'Especialista em imóveis residenciais e comerciais, com foco em atendimento personalizado.',
        photo: '/src/assets/team/vagner.jpg',
        creci: 'CRECI/RJ 67890',
        email: 'vagner@vagnerluizadriana.com.br',
        phone: '22992635402'
      },
      {
        name: 'Adriana Corretora',
        role: 'Corretora de Imóveis',
        description: 'Especialista em locações e administração predial, com atenção especial aos detalhes.',
        photo: '/src/assets/team/adriana.jpg',
        creci: 'CRECI/RJ 11223',
        email: 'adriana@vagnerluizadriana.com.br',
        phone: '22992635403'
      }
    ],
    footer: {
      copyright: '© 2024 Vagner, Luiz e Adriana Corretores de Imóveis. Todos os direitos reservados.',
      developedBy: {
        text: 'Desenvolvido e publicado por SGR Desenvolvimento',
        link: 'https://sgr.dev.br'
      }
    }
  },
  seoSettings: {
    siteName: 'Vagner, Luiz e Adriana Corretores de Imóveis',
    siteDescription: 'Encontre o imóvel dos seus sonhos em Miracema e região. Mais de 10 anos de experiência em compra, venda e locação de imóveis.',
    keywords: [
      'imóveis Miracema',
      'corretores Miracema',
      'casas para venda',
      'apartamentos para locação',
      'corretores RJ',
      'Vagner, Luiz e Adriana',
      'corretor de imóveis'
    ],
    author: 'Vagner, Luiz e Adriana Corretores de Imóveis',
    ogImage: '/src/assets/og-image.jpg',
    favicon: '/src/assets/favicon.ico',
    googleAnalytics: 'G-XXXXXXXXXX',
    googleTagManager: 'GTM-XXXXXXX'
  },
  systemSettings: {
    email: {
      provider: 'smtp' as const,
      settings: {
        host: 'smtp.gmail.com',
        port: 587,
        username: 'vagnercorretordeimoveis@gmail.com',
        password: ''
      },
      templates: {
        contact: 'Obrigado pelo seu contato! Entraremos em contato em breve.',
        inquiry: 'Recebemos seu interesse no imóvel. Nossa equipe entrará em contato.'
      }
    },
    integrations: {
      whatsapp: {
        enabled: true,
        number: '5522992635400',
        message: 'Olá! Tenho interesse em saber mais sobre os imóveis disponíveis.'
      },
      maps: {
        provider: 'google' as const,
        apiKey: '',
        defaultLocation: {
          lat: -21.415792,
          lng: -42.199007,
          zoom: 15
        }
      }
    }
  },
  updatedBy: 'sistema'
};

// Função para popular as configurações
export const seedSettings = async () => {
  try {
    console.log('🌱 Iniciando seed das configurações...');

    // Verificar se já existem configurações
    const existingSettings = await Settings.findOne();
    
    if (existingSettings) {
      console.log('✅ Configurações já existem no banco de dados');
      return;
    }

    // Criar configurações padrão
    await Settings.create(defaultSettings as any);
    
    console.log('✅ Configurações criadas com sucesso!');
    console.log('📋 Dados inseridos:');
    console.log(`   - Nome da empresa: ${defaultSettings.companyInfo.name}`);
    console.log(`   - CNPJ: ${defaultSettings.companyInfo.cnpj}`);
    console.log(`   - Email: ${defaultSettings.companyInfo.contact.email}`);
    console.log(`   - Site: ${defaultSettings.companyInfo.contact.website}`);
    
  } catch (error) {
    console.error('❌ Erro ao criar configurações:', error);
    throw error;
  }
};

// Executar seed se chamado diretamente
if (require.main === module) {
  seedSettings()
    .then(() => {
      console.log('🎉 Seed das configurações concluído!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro no seed das configurações:', error);
      process.exit(1);
    });
}
