const express = require("express");
const axios = require(`axios`);
const config = require(`./config.json`);

const app = express();

app.use(express.json());

app.get("/test", (req, res) => res.send("Test"));

app.get("/redirect", handleRedirect);

app.use(express.static("public"));

app.listen(3000, () => console.log("ready"));

async function handleRedirect(req, res) {
  const code = req.query.code;

  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = config;

  const response = await axios({
    method: "post",
    url: ` https://discord.com/api/v8/oauth2/token`,
    data: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}&scope=identify`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const userDataResponse = await axios({
    method: "get",
    url: `https://discord.com/api/v8/users/@me`,
    headers: {
      Authorization: `Bearer ${response.data.access_token}`,
    },
  });
  res.send(userDataResponse.data.username);
}
