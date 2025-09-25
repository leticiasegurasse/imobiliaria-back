import { Settings } from '../config/db';

// Script para adicionar o campo googleMapsLink às configurações existentes
export const updateSettingsWithGoogleMaps = async () => {
  try {
    console.log('🔄 Atualizando configurações com campo Google Maps...');

    // Buscar configurações existentes
    const existingSettings = await Settings.findOne({
      order: [['updatedAt', 'DESC']]
    });

    if (!existingSettings) {
      console.log('❌ Nenhuma configuração encontrada no banco de dados');
      return;
    }

    const currentData = existingSettings.toJSON();
    
    // Verificar se o campo já existe
    if (currentData.companyInfo.address.googleMapsEmbed) {
      console.log('✅ Campo googleMapsEmbed já existe nas configurações');
      return;
    }

    // Adicionar o campo googleMapsEmbed ao endereço
    const updatedData = {
      ...currentData,
      companyInfo: {
        ...currentData.companyInfo,
        address: {
          ...currentData.companyInfo.address,
          googleMapsEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4202.816849559726!2d-42.1990069!3d-21.415791900000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbce04b016934d7%3A0x84d564ec6ecab03f!2sVagner%2C%20Luiz%20e%20Adriana%20Corretores%20de%20Im%C3%B3veis!5e1!3m2!1spt-BR!2sbr!4v1757199837614!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
        }
      }
    };

    // Atualizar as configurações
    await existingSettings.update(updatedData as any);
    
    console.log('✅ Configurações atualizadas com sucesso!');
    console.log('🗺️ Código HTML do Google Maps adicionado');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar configurações:', error);
    throw error;
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  updateSettingsWithGoogleMaps()
    .then(() => {
      console.log('🎉 Atualização concluída!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro na atualização:', error);
      process.exit(1);
    });
}
