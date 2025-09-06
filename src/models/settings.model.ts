import { DataTypes, Model, Sequelize } from 'sequelize';

// Interface para o modelo de Configurações
interface SettingsAttributes {
    id?: number;
    companyInfo: {
        name: string;
        cnpj: string;
        address: {
            street: string;
            number: string;
            complement?: string;
            neighborhood: string;
            city: string;
            state: string;
            zipCode: string;
            googleMapsEmbed?: string;
        };
        contact: {
            phone: string;
            whatsapp: string;
            email: string;
            website?: string;
        };
        businessHours: {
            weekdays: string;
            weekend?: string;
        };
        socialMedia: {
            facebook?: string;
            instagram?: string;
            linkedin?: string;
            youtube?: string;
        };
    };
    visualIdentity: {
        logo: string;
        favicon?: string;
        colors: {
            primary: string;
            secondary: string;
            accent: string;
            background: string;
            text: string;
        };
        fonts: {
            primary: string;
            secondary?: string;
        };
        heroImage: string;
        aboutImage?: string;
    };
    siteContent: {
        hero: {
            title: string;
            subtitle: string;
            searchPlaceholder: string;
        };
        about: {
            title: string;
            content: string;
            mission?: string;
            vision?: string;
            values?: string[];
        };
        services: {
            title: string;
            items: Array<{
                title: string;
                description: string;
                icon: string;
            }>;
        };
        team: Array<{
            name: string;
            role: string;
            description: string;
            photo?: string;
            creci?: string;
            email?: string;
            phone?: string;
        }>;
        footer: {
            copyright: string;
            developedBy: {
                text: string;
                link: string;
            };
        };
    };
    seoSettings: {
        siteName: string;
        siteDescription: string;
        keywords: string[];
        author: string;
        ogImage?: string;
        favicon?: string;
        googleAnalytics?: string;
        googleTagManager?: string;
        facebookPixel?: string;
    };
    systemSettings: {
        maintenance: {
            enabled: boolean;
            message?: string;
            allowedIPs?: string[];
        };
        email: {
            provider: 'smtp' | 'sendgrid' | 'mailgun';
            settings: {
                host?: string;
                port?: number;
                username?: string;
                password?: string;
                apiKey?: string;
            };
            templates: {
                contact: string;
                inquiry: string;
                newsletter?: string;
            };
        };
        integrations: {
            whatsapp: {
                enabled: boolean;
                number: string;
                message: string;
            };
            maps: {
                provider: 'google' | 'mapbox';
                apiKey?: string;
                defaultLocation: {
                    lat: number;
                    lng: number;
                    zoom: number;
                };
            };
        };
    };
    updatedAt?: Date;
    updatedBy?: string;
}

// Modelo de Configurações
export default (sequelize: Sequelize) => {
    class Settings extends Model<SettingsAttributes> implements SettingsAttributes {
        public id!: number;
        public companyInfo!: SettingsAttributes['companyInfo'];
        public visualIdentity!: SettingsAttributes['visualIdentity'];
        public siteContent!: SettingsAttributes['siteContent'];
        public seoSettings!: SettingsAttributes['seoSettings'];
        public systemSettings!: SettingsAttributes['systemSettings'];
        public readonly updatedAt!: Date;
        public updatedBy?: string;
    }

    Settings.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            companyInfo: {
                type: DataTypes.JSON,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            visualIdentity: {
                type: DataTypes.JSON,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            siteContent: {
                type: DataTypes.JSON,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            seoSettings: {
                type: DataTypes.JSON,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            systemSettings: {
                type: DataTypes.JSON,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            updatedBy: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Settings',
            tableName: 'settings',
            timestamps: true,
            updatedAt: true,
            createdAt: false, // Não precisamos de createdAt para configurações
        }
    );

    return Settings;
};
