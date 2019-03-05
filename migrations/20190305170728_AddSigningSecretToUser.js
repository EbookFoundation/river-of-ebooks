const { generateToken } = require('../api/util')

exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.string('signing_secret')
    }),
    initUserSecrets(knex, Promise)
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.dropColumns('signing_secret')
    })
  ])
}

async function initUserSecrets (knex, Promise) {
  const users = await knex('user').whereNull('signing_secret')
  for (const user of users) {
    await knex('user').where({ id: user.id }).update({ signing_secret: generateToken({ bytes: 24 }) })
  }
}
