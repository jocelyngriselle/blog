var express = require('express');
var mongoose = require('mongoose');

// connect to database
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
var urlmongo = "mongodb://127.0.0.1:27017/piscinedb";
mongoose.connect(urlmongo, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});

// server variables
var hostname = 'localhost';
var port = 3000;
var app = express();


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// model for Piscine
var piscineSchema = mongoose.Schema({
    nom: String,
    adresse: String,
    tel: String,
    description: String
});
var Piscine = mongoose.model('Piscine', piscineSchema);

// routes
var myRouter = express.Router();

// route for homepage
myRouter.route('/')
    .all(function(req,res){
        res.json({message : "Bienvenue sur notre API de piscine", methode : req.method});
    });

myRouter.route('/piscines')
    // route to get list of Piscines
    .get(function(req,res){
        Piscine.find(function(err, piscines){
            if (err){
                res.send(err);
            }
            res.json(piscines);
        });
    })
    // route to add a Piscine
    .post(function(req,res){
        var piscine = new Piscine();
        piscine.nom = req.body.nom;
        piscine.adresse = req.body.adresse;
        piscine.tel = req.body.tel;
        piscine.description = req.body.description;
        piscine.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message : 'Bravo, la piscine est maintenant stockée en base de données'});
        });
    });

myRouter.route('/piscines/:piscine_id')
    // route to get a piscine
    .get(function(req,res){
        Piscine.findById(req.params.piscine_id, function(err, piscine) {
            if (err)
                res.send(err);
            res.json(piscine);
        });
    });

app.use(myRouter);

// run server
app.listen(port, hostname, function(){
    console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port);
});