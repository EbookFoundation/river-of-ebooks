exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('targeturl', t => {
      t.string('title')
      t.string('author')
      t.string('publisher')
      t.string('isbn')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('targeturl', t => {
      t.dropColumns('title', 'author', 'publisher', 'isbn')
    })
  ])
}
