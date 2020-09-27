import {Request, Response} from 'express'
import knex from '../database/connection'

class UserController {

    async index(request: Request, response: Response){

        const {user_id} = request.params;

        if(!user_id)
            return response.status(401).json({error: "user_id not found"})

        const user = await knex('users').select('*').where('id', user_id).first();

        return response.json(user);
    }

}

export default UserController;