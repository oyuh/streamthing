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
    })
  );
  return res.data;
}

export async function getAppAccessToken(): Promise<string> {
    const res = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID!,
        client_secret: process.env.TWITCH_CLIENT_SECRET!,
        grant_type: 'client_credentials',
      },
    });

    return res.data.access_token;
  }

  export async function subscribeToFollows(userId: string, userToken: string) {
    return await axios.post(
      'https://api.twitch.tv/helix/eventsub/subscriptions',
      {
        type: 'channel.follow',
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
          Authorization: `Bearer ${userToken}`, // ✅ not app token anymore
          'Content-Type': 'application/json',
        },
      }
    );
  }
