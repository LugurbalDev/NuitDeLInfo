//inclusion des librairies du projet
const createError = require('http-errors');
const path = require('path');
const express = require('express');
const hjs = require('hjs');
const mongoose = require('mongoose');
const moment = require('moment');
const connectionString = 'mongodb+srv://Siggy:Necrosig@db-kpfp1.mongodb.net/test?retryWrites=true&w=majority'
moment.locale('fr');


//connexion à la base de données mongodb
mongoose.connect(connectionString, { useUnifiedTopology: true,useNewUrlParser:true}, (err,data) => {
  if (err){
    console.log("Connexion à la base de donnée : échec")
    return
  }
  console.log("Connexion à la base de donnée : réussite")
})


//Architecture du projet
const home = require('./routes/home')
const aide = require('./routes/aide')

//Déclaration de l'app Express
const app = express()

//quelques réglages
app.use(express.static(path.join(__dirname, 'public')));

//Définition du moteur de rendu
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', "hjs")

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/',home)
app.use('/aide',aide)

//Gestion des erreurs
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error',err);
});


//Serveur
console.log("Tentative de connexion...");
app.listen(5000)
console.log("Application connecté sur localhost:5000")
