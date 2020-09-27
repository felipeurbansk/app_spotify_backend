// Update with your config settings.

module.exports = {

  development: {
    client: "mysql",
    connection: {
      database: "app_spotify",
      user: "root",
      password: ""
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: "knex_migrations"
    },
    seeds: {
      directory: './src/database/seeds',
    },
    useNullAsDefault: true,
  },

  test: {
    client: "mysql",
    connection: {
      database: "app_spotify_test",
      user: "root",
      password: ""
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/test/database/migrations',
      tableName: "knex_migrations"
    },
    seeds: {
      directory: './src/test/database/seeds',
    },
    useNullAsDefault: true,
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: "knex_migrations"
    },
    seeds: {
      directory: './src/database/seeds',
    }
  }

};
