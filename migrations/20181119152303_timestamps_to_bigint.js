exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.table('passport', t => {
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.table('targeturl', t => {
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.table('book', t => {
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.integer('created_at')
      t.integer('updated_at')
    }),
    knex.schema.table('passport', t => {
      t.integer('created_at')
      t.integer('updated_at')
    }),
    knex.schema.table('targeturl', t => {
      t.integer('created_at')
      t.integer('updated_at')
    }),
    knex.schema.table('book', t => {
      t.integer('created_at')
      t.integer('updated_at')
    })
  ])
}
