'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hola orthosign' }
})

//Registro del cliente y el cliente
Route.post('/register','ClienteController.registro')//

//Registro del admin y el cliente
Route.post('/register/admin','AdminController.registro')//

//login de admin y el cliente
Route.post('/login','AuthController.login')//

//Check Token
Route.get('/check','AuthController.check')//

//Resetear contraseña
Route.get('/forgot/password','AuthController.showforgotpassword')

//Crear una cita 
Route.post('/appointment','CitaController.nuevacita') //

//Aceptar cita #
Route.post('/modify/status/appointment','CitaController.modificarestadocita') //

//Clientes
Route.get('/customers','ClienteController.mostrarclientes')


//Admins
Route.get('/admins','AdminController.mostraradmins')


//Eliminar Cliente
Route.post('/delete/client','ClienteController.eliminarcliente') //

//Eliminar Amdin
Route.post('/delete/admin','AdminController.eliminaradmin') //


//Actualizar Admin
Route.post('/update/admin','AdminController.actualizaradmin') //

//Actualizar Cliente
Route.post('/update/client','ClienteController.actualizarcliente') //



//Citas

//Ver mis citas por estado
Route.post('/show/quotes','CitaController.vermiscitas') //

//Eliminar Cita 
Route.post('/delete/appointment','CitaController.eliminarcita') //

//Agregar comentarios a la cita 
Route.post('/add/comments/quotes','CitaController.agregarcomentarioscita')

//Eliminar paciente,cita,admin