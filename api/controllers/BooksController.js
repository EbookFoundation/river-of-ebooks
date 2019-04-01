/**
 * BooksController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const HttpError = require('../errors/HttpError')
const { hmacSign } = require('../util')
const request = require('request')
const uriRegex = /^(.+:\/\/)?(.+\.)*(.+\.).{1,}(:\d+)?(.+)?/i

module.exports = {
  publish: async function (req, res) {
    try {
      const body = req.body
      const host = req.hostname
      let result

      if (!host) throw new HttpError(400, 'Missing hostname')
      if (!body) throw new HttpError(400, 'Missing body')
      if (!body.metadata) throw new HttpError(400, 'Missing OPDS metadata')
      if (!body.metadata['@type'] || body.metadata['@type'] !== 'http://schema.org/Book') throw new HttpError(400, 'Invalid \'@type\': expected \'http://schema.org/Book\'')

      let tags = (body.metadata.tags || '').split(/,\s*/)
      if (!tags.length && body.metadata.title) tags = body.metadata.title.split(/\s+/).filter(x => x.length < 3)
      const query = {
        hostname: host,
        title: body.metadata.title,
        author: body.metadata.author,
        publisher: body.metadata.publisher,
        identifier: body.metadata.identifier,
        tags: JSON.stringify(tags),
        version: body.metadata.modified.replace(/\D/g, '')
      }

      const bookExists = await Book.findOne(query)

      if (bookExists) {
        throw new HttpError(400, 'Ebook already exists')
      } else {
        const { publisher, title, author, identifier } = body.metadata
        // require at least 3 fields to be filled out
        if ([title, identifier, author, publisher].reduce((a, x) => a + (x ? 1 : 0), 0) >= 3) {
          result = await Book.create({
            ...query,
            opds: body
          }).fetch()
        } else {
          throw new HttpError(400, 'Please fill out at least 3 opds metadata fields (title, author, publisher, identifier)')
        }
      }

      sendUpdatesAsync(result)
      return res.json({
        ...result,
        tags: JSON.parse(result.tags || '[]')
      })
    } catch (e) {
      if (e instanceof HttpError) return e.send(res)
      return res.status(500).json({
        error: e.message
      })
    }
  }
}

async function sendUpdatesAsync (book) {
  const id = book.id
  const targets = await TargetUrl.find()
  if (!book) return
  for (const i in targets) {
    try {
      const item = targets[i]
      const user = await User.findOne({ id: item.user })
      const { author: fAuthor, publisher: fPublisher, title: fTitle, identifier: fIsbn, tags: fTags, url } = item
      const { author: bAuthor, publisher: bPublisher, title: bTitle, identifier: bIsbn, tags: bTags, opds } = book

      if (uriRegex.test(url)) {
        if (fAuthor && !((bAuthor || '').includes(fAuthor))) continue
        if (fPublisher && !((bPublisher || '').includes(fPublisher))) continue
        if (fTitle && !((bTitle || '').includes(fTitle))) continue
        if (fIsbn && !((bIsbn || '').includes(fIsbn))) continue

        const filterTags = JSON.parse(fTags || '[]')
        if (filterTags.length && filterTags[0].length) {
          const otherSet = new Set(filterTags)
          if (!([...new Set(JSON.parse(bTags || '[]'))].filter(x => otherSet.has(x)).length)) continue
        }
        sails.log('sending ' + book.id + ' info to ' + url)

        let content = opds
        const timestamp = Date.now()
        request.post({
          url: url,
          headers: {
            'User-Agent': 'RoE-aggregator',
            'X-RoE-Signature': hmacSign(user.signing_secret, timestamp, JSON.stringify(content)),
            'X-RoE-Request-Timestamp': timestamp
          },
          body: content,
          json: true
        }, function (err, httpResp, body) {
          if (err) {
            sails.log(`error: failed to send book ${id} to ${url}`)
          }
        })
      }
    } catch (e) {
      sails.log(`error: ${e.message}\n${e.stack}`)
    }
  }
}
