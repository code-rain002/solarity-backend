import axios from "axios";
import UserModel from "../modules/User/model";
import fetch from "node-fetch";

export const getGithubAccessToken = async (userId, code, redirect_uri) => {
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    // grant_type: "authorization_code",
    code,
    // scope: "repo repo:status repo_deployment public_repo repo:invite security_events",
    redirect_uri,
  };
  const options = { headers: { Accept: "application/vnd.github+json" } };
  
  let data;
  await axios.post("https://github.com/login/oauth/access_token", params, options)
    .then(response => data = response.data)
    .catch(error => console.log(error));
  
  const { access_token: accessToken } = data;

  await UserModel.updateOne(
    { _id: userId },
    {
      "externalLinks.github.accessToken": accessToken,
    }
  );
  return accessToken;
};

export const getGithubUser = async (accessToken) => {
  const { data } = await axios.get("https://api.github.com/user", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const revokeGithub = async (accessToken) => {
  let data = {
    // client_id: process.env.GITHUB_CLIENT_ID,
    // client_secret: process.env.GITHUB_CLIENT_SECRET,
    access_token: accessToken,
  };
  console.log('data ', data)
  // const params = new URLSearchParams(data);
  let headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `token ${accessToken}`
  };
  const { data: response } = await axios.delete(
    `https://github.com/applications/${process.env.GITHUB_CLIENT_ID}/token`,
    data,
    {
      headers,
    }
  );
  console.log('response: ', response.data)
  return response;
};

export const refreshGithubToken = async (refreshToken, userId) => {
  let data = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
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
  await UserModel.updateOne(
    { _id: userId },
    { "externalLinks.github.refreshToken": response }
  );
  return response;
};
