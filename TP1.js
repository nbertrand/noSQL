var express = require('express');
var cons = require('consolidate');
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

MongoClient.connect(url, function(err, db){
         console.dir(err);
          app.db = db;
          app.listen('8000');
          console.log("Express server started on 8000.");
  });

app.engine('html', cons.jade);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser());


function errorHandler(err, req, res, next){
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', {error:err});
}

app.use(errorHandler);

app.get('/collaborateurs', function(req, res) 
{
    app.db.collection('Personnes').find({},{"ID":1, "prenom":1, "nom":1, "dateEntree":1, "poste":1}).toArray(function (erreur, resultats){
        if (erreur) throw erreur;
        console.log(resultats);
        res.render("afficherEmployees", {employees: resultats});
    });
});

app.get('/collaborateurs/new', function(req, res, next) {
    res.render("nouvelleEmployee", {'infos': ['Nom', 'Prenom', "DateEntree", "Poste"]});
});

app.post('/collaborateurs/new', function(req, res, next){
    var nouvelId = 1;


    if(req.body.Nom != '' && req.body.Prenom != '' && req.body.Poste != ''  && req.body.DateEntree !=  '') {
        app.db.collection('Personnes').insert(
        { 
        ID:nouvelId,
        prenom:req.body.Prenom,
        nom:req.body.Nom,
        poste:req.body.Poste,
        dateEntree:req.body.DateEntree    
        }, function (err, result){
            if (err) throw err;
            console.log("Employée insérée");
            res.redirect('/collaborateurs');
        });
    }
    else{
        res.redirect('/collaborateurs/new');
    };
});

app.post('/', function(req, res, next){
	var id=1;
	var nom = ["Romain","Nils"];
	
	for (i=0;i<10;i++)
	{
		app.db.collection('Personne').insert({
			"ID":id, prenom:nom[i%2], "nom":nom[(i+1)%2],
			"dateNaissance":'01/07/1995', "poste":'Développeur',
		"salaire": 2000, "dateEntree":'10/06/2016', "photo":"", "numArrivee":i, "courriel":'romain.plassard@hotmail.fr'});
		id++;
	}
	res.redirect('/collaborateurs');
}

app.get("*", function(req,res){
	res.send("Cette page n'a pas été trouvé");
});