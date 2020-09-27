// Update with your config settings.

module.exports = {

  development: {
    client: process.env.DATABASE_CLIENT,
    connection: {
      database: process.env.DATABASE_NAME || 'app_spotify',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    useNullAsDefault: true
  },

  production: {
    client: process.env.DATABASE_CLIENT,
    connection: {
      database: process.env.DATABASE_NAME || 'app_spotify',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    }
  }

}
