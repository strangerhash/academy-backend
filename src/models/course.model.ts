import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '@interfaces/users.interface';

export type UserCreationAttributes = Optional<
  User,
  | 'id'
  | 'title'
  | 'module'
 
>;

export class CourseModel extends Model<User, UserCreationAttributes> implements User {
  public id: number;
  public email: string;
  public password: string;
  public companyName: string;
  public town: string;
  public country: string;
  public city: string;
  public postalCode: string;
  public phoneNumber: string;
  public roleId: number;
  public firstName: string;
  public lastName: string;
  public account_verified!: boolean;
  public token!: string;
  public activation_code: string

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof CourseModel {
    CourseModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      companyName: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      town: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      country: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      city: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      postalCode: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      phoneNumber: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      roleId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      account_verified: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
      token: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      activation_code: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'users',
      sequelize,
    },
  );

  return CourseModel;
}
