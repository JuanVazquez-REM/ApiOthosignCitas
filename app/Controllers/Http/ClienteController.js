'use strict'

const Cliente = use('App/Models/Cliente')
const User = use('App/Models/User')
const {validate} = use('Validator') 

class ClienteController {

    async registro({request, response}){
        
        const rules = {
            nombre: 'required|string',
            apellido: 'required|string',
            edad: 'required|integer',
            genero: 'required|string',
            telefono: 'required|string',
            password: 'required|string',
            email:'required|string',
        }

        const validation = await validate(request.all(), rules)
        
        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {nombre,apellido,edad,genero,telefono,password,email} = request.only(['nombre','apellido','edad','genero','telefono','password','email'])

            try {
                const user_id =await this.id(User,"user_id")

                const user = await User.create({
                    'user_id':user_id,
                    'email': email,
                    'password':password
                })

                if(user){
                    
                    const cliente_id = await this.id(Cliente,"cliente_id")

                    const cliente = await Cliente.create({
                        'cliente_id':cliente_id,
                        'nombre':nombre,
                        'apellido': apellido,
                        'edad': edad,
                        'genero': genero,
                        'telefono': telefono,
                        'user_id':user_id
                    })

                    if(cliente){
                        return response.status(201).json({
                            cliente: cliente,
                            user: user,
                        })
                    }else{
                        const user = await User.find(user_id)
                        await user.delete()
                        return response.status(400).json("Error al registrar el admin")
                    }
                }else{
                    return response.status(400).json("Error al crear el usuario")
                }

            } catch (error) {
                await User.where('user_id',user_id).delete()
                await User.where('admin_id',admin_id).delete()

                return response.status(400).json(error)
            }
        }
    }

    async eliminarcliente({request, response}){

        const rules = {
            cliente_id: 'required|integer',
        }

        const validation = await validate(request.all(), rules)

        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {cliente_id} = request.only(['cliente_id'])

            const cliente = await Cliente.where('cliente_id',cliente_id).first()
            await cliente.delete()
            
            return response.status(200).json("Cliente eliminado correctamente")
        } 
    }

    async actualizarcliente({request, response}){

        const rules = {
            cliente_id: 'required|integer',
        }

        const validation = await validate(request.all(), rules)

        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {cliente_id,nombre,apellido,edad,telefono,email} = request.only(['cliente_id','nombre','apellido','edad','telefono','email'])

            const cliente = await Cliente.where('cliente_id',cliente_id).first()
            cliente.nombre = nombre
            cliente.apellido = apellido
            cliente.edad = edad
            cliente.telefono = telefono
            cliente.email = email
            await cliente.save()
            
            return response.status(200).json("Cliente actualizado correctamente")
        } 
    }

    async mostrarclientes({response}){
        try {
            const users = await Cliente.all()

            return response.status(200).json(users)
        } catch (error) {
            return response.status(400).json(error)
        }
    }

    async id(modelo, campo){
        const data = await modelo.all()
        var idmayor = 0
        for (let i = 0; i < data.rows.length; i++) {
            const id = data.rows[i][campo];
            if(id > idmayor){
                idmayor = id
            }
        }
        return idmayor + 1 
    }
}

module.exports = ClienteController
