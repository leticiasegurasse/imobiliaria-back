import { Property, PropertyType } from '../config/db';
import { Op } from 'sequelize';

// Script para migrar tipos de propriedade de string para ID
const migratePropertyTypes = async () => {
  try {
    console.log('🔄 Iniciando migração de tipos de propriedade...');

    // Buscar todas as propriedades
    const properties = await Property.findAll({
      attributes: ['id', 'tipo_id']
    });

    console.log(`📊 Encontradas ${properties.length} propriedades para migrar`);

    // Buscar todos os tipos de propriedade
    const propertyTypes = await PropertyType.findAll({
      attributes: ['id', 'nome']
    });

    console.log(`📋 Encontrados ${propertyTypes.length} tipos de propriedade`);

    // Criar mapeamento de nome para ID
    const typeMap = new Map<string, string>();
    propertyTypes.forEach(type => {
      typeMap.set(type.nome, type.id);
    });

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    // Migrar cada propriedade
    for (const property of properties) {
      try {
        // Se o tipo já é um UUID, pular
        if (property.tipo_id && property.tipo_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          skipped++;
          continue;
        }

        // Buscar o ID do tipo pelo nome (se tipo_id contém o nome)
        const typeId = typeMap.get(property.tipo_id);
        
        if (typeId) {
          // Atualizar a propriedade com o ID do tipo
          await Property.update(
            { tipo_id: typeId },
            { where: { id: property.id } }
          );
          migrated++;
          console.log(`✅ Migrado: ${property.tipo_id} -> ${typeId}`);
        } else {
          console.log(`⚠️  Tipo não encontrado: ${property.tipo_id}`);
          errors++;
        }
      } catch (error) {
        console.error(`❌ Erro ao migrar propriedade ${property.id}:`, error);
        errors++;
      }
    }

    console.log('\n📈 Resumo da migração:');
    console.log(`✅ Migradas: ${migrated}`);
    console.log(`⏭️  Puladas: ${skipped}`);
    console.log(`❌ Erros: ${errors}`);

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
  migratePropertyTypes()
    .then(() => {
      console.log('🏁 Script finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

export default migratePropertyTypes;
