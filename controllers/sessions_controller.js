const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/users.js')
const UserSeed = require('../models/userseed.js')

sessions.get('/new', (req, res) => {
  User.find({}, (error, newUser) => {
    res.render('sessions-new.ejs', {
      currentUser: true,
  })
})
})

sessions.post('/', (req, res) => {

  User.findOne({ username: true }, (err, foundUser) => {

    if (err) {
      console.log(err)
      res.send('oops the db had a problem')
    } else if (!foundUser) {
      res.send('<a  href="/">Sorry, no user found </a>')
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser
        res.redirect('/songs')
      } else {
        res.send('<a href="/"> password does not match </a>')
      }
    }
  })
})

sessions.post('/', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

module.exports = sessions
