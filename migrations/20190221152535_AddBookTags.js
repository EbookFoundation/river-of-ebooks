
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('book', t => {
      t.json('tags')
    }),
    knex.schema.table('targeturl', t => {
      t.json('tags')
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
