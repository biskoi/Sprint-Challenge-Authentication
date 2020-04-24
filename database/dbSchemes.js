const db = require('../database/dbConfig');

module.exports = {
   register,
   find
}

function find(username) {
   return db('users')
      .where({username});
};

function register(newUser) {
   return db('users')
      .insert(newUser)
};