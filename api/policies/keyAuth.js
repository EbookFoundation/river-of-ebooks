module.exports = async function (req, res, next) {
  const key = req.param('key') || req.headers['roe-key']
  const secret = req.param('secret') || req.headers['roe-secret']

  const pk = await PublishKey.findOne({ appid: key, secret })
  if (pk) {
    if (pk.whitelisted) return next()
    else res.status(403).json({ error: 'Your key has not been whitelisted yet. Please contact the site operator.' })
  }

  res.status(403).json({ error: 'Invalid publishing key.' })
}
