exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.dropColumns('created_at', 'updated_at')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.table('passport', t => {
      t.dropColumns('created_at', 'updated_at')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.table('targeturl', t => {
      t.dropColumns('created_at', 'updated_at')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.table('book', t => {
      t.dropColumns('created_at', 'updated_at')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.dropColumns('created_at', 'updated_at')
      t.integer('created_at')
      t.integer('updated_at')
    }),
    knex.schema.table('passport', t => {
      t.dropColumns('created_at', 'updated_at')
      t.integer('created_at')
      t.integer('updated_at')
    }),
    knex.schema.table('targeturl', t => {
      t.dropColumns('created_at', 'updated_at')
      t.integer('created_at')
      t.integer('updated_at')
    }),
    knex.schema.table('book', t => {
      t.dropColumns('created_at', 'updated_at')
      t.integer('created_at')
      t.integer('updated_at')
    })
  ])
}
