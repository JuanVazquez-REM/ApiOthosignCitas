'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokensSchema extends Schema {
  up () {
    this.collection('tokens', (collection) => {
    })
  }

  down () {
    this.drop('tokens')
  }
}

module.exports = TokensSchema
