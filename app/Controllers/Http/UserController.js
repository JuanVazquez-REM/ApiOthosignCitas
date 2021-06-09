'use strict'
const User = use('App/Models/User')
const {validate} = use('Validator') 

class UserController {

    async registro({request, response}){
        const data = await User.count()
        const id = data + 1
        
        const rules = {
            nombre: 'required|string',
            apellido: 'required|string',
            edad: 'required|integer',
            genero: 'required|string',
            telefono: 'required|string',
            password: 'required|string',
        }

        const validation = await validate(request.all(), rules)
        
        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {nombre,apellido,edad,genero,telefono,password,email} = request.only(['nombre','apellido','edad','genero','telefono','password','email'])

            try {
                const user = await User.create({
                    'use_id': id,
                    'nombre': nombre,
                    'apellido':apellido,
                    'edad': edad,
                    'genero': genero,
                    'telefono': telefono,
                    'password':password,
                    'email': email
                })

                return response.status(201).json(user)
            } catch (error) {
                return response.status(400).json(error)
            }
        }
    }
}

module.exports = UserController
