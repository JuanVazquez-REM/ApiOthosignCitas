'use strict'

const User = use('App/Models/User')
const Admin = use('App/Models/Admin')
const {validate} = use('Validator') 

class AdminController {

    async registro({request, response}){
    
        const rules = {
            nombre: 'required|string',
            apellido: 'required|string',
            telefono: 'required|string',
            email: 'required|string',
            password: 'required|string',
        }

        const validation = await validate(request.all(), rules)
        
        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {nombre,apellido,telefono,password,email} = request.only(['nombre','apellido','telefono','password','email'])
            const userid = await this.id(User,"user_id")
            
            try {
                
                const user = await User.create({
                    'user_id': userid,
                    'email': email,
                    'password':password
                })

                if(user){
                    const adminid = await this.id(Admin,"admin_id")
                    
                    const admin = await Admin.create({
                        'admin_id': adminid,
                        'nombre': nombre,
                        'apellido':apellido,
                        'telefono': telefono,
                        'user_id': userid
                    })

                    if(admin){
                        return response.status(201).json({
                            Admin: admin,
                            User: user
                        })
                    }else{
                        const user = await User.find(userid)
                        await user.delete()
                        return response.status(400).json("Error al registrar el admin")
                    }
                }else{
                    return response.status(400).json("Error al registrar el usuario")
                }
            } catch (error) {
                await User.where('user_id',userid).delete()
                await User.where('admin_id',adminid).delete()
                
                return response.status(400).json(error)
            }
        }
    }

    async eliminaradmin({request, response}){

        const rules = {
            admin_id: 'required|integer',
        }

        const validation = await validate(request.all(), rules)

        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {admin_id} = request.only(['admin_id'])

            const admin = await Admin.where('admin_id',admin_id).first()
            await admin.delete()
            
            return response.status(200).json("Admin eliminado correctamente")
        } 
    }

    async actualizaradmin({request, response}){

        const rules = {
            admin_id: 'required|integer',
        }

        const validation = await validate(request.all(), rules)

        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {admin_id,nombre,apellido,edad,telefono,email} = request.only(['admin_id','nombre','apellido','edad','telefono','email'])

            const admin = await Admin.where('admin_id',admin_id).first()
            admin.nombre = nombre
            admin.apellido = apellido
            admin.telefono = telefono
            admin.email = email
            await admin.save()
            
            return response.status(200).json("Admin actualizado correctamente")
        } 
    }

    async mostraradmins({response}){
        try {
            const admins = await Admin.all()

            return response.status(200).json(admins)
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

module.exports = AdminController
