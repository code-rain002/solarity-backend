import axios from "axios";

export const getDiscordUser = async (accessToken) => {
  const { data } = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const revokeDiscord = async (token) => {
  let data = {
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    token,
  };
  const params = new URLSearchParams(data);
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const { data: response } = await axios.post(
    "https://discord.com/api/oauth2/token/revoke",
    params,
    {
      headers,
    }
  );
  return response;
};

export const refreshDiscordToken = async (refreshToken) => {
  let data = {
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };
  const params = new URLSearchParams(data);
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const { data: response } = await axios.post(
    "https://discord.com/api/oauth2/token",
    params,
    {
      headers,
    }
  );
  return response;
};
