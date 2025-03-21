require('dotenv').config(); // Load environment variables from .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    seederStorage: 'sequelize'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require')
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {}
  }
};
