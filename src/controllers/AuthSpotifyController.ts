import { Request, Response } from 'express'
import axios from 'axios'
import querystring from 'querystring'
import knex from '../database/connection'

class AuthSpotifyController {
  /**
   * Get authorization spotify account user
   *
   * @param request: Request
   * @param response: Response
   *
   * @constant scope
   *
   * @returns redirect
   */
  async index (request: Request, response: Response) {
    const scope = 'user-read-private user-read-email playlist-read-private user-read-playback-state'

    console.log('Call: Index function AuthSpotifyController')

    return response.redirect(`${process.env.SPOTIFY_ACCOUNTS_URL}/authorize?${
      querystring.stringify({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URL,
        response_type: 'code',
        scope
      })}`)
  }

  /**
   * Callback  @user_id
   *
   * @param request: Request
   * @param response: Response
   *
   * @constant code
   *
   * @returns redirect
   */
  async callback (request: Request, response: Response) {
    const { code } = request.query

    console.log('Call: Callback function AuthSpotifyController')

    axios.post(`${process.env.SPOTIFY_ACCOUNTS_URL}/api/token`, null,
      {
        params: {
          redirect_uri: process.env.REDIRECT_URL,
          code: code.toString(),
          grant_type: 'authorization_code'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
        }
      }).then((success) => {
      const { access_token } = success.data

      axios.get(`${process.env.SPOTIFY_API_URL}/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      }).then(async (success) => {
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
            type
          })

          return response.redirect(`/user/${user_id}`)
        })
      }).catch((error) => response.status(500).json({ error: 'Dados do usuário', data: error }))
    }).catch((error) => response.status(500).json({ error: 'Dados do usuário', data: error }))
  }

  /**
   * Refresh token
   *
   * @param request: Request
   * @param response: Response
   *
   * @constant refresh_token
   *
   * @returns redirect
   */
  async refresh_token (request: Request, response: Response) {
    const { refresh_token } = request.query

    console.log('Call: Refresh Token function AuthSpotifyController')

    return await axios.post(`${process.env.SPOTIFY_ACCOUNTS_URL}/api/token`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
      },
      data: {
        refresh_token,
        grant_type: 'refresh_token'
      }
    }).then((success) => {
      response.json({ access_token: success.data.access_token })
    }).catch((error) => response.status(500).json({ error: 'Refresh token', data: error }))
  }
}

export default AuthSpotifyController
