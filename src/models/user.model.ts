import { DataTypes, Model, Sequelize } from 'sequelize';

// Interface para o modelo de Usuário
interface UserAttributes {
    id?: number;
    username: string;
    email: string;
    fullName: string;
    accessLevel: 'admin' | 'editor';
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Modelo de Usuário (para autenticação)
export default (sequelize: Sequelize) => {
    class User extends Model<UserAttributes> implements UserAttributes {
        public id!: number;
        public username!: string;
        public email!: string;
        public fullName!: string;
        public accessLevel!: 'admin' | 'editor';
        public password!: string;
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 50],
                    notEmpty: true,
                },
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                    notEmpty: true,
                },
            },
            fullName: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    len: [2, 100],
                    notEmpty: true,
                },
            },
            accessLevel: {
                type: DataTypes.ENUM('admin', 'editor'),
                allowNull: false,
                defaultValue: 'editor',
                validate: {
                    isIn: [['admin', 'editor']],
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [6, 255],
                    notEmpty: true,
                },
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['username'],
                },
                {
                    unique: true,
                    fields: ['email'],
                },
                {
                    fields: ['accessLevel'],
                },
            ],
        }
    );

    return User;
};
