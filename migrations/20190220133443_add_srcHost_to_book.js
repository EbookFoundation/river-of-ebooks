exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('book', t => {
      t.string('hostname')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('book', t => {
      t.dropColumns('hostname')
    })
  ])
}
