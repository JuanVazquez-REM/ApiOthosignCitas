'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClienteSchema extends Schema {
  up () {
    this.collection('clientes', (collection) => {
      collection.index('nombre_index', {nombre: 1})
      collection.index('telefono_unique',{telefono: 1},{unique: true})
    })
  }

  down () {
    this.drop('clientes')
  }
}

module.exports = ClienteSchema
