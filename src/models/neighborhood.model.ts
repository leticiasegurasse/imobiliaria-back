import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface para definir os atributos do bairro
interface NeighborhoodAttributes {
  id: string;
  nome: string;
  cidade_id: string;
  ativo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para definir os atributos opcionais na criação
interface NeighborhoodCreationAttributes extends Optional<NeighborhoodAttributes, 'id' | 'ativo' | 'createdAt' | 'updatedAt'> {}

// Classe do modelo Neighborhood
class Neighborhood extends Model<NeighborhoodAttributes, NeighborhoodCreationAttributes> implements NeighborhoodAttributes {
  public id!: string;
  public nome!: string;
  public cidade_id!: string;
  public ativo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Factory function para criar o modelo Neighborhood
const NeighborhoodFactory = (sequelize: Sequelize) => {
  // Inicialização do modelo
  Neighborhood.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Nome do bairro é obrigatório'
          },
          len: {
            args: [2, 100],
            msg: 'Nome do bairro deve ter entre 2 e 100 caracteres'
          }
        }
      },
      cidade_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id'
        },
        validate: {
          notEmpty: {
            msg: 'ID da cidade é obrigatório'
          }
        }
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Neighborhood',
      tableName: 'neighborhoods',
      timestamps: true,
      paranoid: false,
      indexes: [
        {
          fields: ['nome']
        },
        {
          fields: ['cidade_id']
        },
        {
          fields: ['ativo']
        },
        {
          unique: true,
          fields: ['nome', 'cidade_id']
        }
      ]
    }
  );

  return Neighborhood;
};

export default NeighborhoodFactory;
