const dotenv = require('dotenv');
dotenv.config();

// module.exports = {
//   mongodbURI: process.env.MOGODB_URI,
//   serverPort: process.env.SERVER_PORT,
//   saltRound: 10,
//   jwtKey: "secretToken",
// }

const IP = process.env.IP//'localhost'
const PORT = process.env.PORT//'b0eb064f57d5.ngrok.io'
const MONGO_URI = process.env.MONGO_URI
const NODE_ENV = process.env.NODE_ENV

/* eslint-disable prefer-destructuring */

/** @type {string} */
const FB_APP_ID = process.env.FB_APP_ID
/** @type {string} */
const FB_CLIENT_SECRET = process.env.FB_CLIENT_SECRET



/** @type {string} */
// @ts-nocheck
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID
/** @type {string} */
// @ts-nocheck
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET
const NAVER_REDIRECT_URI = `http://${IP}:${PORT}/api/auth/naver/callback`



/** @type {string} */
// @ts-nocheck
const KAKAO_REST_KEY = process.env.KAKAO_REST_KEY
/** @type {string} */
// @ts-nocheck
const KAKAO_SECRET = process.env.KAKAO_SECRET
const KAKAO_REDIRECT_URI = `http://${IP}:${PORT}/api/auth/kakao/callback`

const APP_CONFIG_JSON = JSON.stringify({
  IP,
  PORT,
  FB_APP_ID,
  FB_CLIENT_SECRET,
  NAVER_CLIENT_ID,
  NAVER_REDIRECT_URI,
  NAVER_REDIRECT_URI,
  KAKAO_REST_KEY,
  KAKAO_SECRET,
  KAKAO_REDIRECT_URI,
  MONGO_URI,
  NODE_ENV
}).replace(/"/g, '\\"')

module.exports = {
  IP,
  PORT,
  FB_APP_ID,
  FB_CLIENT_SECRET,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_REDIRECT_URI,
  KAKAO_REST_KEY,
  KAKAO_SECRET,
  KAKAO_REDIRECT_URI,
  MONGO_URI,
  NODE_ENV,
  APP_CONFIG_JSON
}