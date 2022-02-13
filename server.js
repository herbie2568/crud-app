const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const multer = require('multer')
const Songdata = require('./models/songs.js')
const songsSeed = require('./models/seed.js')
// const genreTypes = require('./models/genres.js')
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)

db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());
app.use(methodOverride('_method'));



////NEW ROUTE////
app.get('/songs/new', (req, res) => {
  res.render('new.ejs')
})

// ////NEW WITH ARRAY///
// app.get('/songs/new', (req, res) => {
//   res.render('new.ejs',
//     {
//
//     })
// })


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
      songsIndex: allSongs
    })
  })
})



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
