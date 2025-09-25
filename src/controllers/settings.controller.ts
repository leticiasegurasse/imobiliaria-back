import { Request, Response } from 'express';
import { Settings } from '../config/db';

// Interface para validação de configurações
interface SettingsUpdateRequest {
    companyInfo?: {
        name?: string;
        cnpj?: string;
        address?: {
            street?: string;
            number?: string;
            complement?: string;
            neighborhood?: string;
            city?: string;
            state?: string;
            zipCode?: string;
        };
        contact?: {
            phone?: string;
            whatsapp?: string;
            email?: string;
            website?: string;
        };
        businessHours?: {
            weekdays?: string;
            weekend?: string;
        };
        socialMedia?: {
            facebook?: string;
            instagram?: string;
            linkedin?: string;
            youtube?: string;
        };
    };
    visualIdentity?: {
        logo?: string;
        favicon?: string;
        colors?: {
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
            text?: string;
        };
        fonts?: {
            primary?: string;
            secondary?: string;
        };
        heroImage?: string;
        aboutImage?: string;
    };
    siteContent?: {
        hero?: {
            title?: string;
            subtitle?: string;
            searchPlaceholder?: string;
        };
        about?: {
            title?: string;
            content?: string;
            mission?: string;
            vision?: string;
            values?: string[];
        };
        services?: {
            title?: string;
            items?: Array<{
                title?: string;
                description?: string;
                icon?: string;
            }>;
        };
        team?: Array<{
            name?: string;
            role?: string;
            description?: string;
            photo?: string;
            creci?: string;
            email?: string;
            phone?: string;
        }>;
        footer?: {
            copyright?: string;
            developedBy?: {
                text?: string;
                link?: string;
            };
        };
    };
    seoSettings?: {
        siteName?: string;
        siteDescription?: string;
        keywords?: string[];
        author?: string;
        ogImage?: string;
        favicon?: string;
        googleAnalytics?: string;
        googleTagManager?: string;
        facebookPixel?: string;
    };
    systemSettings?: {
        email?: {
            provider?: 'smtp' | 'sendgrid' | 'mailgun';
            settings?: {
                host?: string;
                port?: number;
                username?: string;
                password?: string;
                apiKey?: string;
            };
            templates?: {
                contact?: string;
                inquiry?: string;
                newsletter?: string;
            };
        };
        integrations?: {
            whatsapp?: {
                enabled?: boolean;
                number?: string;
                message?: string;
            };
            maps?: {
                provider?: 'google' | 'mapbox';
                apiKey?: string;
                defaultLocation?: {
                    lat?: number;
                    lng?: number;
                    zoom?: number;
                };
            };
        };
    };
}

// Buscar configurações atuais
export const getSettings = async (req: Request, res: Response) => {
    try {
        // Buscar a primeira (e única) configuração
        const settings = await Settings.findOne({
            order: [['updatedAt', 'DESC']]
        });

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'Configurações não encontradas'
            });
        }

        res.json({
            success: true,
            data: settings,
            message: 'Configurações recuperadas com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao buscar configurações'
        });
    }
};

// Atualizar configurações
export const updateSettings = async (req: Request, res: Response) => {
    try {
        const updateData: SettingsUpdateRequest = req.body;
        const userId = (req as any).user?.id; // ID do usuário autenticado
        const userEmail = (req as any).user?.email; // Email do usuário autenticado

        // Buscar configurações existentes
        let settings = await Settings.findOne({
            order: [['updatedAt', 'DESC']]
        });

        if (!settings) {
            // Se não existir configurações, criar uma nova com dados padrão
            const defaultSettings = {
                companyInfo: {
                    name: 'Empresa',
                    cnpj: '',
                    address: {
                        street: '',
                        number: '',
                        neighborhood: '',
                        city: '',
                        state: '',
                        zipCode: ''
                    },
                    contact: {
                        phone: '',
                        whatsapp: '',
                        email: ''
                    },
                    businessHours: {
                        weekdays: ''
                    },
                    socialMedia: {}
                },
                visualIdentity: {
                    logo: '',
                    colors: {
                        primary: '#1E3932',
                        secondary: '#9D6B53',
                        accent: '#C0A062',
                        background: '#F4EDE4',
                        text: '#FAFAFA'
                    },
                    fonts: {
                        primary: 'Inter, system-ui, sans-serif'
                    },
                    heroImage: ''
                },
                siteContent: {
                    hero: {
                        title: '',
                        subtitle: '',
                        searchPlaceholder: ''
                    },
                    about: {
                        title: '',
                        content: ''
                    },
                    services: {
                        title: '',
                        items: []
                    },
                    team: [],
                    footer: {
                        copyright: '',
                        developedBy: {
                            text: '',
                            link: ''
                        }
                    }
                },
                seoSettings: {
                    siteName: '',
                    siteDescription: '',
                    keywords: [],
                    author: ''
                },
                systemSettings: {
                    email: {
                        provider: 'smtp' as const,
                        settings: {},
                        templates: {
                            contact: '',
                            inquiry: ''
                        }
                    },
                    integrations: {
                        whatsapp: {
                            enabled: false,
                            number: '',
                            message: ''
                        },
                        maps: {
                            provider: 'google' as const,
                            defaultLocation: {
                                lat: 0,
                                lng: 0,
                                zoom: 10
                            }
                        }
                    }
                }
            };

            // Mesclar com dados fornecidos
            const mergedData = {
                companyInfo: { ...defaultSettings.companyInfo, ...updateData.companyInfo },
                visualIdentity: { ...defaultSettings.visualIdentity, ...updateData.visualIdentity },
                siteContent: { ...defaultSettings.siteContent, ...updateData.siteContent },
                seoSettings: { ...defaultSettings.seoSettings, ...updateData.seoSettings },
                systemSettings: { ...defaultSettings.systemSettings, ...updateData.systemSettings }
            };

            settings = await Settings.create({
                ...mergedData,
                updatedBy: userEmail || 'sistema'
            } as any);
        } else {
            // Atualizar configurações existentes
            const currentData = settings.toJSON();
            
            // Mesclar dados existentes com novos dados
            const mergedData = {
                companyInfo: { ...currentData.companyInfo, ...updateData.companyInfo },
                visualIdentity: { ...currentData.visualIdentity, ...updateData.visualIdentity },
                siteContent: { ...currentData.siteContent, ...updateData.siteContent },
                seoSettings: { ...currentData.seoSettings, ...updateData.seoSettings },
                systemSettings: { ...currentData.systemSettings, ...updateData.systemSettings }
            };

            await settings.update({
                ...mergedData,
                updatedBy: userEmail || 'sistema'
            } as any);
        }

        // Buscar configurações atualizadas
        const updatedSettings = await Settings.findOne({
            order: [['updatedAt', 'DESC']]
        });

        res.json({
            success: true,
            data: updatedSettings,
            message: 'Configurações atualizadas com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao atualizar configurações'
        });
    }
};

// Buscar configurações específicas por seção
export const getSettingsSection = async (req: Request, res: Response) => {
    try {
        const { section } = req.params;
        
        const validSections = ['companyInfo', 'visualIdentity', 'siteContent', 'seoSettings', 'systemSettings'];
        
        if (!validSections.includes(section)) {
            return res.status(400).json({
                success: false,
                message: 'Seção inválida. Seções válidas: companyInfo, visualIdentity, siteContent, seoSettings, systemSettings'
            });
        }

        const settings = await Settings.findOne({
            order: [['updatedAt', 'DESC']]
        });

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'Configurações não encontradas'
            });
        }

        const sectionData = (settings as any)[section];

        res.json({
            success: true,
            data: sectionData,
            message: `Seção ${section} recuperada com sucesso`
        });
    } catch (error) {
        console.error('Erro ao buscar seção de configurações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao buscar seção de configurações'
        });
    }
};

// Atualizar configurações específicas por seção
export const updateSettingsSection = async (req: Request, res: Response) => {
    try {
        const { section } = req.params;
        const updateData = req.body;
        const userEmail = (req as any).user?.email;

        const validSections = ['companyInfo', 'visualIdentity', 'siteContent', 'seoSettings', 'systemSettings'];
        
        if (!validSections.includes(section)) {
            return res.status(400).json({
                success: false,
                message: 'Seção inválida. Seções válidas: companyInfo, visualIdentity, siteContent, seoSettings, systemSettings'
            });
        }

        let settings = await Settings.findOne({
            order: [['updatedAt', 'DESC']]
        });

        if (!settings) {
            // Se não existir configurações, criar uma nova com a seção específica
            const newSettings: any = {
                companyInfo: {},
                visualIdentity: {},
                siteContent: {},
                seoSettings: {},
                systemSettings: {},
                updatedBy: userEmail || 'sistema'
            };
            
            newSettings[section] = updateData;
            
            settings = await Settings.create(newSettings);
        } else {
            // Atualizar seção específica
            const currentData = settings.toJSON();
            const mergedSectionData = { ...(currentData as any)[section], ...updateData };
            
            await settings.update({
                [section]: mergedSectionData,
                updatedBy: userEmail || 'sistema'
            });
        }

        // Buscar configurações atualizadas
        const updatedSettings = await Settings.findOne({
            order: [['updatedAt', 'DESC']]
        });

        res.json({
            success: true,
            data: updatedSettings,
            message: `Seção ${section} atualizada com sucesso`
        });
    } catch (error) {
        console.error('Erro ao atualizar seção de configurações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao atualizar seção de configurações'
        });
    }
};
