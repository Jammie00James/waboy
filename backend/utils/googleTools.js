const axios = require('axios');
const config = require('../config/config.env')
const { User, Token } = require('../config/db');
const { Op } = require("sequelize");
const CustomError = require('./custom-errors');
const tokenUrl = 'https://oauth2.googleapis.com/token';


async function getUpdatedToken(userId) {
  let newAccessToken = null
  let refresh = true

  const accessToken = await Token.findOne({
    attributes: ['otp'],
    where: {
      [Op.and]: [
        { user: userId },
        { type: "GOOGLE_ACCESS_TOKEN" }
      ]
    }
  });

  if (accessToken) {
    const testUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken.otp}`;
    await axios
      .get(testUrl)
      .then((response) => {
        if (response.status === 200) {
          console.log("token is valid")
          refresh = false
        } else {
          console.log("token is invalid")
          refresh = true
        }
      })
      .catch((error) => {
        console.error('Error verifying token');
        return null
      });
  }

  if (refresh) {
    const refreshToken = await Token.findOne({
      attributes: ['otp'],
      where: {
        [Op.and]: [
          { user: userId },
          { type: "GOOGLE_REFRESH_TOKEN" }
        ]
      }
    });

    if (!refreshToken) throw new CustomError("No google account found", 400)

    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken.otp,
      client_id: config.GOOGLE_CLIENT_ID,
      client_secret: config.GOOGLE_CLIENT_SECRET,
    };


    await axios
      .post(tokenUrl, new URLSearchParams(data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(async (response) => {
        newAccessToken = response.data.access_token;
        console.log('New Access Token Generated');
        await Token.destroy({
          where: {
            [Op.and]: [
              { user: userId },
              { type: "GOOGLE_ACCESS_TOKEN" }
            ]
          }
        });
        const token = await Token.create({ otp: newAccessToken, type: "GOOGLE_ACCESS_TOKEN", user: userId })
      })
      .catch((error) => {
        console.error('Error refreshing access token:');
        return null
      });

    return newAccessToken
  } else {
    return accessToken.otp
  }
  // const refreshToken = '1//03doLOcdODVkTCgYIARAAGAMSNwF-L9IraO2gMFiTskbvM_mRaauqQZBvrAu6IeSvjd5E86pUwXvlY3f05cGrcGIYOZWbXm1a-hg';
}


module.exports = { getUpdatedToken }