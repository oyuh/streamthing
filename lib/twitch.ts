
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

  return res.data;
}

export async function getTwitchUser(accessToken: string) {
  const res = await axios.get('https://api.twitch.tv/helix/users', {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data.data[0];
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

export async function subscribeToTwitchEvents(user: any, userAccessToken: string) {
  const appToken = await getAppAccessToken();

  try {
    await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
      type: 'stream.online',
      version: '1',
      condition: {
        broadcaster_user_id: user.id,
      },
      transport: {
        method: 'webhook',
        callback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/twitch/webhook`,
        secret: process.env.TWITCH_SECRET!,
      },
    }, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${appToken}`,
        'Content-Type': 'application/json',
      }
    });

    console.log("✅ Subscribed to stream.online");
  } catch (err: any) {
    console.error("❌ stream.online failed:", err.response?.data || err.message);
  }

  const isAffiliate = user.broadcaster_type === 'affiliate';

  if (isAffiliate) {
    try {
      await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
        type: 'channel.follow',
        version: '1',
        condition: {
          broadcaster_user_id: user.id,
        },
        transport: {
          method: 'webhook',
          callback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/twitch/webhook`,
          secret: process.env.TWITCH_SECRET!,
        },
      }, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID!,
          Authorization: `Bearer ${userAccessToken}`,
          'Content-Type': 'application/json',
        }
      });

      console.log("✅ Subscribed to channel.follow");
    } catch (err: any) {
      console.error("❌ channel.follow failed:", err.response?.data || err.message);
    }
  } else {
    console.log("🔒 Skipping channel.follow — user is not Affiliate yet");
  }
}
