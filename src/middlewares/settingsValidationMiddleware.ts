import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

// Middleware para tratar erros de validação
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array().map(error => ({
        field: error.type === 'field' ? (error as any).path : (error as any).param,
        message: error.msg,
        value: error.type === 'field' ? (error as any).value : undefined
      }))
    });
    return;
  }
  next();
};

// Validações para atualização de configurações
export const validateSettingsUpdate = [
  // Validações para companyInfo
  body('companyInfo.name')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nome da empresa deve ter entre 2 e 255 caracteres')
    .trim(),
  
  body('companyInfo.cnpj')
    .optional()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'),
  
  body('companyInfo.address.street')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Rua deve ter entre 2 e 255 caracteres')
    .trim(),
  
  body('companyInfo.address.number')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Número deve ter entre 1 e 20 caracteres')
    .trim(),
  
  body('companyInfo.address.neighborhood')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Bairro deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('companyInfo.address.city')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('companyInfo.address.state')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter exatamente 2 caracteres')
    .trim(),
  
  body('companyInfo.address.zipCode')
    .optional()
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP deve estar no formato XXXXX-XXX'),
  
  body('companyInfo.address.googleMapsEmbed')
    .optional()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Código do Google Maps deve ter entre 10 e 2000 caracteres'),
  
  body('companyInfo.contact.phone')
    .optional()
    .matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/)
    .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX'),
  
  body('companyInfo.contact.whatsapp')
    .optional()
    .matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/)
    .withMessage('WhatsApp deve estar no formato (XX) XXXXX-XXXX'),
  
  body('companyInfo.contact.email')
    .optional()
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  
  body('companyInfo.contact.website')
    .optional()
    .isURL()
    .withMessage('Website deve ser uma URL válida'),
  
  body('companyInfo.socialMedia.facebook')
    .optional()
    .isURL()
    .withMessage('Facebook deve ser uma URL válida'),
  
  body('companyInfo.socialMedia.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram deve ser uma URL válida'),
  
  body('companyInfo.socialMedia.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn deve ser uma URL válida'),
  
  body('companyInfo.socialMedia.youtube')
    .optional()
    .isURL()
    .withMessage('YouTube deve ser uma URL válida'),

  // Validações para visualIdentity
  body('visualIdentity.logo')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Logo deve ter entre 1 e 500 caracteres'),
  
  body('visualIdentity.favicon')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Favicon deve ter entre 1 e 500 caracteres'),
  
  body('visualIdentity.colors.primary')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Cor primária deve ser um código hexadecimal válido (ex: #FF0000)'),
  
  body('visualIdentity.colors.secondary')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Cor secundária deve ser um código hexadecimal válido (ex: #FF0000)'),
  
  body('visualIdentity.colors.accent')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Cor de destaque deve ser um código hexadecimal válido (ex: #FF0000)'),
  
  body('visualIdentity.colors.background')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Cor de fundo deve ser um código hexadecimal válido (ex: #FF0000)'),
  
  body('visualIdentity.colors.text')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Cor do texto deve ser um código hexadecimal válido (ex: #FF0000)'),
  
  body('visualIdentity.heroImage')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Imagem do hero deve ter entre 1 e 500 caracteres'),
  
  body('visualIdentity.aboutImage')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Imagem sobre deve ter entre 1 e 500 caracteres'),

  // Validações para siteContent
  body('siteContent.hero.title')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Título do hero deve ter entre 3 e 255 caracteres')
    .trim(),
  
  body('siteContent.hero.subtitle')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Subtítulo do hero deve ter entre 10 e 500 caracteres')
    .trim(),
  
  body('siteContent.about.title')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Título sobre deve ter entre 3 e 255 caracteres')
    .trim(),
  
  body('siteContent.about.content')
    .optional()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Conteúdo sobre deve ter entre 50 e 5000 caracteres')
    .trim(),
  
  body('siteContent.about.mission')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Missão deve ter entre 10 e 500 caracteres')
    .trim(),
  
  body('siteContent.about.vision')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Visão deve ter entre 10 e 500 caracteres')
    .trim(),
  
  body('siteContent.services.title')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Título dos serviços deve ter entre 3 e 255 caracteres')
    .trim(),
  
  body('siteContent.footer.copyright')
    .optional()
    .isLength({ min: 10, max: 255 })
    .withMessage('Copyright deve ter entre 10 e 255 caracteres')
    .trim(),

  // Validações para seoSettings
  body('seoSettings.siteName')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Nome do site deve ter entre 3 e 255 caracteres')
    .trim(),
  
  body('seoSettings.siteDescription')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Descrição do site deve ter entre 10 e 500 caracteres')
    .trim(),
  
  body('seoSettings.author')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Autor deve ter entre 2 e 255 caracteres')
    .trim(),
  
  body('seoSettings.ogImage')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Imagem OG deve ter entre 1 e 500 caracteres'),
  
  body('seoSettings.favicon')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Favicon deve ter entre 1 e 500 caracteres'),
  
  body('seoSettings.googleAnalytics')
    .optional()
    .matches(/^G-[A-Z0-9]{10}$/)
    .withMessage('Google Analytics deve estar no formato G-XXXXXXXXXX'),
  
  body('seoSettings.googleTagManager')
    .optional()
    .matches(/^GTM-[A-Z0-9]{7}$/)
    .withMessage('Google Tag Manager deve estar no formato GTM-XXXXXXX'),

  // Validações para systemSettings
  body('systemSettings.maintenance.enabled')
    .optional()
    .isBoolean()
    .withMessage('Status de manutenção deve ser um valor booleano'),
  
  body('systemSettings.maintenance.message')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Mensagem de manutenção deve ter entre 10 e 500 caracteres')
    .trim(),
  
  body('systemSettings.email.provider')
    .optional()
    .isIn(['smtp', 'sendgrid', 'mailgun'])
    .withMessage('Provedor de email deve ser smtp, sendgrid ou mailgun'),
  
  body('systemSettings.email.settings.host')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Host do email deve ter entre 3 e 255 caracteres')
    .trim(),
  
  body('systemSettings.email.settings.port')
    .optional()
    .isInt({ min: 1, max: 65535 })
    .withMessage('Porta do email deve ser um número entre 1 e 65535'),
  
  body('systemSettings.email.settings.username')
    .optional()
    .isEmail()
    .withMessage('Username do email deve ser um email válido')
    .normalizeEmail(),
  
  body('systemSettings.integrations.whatsapp.enabled')
    .optional()
    .isBoolean()
    .withMessage('Status do WhatsApp deve ser um valor booleano'),
  
  body('systemSettings.integrations.whatsapp.number')
    .optional()
    .matches(/^\d{10,15}$/)
    .withMessage('Número do WhatsApp deve conter apenas números e ter entre 10 e 15 dígitos'),
  
  body('systemSettings.integrations.maps.provider')
    .optional()
    .isIn(['google', 'mapbox'])
    .withMessage('Provedor de mapas deve ser google ou mapbox'),
  
  body('systemSettings.integrations.maps.defaultLocation.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude deve ser um número entre -90 e 90'),
  
  body('systemSettings.integrations.maps.defaultLocation.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude deve ser um número entre -180 e 180'),
  
  body('systemSettings.integrations.maps.defaultLocation.zoom')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Zoom deve ser um número inteiro entre 1 e 20'),

  // Validação do parâmetro section
  param('section')
    .optional()
    .isIn(['companyInfo', 'visualIdentity', 'siteContent', 'seoSettings', 'systemSettings'])
    .withMessage('Seção deve ser: companyInfo, visualIdentity, siteContent, seoSettings ou systemSettings'),

  handleValidationErrors
];
