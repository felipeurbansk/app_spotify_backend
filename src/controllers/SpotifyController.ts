import { Request, Response } from 'express'
import axios from 'axios'
import knex from '../database/connection'

class SpotifyController {
  /**
   * Get all playlist @user_id
   *
   * @param request: Request
   * @param response: Response
   *
   * @constant user_id
   * @constant access_token
   *
   * @returns json
   */
  async playlists (request: Request, response: Response) {
    const { user_id } = request.params

    if (!user_id) { return response.status(401).json({ error: 'user_id not found' }) }

    const { access_token } = await knex('users').select('access_token').where('id', user_id).first()

    if (!access_token) { return response.status(403).json({ error: `User[${user_id}] not exists` }) }

    await axios.get(`${process.env.SPOTIFY_API_URL}/me/playlists`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    }).then((success) => response.json({ sucess: 'List playlist success', playlists: success.data })).catch((error) => response.json(error.message))
  }

  /**
   * Get info player state
   *
   * @param request: Request
   * @param response: Response
   *
   * @constant user_id
   * @constant access_token
   *
   * @returns json
   */
  async player (request: Request, response: Response) {
    const { user_id } = request.params

    if (!user_id) { return response.status(401).json({ error: 'user_id not found' }) }

    const { access_token } = await knex('users').select('access_token').where('id', user_id).first()

    await axios.get(`${process.env.SPOTIFY_API_URL}/me/player`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    }).then((success) => response.json(success.data)).catch((error) => response.json(error))
  }

  /**
   * Get all info track by @track_id
   *
   * @param request: Request
   * @param response: Response
   *
   * @constant user_id
   * @constant track_id
   * @constant access_token
   *
   * @returns json
   */
  async tracks (request: Request, response: Response) {
    const { user_id, track_id } = request.params

    if (!user_id) { return response.status(401).json({ error: 'user_id not found' }) }

    const { access_token } = await knex('users').select('access_token').where('id', user_id).first()

    await axios.get(`${process.env.SPOTIFY_API_URL}/tracks`, {
      params: {
        ids: track_id
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    }).then((success) => response.json(success.data)).catch((error) => response.json(error))
  }
}

export default SpotifyController
