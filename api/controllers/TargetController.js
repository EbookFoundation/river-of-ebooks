module.exports = {
  show: function (req, res) {
    res.view('pages/temp', {
      email: req.user.email
    })
  }
}
