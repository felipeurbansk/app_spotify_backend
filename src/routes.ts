import express from 'express'

// Controllers
import AuthSpotifyController from './controllers/AuthSpotifyController'
import UserController from './controllers/UserController'
import SpotifyController from './controllers/SpotifyController'

const authSpotifyController = new AuthSpotifyController()
const userController = new UserController()
const spotifyController = new SpotifyController()

// Define router
const route = express.Router()

// Routes
route.get('/', authSpotifyController.index)
route.get('/callback', authSpotifyController.callback)
route.get('/refresh_token', authSpotifyController.refresh_token)
route.get('/user/:user_id', userController.index)
route.get('/playlists/:user_id', spotifyController.playlists)
route.get('/player/:user_id', spotifyController.player)
route.get('/tracks/:user_id/:track_id', spotifyController.tracks)

export default route
