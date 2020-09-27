import {Request, Response} from 'express'
import axios from 'axios'
import querystring from 'querystring'
import knex from '../database/connection'

class AuthSpotifyController {

    async index (request: Request, response: Response) {
        const {client_id, client_secret} = request.headers;

        const scope = "user-read-private user-read-email"

        console.log('Call: Index function AuthSpotifyController')

        return response.redirect(process.env.SPOTIFY_ACCOUNTS_URL + '/authorize?' +
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

        return await axios.post(process.env.SPOTIFY_ACCOUNTS_URL + '/api/token',null, 
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
            const {access_token} = success.data

            axios.get(process.env.SPOTIFY_API_URL + '/me', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(async success => {
                
                const {
                    country,
                    display_name,
                    email,
                    external_urls,
                    followers,
                    href,
                    id,
                    images,
                    product,
                    type,
                    uri
                } = success.data

                await knex.transaction(async (trx) => {
                    const [user_id] = await trx('users').insert({
                        display_name,
                        access_token,
                        email,
                        country,
                        spotify_id: id,
                        url_perfil: external_urls.spotify,
                        uri_perfil: uri,
                        api_perfil: href,
                        image: images[0].url,
                        product,
                        type,
                    })

                    const query = querystring.stringify({
                        user_id
                    });

                    return response.redirect('/user/?' + query);
                })

                return response.json({success: "Usuário cadastrado com sucesso."})

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

        return await axios.post(process.env.SPOTIFY_ACCOUNTS_URL + '/api/token', {
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