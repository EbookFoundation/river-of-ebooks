module.exports = async function (req, res, next) {
  const key = req.param('key') || req.header('x-roe-publish-key')
  const secret = req.param('secret') || req.header('x-roe-publish-secret')
  console.log(key)
  console.log(secret)

  if (await PublishKey.findOne({ key, secret })) {
    return next()
  }

  res.status(403).json({ error: 'Invalid publishing key.' })
}
