exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('publishkey', t => {
      t.bigInteger('created_at').alter()
      t.bigInteger('updated_at').alter()
    })
  ])
}

exports.down = function (knex, Promise) {

}
