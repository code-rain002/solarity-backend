import axios from "axios";
import SystemModel from "../modules/System/model";

export const getTwitterBearerCodeForSystem = async () => {
  try {
    const data = await SystemModel.findOne({ code: "twitter" });
    if (!data || !data.data || !data.data.bearerToken) {
      const token = `${process.env.TWITTER_API_KEY}:${process.env.TWITTER_API_KEY_SECRET}`;
      const encodedToken = Buffer.from(token).toString("base64");
      const config = {
        method: "post",
        url: "https://api.twitter.com/oauth2/token?grant_type=client_credentials",
        headers: { Authorization: "Basic " + encodedToken },
      };
      const {
        data: { access_token },
      } = await axios(config);
      await SystemModel.updateOne(
        { code: "twitter" },
        {
          ...data._doc,
          data: { bearerToken: access_token },
        },
        {
          upsert: true,
        }
      );
      return access_token;
    }
    return data.data.bearerToken;
  } catch (err) {
    // LOG ERROR TO ROLLBAR!!!!
    console.log("ERROR fetch bearer token from twitter");
  }
};

export const getTwitterAccessToken = async (code, redirect_uri) => {
  console.log(code);
  console.log(redirect_uri);
  let data = {
    client_id: process.env.TWITTER_CLIENT_ID,
    grant_type: "authorization_code",
    code,
    code_verifier: "challenge",
    redirect_uri,
  };
  const params = new URLSearchParams(data);
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const response = await axios.post(
    "ttps://api.twitter.com/2/oauth2/token'",
    params,
    {
      headers,
    }
  );
  console.log(response);
  return response;
};
