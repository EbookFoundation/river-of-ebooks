exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('user', t => {
      t.bigInteger('created_at').alter()
      t.bigInteger('updated_at').alter()
    }),
    knex.schema.alterTable('passport', t => {
      t.bigInteger('created_at').alter()
      t.bigInteger('updated_at').alter()
    }),
    knex.schema.alterTable('targeturl', t => {
      t.bigInteger('created_at').alter()
      t.bigInteger('updated_at').alter()
    }),
    knex.schema.alterTable('book', t => {
      t.bigInteger('created_at').alter()
      t.bigInteger('updated_at').alter()
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('user', t => {
      t.integer('created_at').alter()
      t.integer('updated_at').alter()
    }),
    knex.schema.alterTable('passport', t => {
      t.integer('created_at').alter()
      t.integer('updated_at').alter()
    }),
    knex.schema.alterTable('targeturl', t => {
      t.integer('created_at').alter()
      t.integer('updated_at').alter()
    }),
    knex.schema.alterTable('book', t => {
      t.integer('created_at').alter()
      t.integer('updated_at').alter()
    })
  ])
}
