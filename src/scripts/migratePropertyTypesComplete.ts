import { Property, PropertyType } from '../config/db';
import { Op } from 'sequelize';

// Script completo para migrar tipos de propriedade
const migratePropertyTypesComplete = async () => {
  try {
    console.log('🔄 Iniciando migração completa de tipos de propriedade...');

    // 1. Verificar se a coluna tipo_id já existe
    const tableInfo = await Property.sequelize!.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' AND column_name = 'tipo_id'
    `, { type: 'SELECT' as const });

    const hasTipoIdColumn = tableInfo.length > 0;
    console.log(`📊 Coluna tipo_id existe: ${hasTipoIdColumn}`);

    // 2. Buscar todas as propriedades (usando a coluna tipo atual)
    const properties = await Property.sequelize!.query(`
      SELECT id, tipo FROM properties
    `, { type: 'SELECT' as const }) as Array<{ id: string; tipo: string }>;

    console.log(`📊 Encontradas ${properties.length} propriedades para migrar`);

    // 3. Buscar todos os tipos de propriedade
    const propertyTypes = await PropertyType.findAll({
      attributes: ['id', 'nome']
    });

    console.log(`📋 Encontrados ${propertyTypes.length} tipos de propriedade`);

    // 4. Criar mapeamento de nome para ID
    const typeMap = new Map<string, string>();
    propertyTypes.forEach(type => {
      typeMap.set(type.nome, type.id);
    });

    console.log('🗺️  Mapeamento de tipos:');
    typeMap.forEach((id, nome) => {
      console.log(`   ${nome} -> ${id}`);
    });

    // 5. Se não existe a coluna tipo_id, criar ela primeiro (nullable)
    if (!hasTipoIdColumn) {
      console.log('🔧 Criando coluna tipo_id...');
      await Property.sequelize!.query(`
        ALTER TABLE properties ADD COLUMN tipo_id UUID
      `);
      console.log('✅ Coluna tipo_id criada');
    }

    // 6. Migrar dados
    let migrated = 0;
    let skipped = 0;
    let errors = 0;
    const errorsList: string[] = [];

    for (const property of properties) {
      try {
        // Buscar o ID do tipo pelo nome
        const typeId = typeMap.get(property.tipo);
        
        if (typeId) {
          // Atualizar a propriedade com o ID do tipo
          await Property.sequelize!.query(`
            UPDATE properties SET tipo_id = $1 WHERE id = $2
          `, {
            bind: [typeId, property.id]
          });
          migrated++;
          console.log(`✅ Migrado: ${property.tipo} -> ${typeId}`);
        } else {
          const errorMsg = `Tipo não encontrado: ${property.tipo}`;
          console.log(`⚠️  ${errorMsg}`);
          errorsList.push(`Propriedade ${property.id}: ${errorMsg}`);
          errors++;
        }
      } catch (error) {
        const errorMsg = `Erro ao migrar propriedade ${property.id}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        errorsList.push(errorMsg);
        errors++;
      }
    }

    // 7. Se não há erros, fazer a coluna tipo_id NOT NULL e adicionar foreign key
    if (errors === 0) {
      console.log('🔧 Configurando constraints...');
      
      // Tornar a coluna NOT NULL
      await Property.sequelize!.query(`
        ALTER TABLE properties ALTER COLUMN tipo_id SET NOT NULL
      `);
      
      // Adicionar foreign key
      await Property.sequelize!.query(`
        ALTER TABLE properties 
        ADD CONSTRAINT fk_properties_tipo_id 
        FOREIGN KEY (tipo_id) REFERENCES property_types(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
      `);
      
      console.log('✅ Constraints configuradas');
      
      // 8. Opcional: remover a coluna tipo antiga (comentar se quiser manter)
      console.log('🗑️  Removendo coluna tipo antiga...');
      await Property.sequelize!.query(`
        ALTER TABLE properties DROP COLUMN tipo
      `);
      console.log('✅ Coluna tipo removida');
    }

    console.log('\n📈 Resumo da migração:');
    console.log(`✅ Migradas: ${migrated}`);
    console.log(`⏭️  Puladas: ${skipped}`);
    console.log(`❌ Erros: ${errors}`);

    if (errors > 0) {
      console.log('\n❌ Lista de erros:');
      errorsList.forEach(error => console.log(`   ${error}`));
    }

    if (errors === 0) {
      console.log('🎉 Migração concluída com sucesso!');
    } else {
      console.log('⚠️  Migração concluída com erros. Verifique os logs acima.');
    }

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
};

// Executar migração se chamado diretamente
if (require.main === module) {
  migratePropertyTypesComplete()
    .then(() => {
      console.log('🏁 Script finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

export default migratePropertyTypesComplete;
