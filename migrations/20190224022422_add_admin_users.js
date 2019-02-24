exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.boolean('admin').defaultTo(false)
    }),
    knex.schema.createTable('publishkey', t => {
      t.increments('id').primary()
      t.integer('user').notNullable().references('user.id').onDelete('CASCADE').onUpdate('CASCADE')
      t.string('appid')
      t.string('secret')
      t.boolean('whitelisted')
      t.integer('created_at')
      t.integer('updated_at')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.dropColumns('admin')
    }),
    knex.schema.dropTable('publishkey')
  ])
}
