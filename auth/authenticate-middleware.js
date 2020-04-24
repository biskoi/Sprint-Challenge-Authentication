const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

  const secret = process.env.SECRET || 'ihatecats';

  jwt.verify(req.headers.authorization, secret, (error, decodedToken) => {
    if (error) {
      res.status(400).json({
        message: `Bad token.`
      });
    } else {
      next();
    };
  })

};
