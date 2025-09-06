import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Script para adicionar novos campos à tabela de usuários
const addUserFields = async () => {
  const sequelize = new Sequelize(
    process.env.DB_URL || 
    `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'imobiliaria'}`,
    {
      dialect: 'postgres',
      logging: console.log,
    }
  );

  try {
    console.log('Iniciando migração para adicionar campos phone, bio e avatar...');

    // Adicionar campo phone
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL;
    `);

    // Adicionar campo bio
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS bio TEXT NULL;
    `);

    // Adicionar campo avatar
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS avatar TEXT NULL;
    `);

    console.log('✅ Migração concluída com sucesso!');
    console.log('Novos campos adicionados: phone, bio, avatar');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    await sequelize.close();
  }
};

// Executar migração se o script for chamado diretamente
if (require.main === module) {
  addUserFields();
}

export default addUserFields;
