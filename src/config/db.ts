import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do banco de dados usando DB_URL ou parâmetros individuais
const sequelize = new Sequelize(
    process.env.DB_URL || 
    `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'imobiliaria'}`,
    {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true
        }
    }
);

// Importar e registrar modelos
import UserFactory from '../models/user.model';
import PropertyFactory from '../models/property.model';
import CityFactory from '../models/city.model';
import NeighborhoodFactory from '../models/neighborhood.model';
import PropertyTypeFactory from '../models/propertyType.model';

const User = UserFactory(sequelize);
const Property = PropertyFactory(sequelize);
const City = CityFactory(sequelize);
const Neighborhood = NeighborhoodFactory(sequelize);
const PropertyType = PropertyTypeFactory(sequelize);

// Sincronizar modelos com o banco de dados
const syncDatabase = async () => {
    try {
        // Usar force: true apenas se não houver dados (primeira execução)
        const userCount = await User.count();
        if (userCount === 0) {
            await sequelize.sync({ force: true });
            console.log('✅ Tabelas criadas do zero');
        } else {
            await sequelize.sync({ alter: true });
            console.log('✅ Modelos sincronizados com o banco de dados');
        }
    } catch (error) {
        console.error('❌ Erro ao sincronizar modelos:', error);
    }
};

// Executar sincronização se não estiver em produção
if (process.env.NODE_ENV !== 'production') {
    syncDatabase();
}

// Definir associações entre modelos
City.hasMany(Neighborhood, { foreignKey: 'cidade_id', as: 'bairros' });
Neighborhood.belongsTo(City, { foreignKey: 'cidade_id', as: 'cidade' });

export { sequelize, User, Property, City, Neighborhood, PropertyType };
export default sequelize;
