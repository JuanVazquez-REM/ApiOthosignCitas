'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdminSchema extends Schema {
  up () {
    this.collection('admins', (collection) => {
      collection.index('nombre_index', {nombre: 1})
      collection.index('telefono_index_unique',{telefono: 1},{unique: true})
    })
  }

  down () {
    this.drop('admins')
  }
}

module.exports = AdminSchema
