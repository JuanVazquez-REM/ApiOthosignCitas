'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CitaSchema extends Schema {
  up () {
    this.collection('citas', (collection) => {
      collection.index('fecha_index', {fecha: 1})
    })
  }

  down () {
    this.drop('citas')
  }
}

module.exports = CitaSchema
