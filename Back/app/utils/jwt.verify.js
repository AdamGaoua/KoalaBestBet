var jwt = require('jsonwebtoken');
require('dotenv').config();
const userConnected = (req, res, next) => {
  if (!req.headers['authorization']) return res.status(401).json({
    error: "Empty Token"
  })
  if (req.headers['authorization'].split(' ')[1] == null) return res.status(401).json({
    error: "Empty Token"
  })

  jwt.verify(req.headers['authorization'].split(' ')[1], 'CTc9eX37SKWFbjJwouwEcSYkwHzpU2NN', (err, user) => {
    if (err) return res.status(403).send({
      error: 'Invalid Token !'
    })
    req.user = user;
    next();
  })
}
module.exports = userConnected