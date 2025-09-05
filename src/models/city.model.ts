import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface para definir os atributos da cidade
interface CityAttributes {
  id: string;
  nome: string;
  estado: string;
  cep: string;
  ativo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para definir os atributos opcionais na criação
interface CityCreationAttributes extends Optional<CityAttributes, 'id' | 'ativo' | 'createdAt' | 'updatedAt'> {}

// Classe do modelo City
class City extends Model<CityAttributes, CityCreationAttributes> implements CityAttributes {
  public id!: string;
  public nome!: string;
  public estado!: string;
  public cep!: string;
  public ativo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Factory function para criar o modelo City
const CityFactory = (sequelize: Sequelize) => {
  // Inicialização do modelo
  City.init(
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
            msg: 'Nome da cidade é obrigatório'
          },
          len: {
            args: [2, 100],
            msg: 'Nome da cidade deve ter entre 2 e 100 caracteres'
          }
        }
      },
      estado: {
        type: DataTypes.STRING(2),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Estado é obrigatório'
          },
          len: {
            args: [2, 2],
            msg: 'Estado deve ter exatamente 2 caracteres (UF)'
          },
          isUppercase: {
            msg: 'Estado deve estar em maiúsculas'
          }
        }
      },
      cep: {
        type: DataTypes.STRING(9),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'CEP é obrigatório'
          },
          is: {
            args: /^\d{5}-?\d{3}$/,
            msg: 'CEP deve estar no formato 00000-000'
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
      modelName: 'City',
      tableName: 'cities',
      timestamps: true,
      paranoid: false,
      indexes: [
        {
          fields: ['nome']
        },
        {
          fields: ['estado']
        },
        {
          fields: ['ativo']
        },
        {
          unique: true,
          fields: ['nome', 'estado']
        }
      ]
    }
  );

  return City;
};

export default CityFactory;
