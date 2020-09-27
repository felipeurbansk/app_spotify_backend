import { Request, Response } from 'express';
import axios from 'axios';
import knex from '../database/connection';

class SpotifyController {
  async playlists(request: Request, response: Response) {
    const { user_id } = request.params;

    if (!user_id) { return response.status(401).json({ error: 'user_id not found' }); }

    const user = await knex('users').select('*').where('id', user_id).first();

    if (!user) { return response.status(403).json({ error: `User[${user_id}] not found` }); }

    await axios.get(`${process.env.SPOTIFY_API_URL}/me/playlists`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.access_token}`,
      },
    }).then((success) => response.json({ sucess: 'List playlist success', playlists: success.data })).catch((error) => response.json(error.message));
  }

  async player(request: Request, response: Response) {
    const { user_id } = request.params;

    if (!user_id) { return response.status(401).json({ error: 'user_id not found' }); }

    const { access_token } = await knex('users').select('access_token').where('id', user_id).first();

    await axios.get(`${process.env.SPOTIFY_API_URL}/me/player`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }).then((success) => response.json(success.data)).catch((error) => response.json(error));
  }

  async tracks(request: Request, response: Response) {
    const { user_id, track_id } = request.params;

    if (!user_id) { return response.status(401).json({ error: 'user_id not found' }); }

    const { access_token } = await knex('users').select('access_token').where('id', user_id).first();

    await axios.get(`${process.env.SPOTIFY_API_URL}/tracks`, {
      params: {
        ids: track_id,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }).then((success) => response.json(success.data)).catch((error) => response.json(error));
  }
}

export default SpotifyController;
