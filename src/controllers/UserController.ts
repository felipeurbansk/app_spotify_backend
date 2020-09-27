import {Request, Response} from 'express'
import querystring from 'querystring'
import knex from '../database/connection'

class UserController {

    async index(request: Request, response: Response){
        const user = knex('users').where('id', request.params.user_id).first();

        return response.json(user);
    }

}

export default UserController;