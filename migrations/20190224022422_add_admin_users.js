exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.boolean('admin').defaultTo(false)
    }),
    knex.schema.createTable('publishkey', t => {
      t.increments('id').primary()
      t.integer('user').notNullable().references('user.id').onDelete('CASCADE').onUpdate('CASCADE')
      t.string('name')
      t.string('url')
      t.string('appid')
      t.string('secret')
      t.string('verification_key')
      t.boolean('whitelisted').defaultTo(false)
      t.boolean('verified').defaultTo(false)
      t.timestamps(true, true)
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
