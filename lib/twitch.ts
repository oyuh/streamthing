import axios from 'axios';

export async function getTwitchAccessToken(code: string) {
  const res = await axios.post(
    'https://id.twitch.tv/oauth2/token',
    new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TWITCH_REDIRECT_URI!,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return res.data; // includes access_token, refresh_token, expires_in
}

export async function getTwitchUser(accessToken: string) {
  const res = await axios.get('https://api.twitch.tv/helix/users', {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data.data[0]; // returns { id, login, display_name, ... }
}

export async function subscribeToStreamOnline(userId: string, userToken: string) {
    try {
      const response = await axios.post(
        'https://api.twitch.tv/helix/eventsub/subscriptions',
        {
          type: 'stream.online',
          version: '1',
          condition: {
            broadcaster_user_id: userId,
          },
          transport: {
            method: 'webhook',
            callback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/twitch/webhook`,
            secret: process.env.TWITCH_SECRET!,
          },
        },
        {
          headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID!,
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("✅ Twitch stream.online subscription successful:", response.data);
      return response.data;
    } catch (err: any) {
      console.error("❌ Twitch subscription error:", err.response?.data || err.message);
      throw err;
    }
  }
