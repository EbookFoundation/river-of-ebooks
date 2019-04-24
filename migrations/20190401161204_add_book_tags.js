exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('book', t => {
      t.string('tags')
    }),
    knex.schema.table('targeturl', t => {
      t.string('tags')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('book', t => {
      t.dropColumns('tags')
    }),
    knex.schema.table('targeturl', t => {
      t.dropColumns('tags')
    })
  ])
}
