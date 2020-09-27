import {Request, Response} from 'express'
import axios from 'axios'
import querystring from 'querystring'

class AuthSpotifyController {

    async index (request: Request, response: Response) {
        const {client_id, client_secret} = request.headers;

        const scope = "user-read-private user-read-email"

        console.log('Call: Index function AuthSpotifyController')

        return await response.redirect(process.env.SPOTIFY_API_AUTH_URL + 'authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: process.env.CLIENT_ID,
                scope: scope,
                redirect_uri: process.env.REDIRECT_URL
            })    
        )
    }

    async callback (request: Request, response: Response) {
        const code = request.query.code || ''
        const state = request.query.state || ''

        console.log('Call: Callback function AuthSpotifyController')

        console.log(state)

        return await axios.post('https://accounts.spotify.com/api/token',null, 
        {
            params: {
                grant_type : "authorization_code",
                code : code.toString(),
                redirect_uri : process.env.REDIRECT_URL
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
            }
        }).then(success => {
            const {access_token, refresh_token} = success.data

            console.log({access_token, refresh_token})

            axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(success => {
                return response.json({success: "Dados do usuário", data: success.data})
            }).catch(error => {
                return response.status(500).json({error: "Dados do usuário", data: error})
            })

        }).catch(error => {
            return response.status(500).json({error: "Dados do usuário", data: error})
        })

    }

    async refresh_token(request: Request, response: Response) {
        const {refresh_token} = request.query
        
        console.log('Call: Refresh Token function AuthSpotifyController')

        return await axios.post('https://accounts.spotify.com/api/token', {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
            },
            data: {
                refresh_token,
                grant_type: 'refresh_token',
            }
        }).then(success => {
            response.json({access_token: success.data.access_token})
        }).catch(error => {
            return response.status(500).json({error: "Refresh token", data: error})
        })
    }

}

export default AuthSpotifyController;