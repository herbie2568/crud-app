const express = require('express');
const app = express ();
const methodOverride  = require('method-override');
const session = require('express-session')
const mongoose = require ('mongoose');
const bcrypt = require('bcrypt')
const multer = require('multer')
const bodyParser = require('body-parser')
const Songdata = require('./models/songs.js')
const songsSeed = require('./models/seed.js')
const User = require('./models/users.js')
const Songnumber = require('./models/numberofsongs.js')
const userController = require('./controllers/users_controller.js')
const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)



const db = mongoose.connection;
require('dotenv').config()
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)




db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

app.use(express.static('public'));
app.use(express.static('partials'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/users', userController)
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
)

///HOMEPAGE ROUTE///
app.get('/', (req, res) => {
  res.render('home.ejs',
  {
    currentUser: true
  })
})

////NEW USER ROUTE////
app.get('/new', (req, res) => {
  User.find({}, (error, createNewUser) => {
  res.render('sessions-new.ejs')
})
})

app.get('/new', (req, res) => {
  User.find({}, (error, createNewUser) => {
  res.render('users/new.ejs')
})
})



////LOGIN ROUTE////
app.get('/login', (req, res) => {
  res.render('sessions-new.ejs')
})

app.get('/signup', (req, res) => {
  res.render('users/new.ejs')
})

///LOGIN POST///
app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  res.send(`Username: ${username} Password: ${password}`)
})

////PLAYLIST ROUTE///
// app.get('/songs/playlist', (req, res) => {
//   Songdata.find({}, (error, allSongsPlaylist) => {
//     res.render('playlist.ejs', {
//       songsPlaylist: allSongsPlaylist,
//       currentUser: true
//     })
//   })
// })

app.get('/songs/playlist', (req, res) => {
  Songdata.find({}, (error, allSongsPlaylist) => {
    Songnumber.find({}, (error, makeSongsPlaylist) => {
      res.render('playlist.ejs', {
      songsPlaylist: allSongsPlaylist,
      numberOfSongs: makeSongsPlaylist,
      currentUser: true
    })
  })
})
})

app.post('/songs/playlist', (req, res) => {
  Songnumber.create(req.body, (error, createdNumber) => {
    res.redirect('/generate-playlist')
  })
})

app.post('/generate-playlist', (req, res) => {
  Songnumber.create(req.body, (error, createdNumber) => {
    res.redirect('/generate-playlist')
  })
})


////GENERATE PLAYLIST ROUTE////
// app.get('/generate-playlist', (req, res) => {
//   Songdata.find({}, (error, makePlaylist) => {
//     res.render('playlistpage.ejs', {
//       songsPlaylistPage: makePlaylist,
//       currentUser: true
//     })
//   })
// })

app.get('/generate-playlist', (req, res) => {
  Songdata.find({}, (error, makePlaylist) => {
    Songnumber.find({}, (error, makeSongs) => {
      res.render('playlistpage.ejs', {
      songsPlaylistPage: makePlaylist,
      numberOfSongs: makeSongs,
      currentUser: true
    })
  })
})
})

////SHUFFLE ROUTE////
app.get('/songs/shuffle', (req, res) => {
  Songdata.find({}, (error, allSongsShuffle) => {
    res.render('shuffle.ejs', {
      songsShuffle: allSongsShuffle,
      currentUser: true
    })
  })
})



////NEW ROUTE////
app.get('/songs/new', (req, res) => {
  res.render('new.ejs', {
    currentUser: true
  })

})


/////CREATE ROUTE////
app.post('/songs/', (req, res) => {
  Songdata.create(req.body, (error, createdSong) => {
    res.redirect('/songs')
  })
})

////SHOW ROUTE/////
app.get('/songs/:id', (req, res) => {
  Songdata.findById(req.params.id, (err, foundSong) => {
    res.render('show.ejs', {
      currentUser: true,
      songsShow: foundSong
    })
  })
})

////EDIT ROUTE////
app.get('/songs/:id/edit', (req, res)=>{
    Songdata.findById(req.params.id, (err, foundSong)=>{
        res.render(
    		'edit.ejs',
    		{
          currentUser: true,
    			songsEdit: foundSong
    		}
    	);
    });
});


////PUT ROUTE////
app.put('/songs/:id', (req, res)=>{
    Songdata.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedModel)=>{
    res.redirect('/songs');
});
});

////DELETE ROUTE////
app.delete('/songs/:id', (req, res)=>{
  Songdata.findByIdAndRemove(req.params.id, (error, data)=>{
        res.redirect('/songs');//
    });
});



////INDEX FILE ROUTE////
app.get('/songs', (req, res) => {
  Songdata.find({}, (error, allSongs) => {
    res.render('index.ejs', {
      songsIndex: allSongs,
      currentUser: true,
    })
  })
})


// Songnumber.collection.drop()
//
// Songdata.create(songsSeed, (err, data) => {
//   if (err) console.log(err.message);
//   console.log("added provided songs data");
// })
// Songdata.collection.drop()
// Songdata.countDocuments({}, (err, data) => {
//   if (err) console.log(err.message)
//   console.log(`There are ${data} songs in this database`)
// })
//

app.listen(PORT, () => console.log( 'Listening on port:', PORT));
