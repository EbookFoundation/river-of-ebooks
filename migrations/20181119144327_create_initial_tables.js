exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', t => {
      t.increments('id').primary()
      t.string('email').notNullable()
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.createTable('passport', t => {
      t.increments('id').primary()
      t.string('protocol').notNullable()
      t.string('password')
      t.string('accesstoken')
      t.string('provider')
      t.string('identifier')
      t.json('tokens')
      t.integer('user').notNullable().references('user.id').onDelete('CASCADE').onUpdate('CASCADE')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.createTable('targeturl', t => {
      t.increments('id').primary()
      t.integer('user').notNullable().references('user.id').onDelete('CASCADE').onUpdate('CASCADE')
      t.string('url')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.createTable('book', t => {
      t.increments('id').primary()
      t.string('source')
      t.string('storage')
      t.string('title').notNullable()
      t.string('author')
      t.string('version')
      t.string('isbn')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('book'),
    knex.schema.dropTable('targeturl'),
    knex.schema.dropTable('passport'),
    knex.schema.dropTable('user')
  ])
}
