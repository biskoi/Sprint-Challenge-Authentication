const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../database/dbSchemes');
const jwt = require('jsonwebtoken');

const newToken = (user) => {
  const secret = process.env.SECRET || 'ihatecats';
  const payload = {
    userID: user.id,
    username: user.username
  };
  const options = {
    expiresIn: 1000*60*60
  };

  return jwt.sign(payload, secret, options)

}

router.post('/register', (req, res) => {

  
  if (!req.body || !req.body.username || !req.body.password) {
    res.status(400).json({
      message: `Missing user info.`
    });
  } else {
    
    const newUser = {
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 5)
    };
    
    db.register(newUser)
      .then(rep => {
        res.status(201).json({
          message: `Signup success!`,
          id: rep[0]
        });
      })
      .catch(err => {
        res.status(500).json({
          message: `Server error. ${err}`
        });
      });

  }


});

router.post('/login', (req, res) => {

  db.find(req.body.username)
    .then(user => {
      if (user && bcrypt.compareSync(req.body.password, user[0].password)) {
        res.status(200).json({
          message: `Login success.`,
          token: newToken(user[0]),
        });
      } else {
        res.status(400).json({
          message: `Login failed.`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `Server error. ${err}`
      });
    });

});

module.exports = router;
