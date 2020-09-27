import express from 'express'

import AuthSpotifyController from './controllers/AuthSpotifyController'
import UserController from './controllers/UserController'
 
const route = express.Router();

const authSpotifyController = new AuthSpotifyController()
const userController = new UserController()

route.get('/', authSpotifyController.index)
route.get('/callback', authSpotifyController.callback)
route.get('/refresh_token', authSpotifyController.refresh_token)
route.get('/user/:user_id', userController.index)


export default route