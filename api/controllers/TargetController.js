module.exports = {
  show: function (req, res) {
    res.view('pages/targets', {
      email: req.user.email

    })
  }
}
