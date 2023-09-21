// config.js
module.exports = {
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE : process.env.DATABASE,
    DATABASE_USER : process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD : process.env.DATABASE_PASSWORD,
    JWT_SECRET_KEY : process.env.SECRET_KEY,
    DATABASE_DIALECT : process.env.DATABASE_DIALECT,
    EMAIL_USER : process.env.EMAIL_USER,
    EMAIL_PASSWORD :process.env.EMAIL_PASSWORD,
    mongoURI : process.env.mongoURI,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI : process.env.GOOGLE_REDIRECT_URI

  };
  