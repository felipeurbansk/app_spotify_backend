import express from 'express'

import AuthSpotifyController from './controllers/AuthSpotifyController'
 
const route = express.Router();

const authSpotifyController = new AuthSpotifyController()

route.get('/', authSpotifyController.index)
route.get('/callback', authSpotifyController.callback)
route.get('/refresh_token', authSpotifyController.refresh_token)

export default route