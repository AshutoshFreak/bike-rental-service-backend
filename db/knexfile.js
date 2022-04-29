// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host:'ec2-63-35-156-160.eu-west-1.compute.amazonaws.com',
      port : 5432,
      database: 'd35ck4b1r6kfg1',
      user:     'xbwtktppilbtmt',
      password: '9ff5ba2a35afc3c12aaf9fe800261915925b569978f873a262cf5fcfd642cac5',
      ssl: {
        rejectUnauthorized: false
      }
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
