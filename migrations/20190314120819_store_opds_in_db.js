exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('book', t => {
      t.json('opds')
      t.renameColumn('isbn', 'identifier')
      t.dropColumns('storage')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('book', t => {
      t.dropColumns('opds')
      t.renameColumn('identifier', 'isbn')
      t.string('storage')
    })
  ])
}
