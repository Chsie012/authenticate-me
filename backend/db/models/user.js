'use strict';
const { Model, DataTypes, Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
    }

    // Instance method: Safely return user data (excludes sensitive fields)
    toSafeObject() {
      return {
        id: this.id,
        username: this.username,
        email: this.email
      };
    }

    // Instance method: Validate password
    async validatePassword(password) {
      return await bcrypt.compare(password, this.hashedPassword.toString());
    }

    // Static method: Find user by ID with safe scope
    static async getCurrentUserById(id) {
      return await this.scope('currentUser').findByPk(id);
    }

    // Static method: Authenticate user login
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await this.scope('loginUser').findOne({
        where: {
          [Op.or]: [{ username: credential }, { email: credential }]
        }
      });

      if (!user) return null; // Explicitly return null if user not found

      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) return null;

      return await this.scope('currentUser').findByPk(user.id);
    }

    // Static method: Signup new user
    static async signup({ username, email, password }) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds

      try {
        const user = await this.create({ username, email, hashedPassword });
        return await this.scope('currentUser').findByPk(user.id);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new Error('Username or email already taken.');
        }
        throw error;
      }
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Username cannot be an email.');
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,

      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword"] }
        },
        loginUser: {
          attributes: { include: ["hashedPassword", "email", "createdAt", "updatedAt"] }
        }
      }
    }
  );

  return User;
};
