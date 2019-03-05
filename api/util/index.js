function asyncRead (adapter, helper, storage) {
  return new Promise((resolve, reject) => {
    adapter.read(storage, (err, data) => {
      if (err) return reject(err)
      try {
        data = data.toString('utf-8')
        let result
        if ((result = helper.deserializeOpds1(data)) !== false) {
          resolve(result)
        } else {
          resolve(JSON.parse(data))
        }
      } catch (e) {
        reject(e)
      }
    })
  })
}

module.exports = {
  asyncRead
}
