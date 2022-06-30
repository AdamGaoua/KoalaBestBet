var jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SIGN_SECRET = 'CTc9eX37SKWFbjJwouwEcSYkwHzpU2NN';
module.exports = {
  generateTokenForUser: function (userData) {
    return jwt.sign({
        userId: userData.id
      },
      JWT_SIGN_SECRET, {
        expiresIn: '6h'
      })
  },
}