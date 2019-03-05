const xmldom = require('xmldom')
const { XML } = require('r2-utils-js/dist/es8-es2017/src/_utils/xml-js-mapper')
const { JSON: TAJSON } = require('ta-json-x')

const { initGlobalConverters_GENERIC: initGlobalConvertersGENERIC, initGlobalConverters_OPDS: initGlobalConvertersOPDS } = require('r2-opds-js/dist/es8-es2017/src/opds/init-globals')
// opds 1
const { OPDS } = require('r2-opds-js/dist/es8-es2017/src/opds/opds1/opds')
const { Entry } = require('r2-opds-js/dist/es8-es2017/src/opds/opds1/opds-entry')
// opds 2
// const { OPDSFeed } = require('r2-opds-js/dist/es6-es2015/src/opds/opds2/opds2')
const { OPDSPublication } = require('r2-opds-js/dist/es8-es2017/src/opds/opds2/opds2-publication')
const { convertOpds1ToOpds2, convertOpds1ToOpds2_EntryToPublication: convertOpds1ToOpds2EntryToPublication } = require('r2-opds-js/dist/es8-es2017/src/opds/converter')

initGlobalConvertersGENERIC()
initGlobalConvertersOPDS()

module.exports = {
  friendlyName: 'Load OpdsHelper',
  description: 'Load a OpdsHelper instance',
  inputs: {},
  exits: {
    success: {
      outputFriendlyName: 'Opds helper',
      outputDescription: 'A OpdsHelper instance'
    }
  },
  fn: async function (inputs, exits) {
    return exits.success(new OpdsHelper())
  }
}

function OpdsHelper () {
  this.deserializeOpds1 = function (xml) {
    const xmlDom = new xmldom.DOMParser().parseFromString(xml)
    if (!xmlDom || !xmlDom.documentElement) return false
    const isEntry = xmlDom.documentElement.localName === 'entry'
    if (isEntry) {
      return XML.deserialize(xmlDom, Entry)
    } else {
      return XML.deserialize(xmlDom, OPDS)
    }
  }
  this.deserializeOpds2 = function (data) {
    return TAJSON.deserialize(data, OPDSPublication)
  }
  this.serializeJSON = function (json) {
    return TAJSON.serialize(json)
  }
  this.xml2json = function (xml) {
    const deserialized = this.deserializeOpds1(xml)
    if (deserialized.type === 'entry') {
      return convertOpds1ToOpds2EntryToPublication(deserialized.data)
    } else {
      return convertOpds1ToOpds2(deserialized.data)
    }
  }
  this.book2opds = async function (book) {
    return new Promise((resolve, reject) => {
      const metadata = {
        '@type': 'http://schema.org/Book',
        modified: new Date(book.updated_at).toISOString()
      }
      if (book.title) metadata.title = book.title
      if (book.author) metadata.author = book.author
      if (book.isbn) metadata.identifier = `urn:isbn:${book.isbn}`
      resolve({
        metadata,
        'links': [
          {
            'rel': 'self',
            'href': 'single/' + book.id,
            'type': 'application/opds+json'
          }
        ],
        'images': []
      })
    })
  }
}
