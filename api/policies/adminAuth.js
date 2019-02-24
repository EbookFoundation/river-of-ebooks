module.exports = async function (req, res, next) {
  if (req.user && (req.user.id === 1 || req.user.admin)) next()
  else res.status(403).json({ error: 'You are not permitted to perform this action.' })
}
