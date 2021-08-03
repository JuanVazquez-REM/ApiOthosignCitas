'use strict'

const Cita = use('App/Models/Cita')
const {validate} = use('Validator') 

class CitaController {

    async nuevacita({request, response}){ 
        const id = await this.id(Cita,"cita_id")
        
        const rules = {
            cliente_id: 'required|integer',
            año: 'required|integer',
            mes: 'required|string',
            dia: 'required|integer',
            hora: 'required|string',
            motivo: 'required|string',
        }

        const validation = await validate(request.all(), rules)
        
        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {cliente_id,año,mes,dia,motivo,hora,comentarios} = request.only(['cliente_id','año','mes','dia','motivo','hora','comentarios'])
            var intervalo = 0
            try {
                switch (motivo) {
                    case "Limpieza":
                        // 1 hora}
                        intervalo = 1
                        break;

                    case "Diagnostico":
                        // 1 hora
                        intervalo = 1
                        break;

                    case "Blanqueamiento":
                        // 1 hora
                        intervalo = 1
                        break;

                    case "Resinas":
                        // 1 hora
                        intervalo = 1
                        break;

                    case "Seguimiento Ortodoncia":
                        // 1 hora
                        intervalo = 1
                        break;
                    
                    case "Extraccion":
                        // 2 hora
                        intervalo = 2
                        break;
                    
                    case "Puentes":
                        // 1.30 hora
                        intervalo = 1.3
                        break;

                    default:
                        intervalo = 1 
                        break;
                }

                const cita = await Cita.create({
                    'cita_id': id,
                    'cliente_id': cliente_id,
                    'año': año,
                    'mes': mes,
                    'dia': dia,
                    'hora': hora,
                    'motivo':motivo,
                    'intervalo': intervalo,
                    'comentarios':comentarios,
                    'estado': "PENDIENTE", //Pendiente, PendientePorCancelar, Cancelado, Aceptado, En proceso, Con Comentarios
                })

                return response.status(201).json(cita)
            } catch (error) {
                return response.status(400).json(error)
            }
        }
    }

    async disponibilidad({request, response}){

        const validation = await validate(request.all(), rules)

        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {

        } 
    }

    async modificarestadocita({request, response}){

        const rules = {
            cita_id: 'required|integer',
            estado: 'required|string'
        }

        const validation = await validate(request.all(), rules)

        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {cita_id,estado} = request.only(['cita_id','estado'])

            
                const cita = await Cita.where('cita_id',cita_id).first()
                cita.estado = estado
                await cita.save()

                return response.status(200).json(cita)
            
        } 
    }


    async vermiscitas({request, response}){

        const rules = {
            cliente_id: 'required|integer',
            estado: 'required|string'
        }

        const validation = await validate(request.all(), rules)

        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {cliente_id,estado} = request.only(['cliente_id','estado'])

            
                if(estado == "TODAS"){
                    const citas = await Cita.where('cliente_id',cliente_id).fetch()
                    return response.status(200).json(citas)
                }else{
                    const citas = await Cita.where('cliente_id',cliente_id).where('estado',estado).fetch()
                    return response.status(200).json(citas)
                }
                
                
            
        } 
    }

    async eliminarcita({request, response}){

        const rules = {
            cita_id: 'required|integer',
        }

        const validation = await validate(request.all(), rules)

        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {cita_id} = request.only(['cita_id'])

            const cita = await Cita.where('cita_id',cita_id).first()
            await cita.delete()
            
            return response.status(200).json("Cita eliminada correctamente")
        } 
    }

    async agregarcomentarioscita({request, response}){

        const rules = {
            cita_id: 'required|integer',
            comentarios: 'required|string'
        }

        const validation = await validate(request.all(), rules)

        if(validation.fails()){
            return response.status(400).json(validation.messages())
        } else {
            const {cita_id,comentarios} = request.only(['cita_id','comentarios'])

            try {
                const cita = await Cita.Where('cita_id',cita_id).first()
                cita.comentarios = comentarios
                cita.estado = "Con Comentarios"
                await cita.save()
                
                return response.status(200).json(cita)
            } catch (error) {
                return response.status(400).json(error)
            }
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

module.exports = CitaController
