class HttpError extends Error {
  constructor (status, message, hint) {
    super(message)
    if (typeof status !== 'number') throw new Error('HttpError status must be an integer')
    this.status = status
    this.hint = hint || 'none'
  }
  send (res) {
    return res.status(this.status).json({
      error: this.message,
      hint: this.hint
    })
  }
}

module.exports = HttpError
