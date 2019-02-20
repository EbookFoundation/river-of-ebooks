exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('book', t => {
      t.string('publisher')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('book', t => {
      t.dropColumns('publisher')
    })
  ])
}
