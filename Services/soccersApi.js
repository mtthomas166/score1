const axios = require("axios");

module.exports = axios.create({
  baseURL: "https://api.soccersapi.com/v2.2/",
  params: {
    user: process.env.SOCCERSAPI_USER,
    token: process.env.SOCCERSAPI_TOKEN,
    t: "list",
  },
});
