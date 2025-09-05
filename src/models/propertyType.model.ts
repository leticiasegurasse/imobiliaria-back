import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface para definir os atributos do tipo de imóvel
interface PropertyTypeAttributes {
  id: string;
  nome: string;
  descricao?: string;
  categoria: 'residencial' | 'comercial' | 'rural' | 'terreno';
  ativo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para definir os atributos opcionais na criação
interface PropertyTypeCreationAttributes extends Optional<PropertyTypeAttributes, 'id' | 'descricao' | 'ativo' | 'createdAt' | 'updatedAt'> {}

// Classe do modelo PropertyType
class PropertyType extends Model<PropertyTypeAttributes, PropertyTypeCreationAttributes> implements PropertyTypeAttributes {
  public id!: string;
  public nome!: string;
  public descricao?: string;
  public categoria!: 'residencial' | 'comercial' | 'rural' | 'terreno';
  public ativo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Factory function para criar o modelo PropertyType
const PropertyTypeFactory = (sequelize: Sequelize) => {
  // Inicialização do modelo
  PropertyType.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Nome do tipo de imóvel é obrigatório'
          },
          len: {
            args: [2, 50],
            msg: 'Nome do tipo de imóvel deve ter entre 2 e 50 caracteres'
          }
        }
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 500],
            msg: 'Descrição deve ter no máximo 500 caracteres'
          }
        }
      },
      categoria: {
        type: DataTypes.ENUM('residencial', 'comercial', 'rural', 'terreno'),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Categoria é obrigatória'
          },
          isIn: {
            args: [['residencial', 'comercial', 'rural', 'terreno']],
            msg: 'Categoria deve ser: residencial, comercial, rural ou terreno'
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
      modelName: 'PropertyType',
      tableName: 'property_types',
      timestamps: true,
      paranoid: false,
      indexes: [
        {
          fields: ['nome']
        },
        {
          fields: ['categoria']
        },
        {
          fields: ['ativo']
        },
        {
          unique: true,
          fields: ['nome']
        }
      ]
    }
  );

  return PropertyType;
};

export default PropertyTypeFactory;
