import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Interface para definir os atributos da propriedade
interface PropertyAttributes {
  id: string;
  titulo: string;
  descricao: string;
  tipo_id: string;
  finalidade: 'Venda' | 'Aluguel';
  valor: number;
  bairro: string;
  cidade: string;
  area_util: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  imagens: string[];
  destaque: boolean;
  imovel_do_mes: boolean;
  status: 'ativo' | 'inativo' | 'vendido' | 'alugado';
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para definir os atributos opcionais na criação
interface PropertyCreationAttributes extends Optional<PropertyAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Classe do modelo Property
class Property extends Model<PropertyAttributes, PropertyCreationAttributes> implements PropertyAttributes {
  public id!: string;
  public titulo!: string;
  public descricao!: string;
  public tipo_id!: string;
  public finalidade!: 'Venda' | 'Aluguel';
  public valor!: number;
  public bairro!: string;
  public cidade!: string;
  public area_util!: number;
  public quartos!: number;
  public banheiros!: number;
  public vagas!: number;
  public imagens!: string[];
  public destaque!: boolean;
  public imovel_do_mes!: boolean;
  public status!: 'ativo' | 'inativo' | 'vendido' | 'alugado';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Factory function para criar o modelo Property
const PropertyFactory = (sequelize: Sequelize) => {
  // Inicialização do modelo
  Property.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Título é obrigatório'
        },
        len: {
          args: [3, 255],
          msg: 'Título deve ter entre 3 e 255 caracteres'
        }
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Descrição é obrigatória'
        },
        len: {
          args: [10, 2000],
          msg: 'Descrição deve ter entre 10 e 2000 caracteres'
        }
      }
    },
    tipo_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Tipo é obrigatório'
        }
      }
    },
    finalidade: {
      type: DataTypes.ENUM('Venda', 'Aluguel'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Finalidade é obrigatória'
        }
      }
    },
    valor: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: 'Valor deve ser maior que zero'
        }
      }
    },
    bairro: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Bairro é obrigatório'
        }
      }
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Cidade é obrigatória'
        }
      }
    },
    area_util: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: 'Área útil deve ser maior que zero'
        }
      }
    },
    quartos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Número de quartos não pode ser negativo'
        },
        max: {
          args: [20],
          msg: 'Número de quartos não pode ser maior que 20'
        }
      }
    },
    banheiros: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: 'Deve ter pelo menos 1 banheiro'
        },
        max: {
          args: [20],
          msg: 'Número de banheiros não pode ser maior que 20'
        }
      }
    },
    vagas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Número de vagas não pode ser negativo'
        },
        max: {
          args: [20],
          msg: 'Número de vagas não pode ser maior que 20'
        }
      }
    },
    imagens: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    destaque: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    imovel_do_mes: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('ativo', 'inativo', 'vendido', 'alugado'),
      allowNull: false,
      defaultValue: 'ativo'
    }
  },
  {
    sequelize,
    modelName: 'Property',
    tableName: 'properties',
    timestamps: true,
    paranoid: false, // Não usar soft delete por enquanto
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['tipo_id']
      },
      {
        fields: ['finalidade']
      },
      {
        fields: ['cidade']
      },
      {
        fields: ['bairro']
      },
      {
        fields: ['destaque']
      },
      {
        fields: ['imovel_do_mes']
      },
      {
        fields: ['valor']
      }
    ]
  }
);

  return Property;
};

export default PropertyFactory;
