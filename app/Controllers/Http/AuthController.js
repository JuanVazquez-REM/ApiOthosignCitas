'use strict'

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

                    return response.status(200).json({
                        token: token,
                        user: user
                    })
                }else{
                    return response.status(400).json({message: "ta mal"})
                }
                
                
            } catch (error) {
                return response.status(400).json({
                    message: error
                })
            }
        
        }
    }

}

module.exports = AuthController
