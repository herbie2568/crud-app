const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const User = require('../models/users.js')
const UserSeed = require('../models/userseed.js')

users.get('/new', (req, res) => {
  res.render('users/new.ejs', {
    currentUser: true
  })

})


users.post('/', (req, res) => {

  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, createdUser) => {
    console.log('user is created', createdUser)
    res.redirect('/songs')
  })
})

module.exports = users
