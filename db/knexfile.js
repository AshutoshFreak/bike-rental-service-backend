// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host:'bike-rental.c5wl4d118ddp.ap-south-1.rds.amazonaws.com',
      port : 5432,
      database: 'bike_rental',
      user:     'postgres',
      password: 'test1234'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
