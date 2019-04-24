module.exports = {
  attributes: {
    id: {
      type: 'number',
      unique: true,
      autoIncrement: true
    },
    user: {
      model: 'User',
      required: true
    },
    url: {
      type: 'string'
    },
    author: 'string',
    publisher: 'string',
    title: 'string',
    isbn: 'string',
    tags: 'string'
  }
}
