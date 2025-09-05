import { User, Property } from '../config/db';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar usuário admin se não existir
    const adminExists = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email: 'admin@admin.com' },
          { username: 'admin' }
        ]
      } 
    });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@admin.com',
        fullName: 'Administrador do Sistema',
        accessLevel: 'admin',
        password: hashedPassword
      });
      console.log('✅ Usuário admin criado');
    } else {
      console.log('ℹ️ Usuário admin já existe');
    }

    // Criar usuário editor de exemplo se não existir
    const editorExists = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email: 'editor@admin.com' },
          { username: 'editor' }
        ]
      } 
    });
    if (!editorExists) {
      const hashedPassword = await bcrypt.hash('editor123', 10);
      await User.create({
        username: 'editor',
        email: 'editor@admin.com',
        fullName: 'Editor do Sistema',
        accessLevel: 'editor',
        password: hashedPassword
      });
      console.log('✅ Usuário editor criado');
    } else {
      console.log('ℹ️ Usuário editor já existe');
    }

    // Criar propriedades de exemplo se não existirem
    const propertiesCount = await Property.count();
    if (propertiesCount === 0) {
      const sampleProperties = [
        {
          titulo: 'Casa ampla com piscina no centro',
          descricao: 'Casa espaçosa com área de lazer completa, piscina, churrasqueira e jardim. Localizada em região nobre com fácil acesso ao centro comercial. Ideal para famílias que buscam conforto e praticidade.',
          tipo: 'Casa',
          finalidade: 'Venda' as const,
          valor: 850000,
          bairro: 'Centro',
          cidade: 'Miracema',
          area_util: 250,
          quartos: 4,
          banheiros: 3,
          vagas: 2,
          imagens: [
            '/uploads/casa1-1.jpg',
            '/uploads/casa1-2.jpg',
            '/uploads/casa1-3.jpg'
          ],
          destaque: true,
          imovel_do_mes: false,
          status: 'ativo' as const
        },
        {
          titulo: 'Apartamento moderno com vista panorâmica',
          descricao: 'Apartamento com ótima localização, próximo a escolas, mercados e transporte público. Vista panorâmica da cidade, acabamento de primeira qualidade e área de lazer completa.',
          tipo: 'Apartamento',
          finalidade: 'Aluguel' as const,
          valor: 2200,
          bairro: 'São José',
          cidade: 'Miracema',
          area_util: 80,
          quartos: 2,
          banheiros: 2,
          vagas: 1,
          imagens: [
            '/uploads/apt1-1.jpg',
            '/uploads/apt1-2.jpg',
            '/uploads/apt1-3.jpg'
          ],
          destaque: true,
          imovel_do_mes: true,
          status: 'ativo' as const
        },
        {
          titulo: 'Cobertura de luxo com terraço privativo',
          descricao: 'Cobertura exclusiva com terraço privativo, piscina, churrasqueira e vista privilegiada. Acabamento de luxo, sistema de segurança 24h e garagem para 3 veículos.',
          tipo: 'Cobertura',
          finalidade: 'Venda' as const,
          valor: 1200000,
          bairro: 'Bela Vista',
          cidade: 'Miracema',
          area_util: 180,
          quartos: 3,
          banheiros: 3,
          vagas: 3,
          imagens: [
            '/uploads/cobertura1-1.jpg',
            '/uploads/cobertura1-2.jpg',
            '/uploads/cobertura1-3.jpg'
          ],
          destaque: true,
          imovel_do_mes: false,
          status: 'ativo' as const
        },
        {
          titulo: 'Kitnet mobiliada próxima ao centro',
          descricao: 'Kitnet totalmente mobiliada, ideal para estudantes ou profissionais. Localizada próxima ao centro comercial, com fácil acesso ao transporte público.',
          tipo: 'Kitnet',
          finalidade: 'Aluguel' as const,
          valor: 800,
          bairro: 'Centro',
          cidade: 'Miracema',
          area_util: 25,
          quartos: 0,
          banheiros: 1,
          vagas: 0,
          imagens: [
            '/uploads/kitnet1-1.jpg',
            '/uploads/kitnet1-2.jpg'
          ],
          destaque: false,
          imovel_do_mes: false,
          status: 'ativo' as const
        },
        {
          titulo: 'Sobrado familiar com quintal',
          descricao: 'Sobrado com quintal amplo, ideal para famílias com crianças. Localizado em bairro residencial tranquilo, próximo a escolas e praças.',
          tipo: 'Sobrado',
          finalidade: 'Venda' as const,
          valor: 650000,
          bairro: 'Vila Nova',
          cidade: 'Miracema',
          area_util: 200,
          quartos: 3,
          banheiros: 2,
          vagas: 2,
          imagens: [
            '/uploads/sobrado1-1.jpg',
            '/uploads/sobrado1-2.jpg',
            '/uploads/sobrado1-3.jpg'
          ],
          destaque: false,
          imovel_do_mes: false,
          status: 'ativo' as const
        },
        {
          titulo: 'Terreno comercial em localização estratégica',
          descricao: 'Terreno comercial em localização estratégica, próximo ao centro comercial e com grande fluxo de pessoas. Ideal para construção de estabelecimento comercial.',
          tipo: 'Terreno',
          finalidade: 'Venda' as const,
          valor: 180000,
          bairro: 'Centro',
          cidade: 'Miracema',
          area_util: 300,
          quartos: 0,
          banheiros: 0,
          vagas: 0,
          imagens: [
            '/uploads/terreno1-1.jpg',
            '/uploads/terreno1-2.jpg'
          ],
          destaque: false,
          imovel_do_mes: false,
          status: 'ativo' as const
        }
      ];

      for (const propertyData of sampleProperties) {
        await Property.create(propertyData);
      }
      console.log('✅ Propriedades de exemplo criadas');
    } else {
      console.log('ℹ️ Propriedades já existem no banco');
    }

    console.log('✅ Seed do banco de dados concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  }
};

export default seedDatabase;
