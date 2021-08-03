'use strict'


const Admin = use('App/Models/Admin')
const Cliente = use('App/Models/Cliente')
const User = use('App/Models/User')
const {validate} = use('Validator') 
class AuthController {

    async login({request, response, auth}){

        const rules = {
            email: 'required|string',
            password: 'required|string',
        }

        const validation = await validate(request.all(), rules)
        

        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            try {
                const {email, password} = request.only(['email','password'])
                const token = await auth.attempt(email,password)

                if(token){
                    const user = await User.where('email',email).first()

                    const admin = await Admin.where('user_id',user.user_id).first()
                    if(admin){
                        return response.status(200).json({
                            token: token,
                            user: user,
                            admin: admin
                        })

                    }else{
                        const cliente = await Cliente.where('user_id',user.user_id).first()

                        return response.status(200).json({
                            token: token,
                            user: user,
                            cliente: cliente
                        })
                    }
                }else{
                    return response.status(505).json("No se pudo generar el token")
                }

            } catch (error) {
                return response.status(400).json({
                    error: error,
                    message: "Email o contraseña incorrecta"
                })
            }
        
        }
    }

    async check({response,auth}){
        try {
            await auth.check()

            return response.status(200).json({
                status: true,
                message: "Token valido",
                user: auth.user
            })
            
        } catch (error) {
            return response.status(200).json({
                status: false,
                message: "Token Invalido"
            })
        }
    }



}

module.exports = AuthController
