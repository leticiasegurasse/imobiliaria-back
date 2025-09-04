import { User } from '../config/db';
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

    console.log('✅ Seed do banco de dados concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  }
};

export default seedDatabase;
