var express = require('express'); //utiliser express fait le lien serveur
var app = express(); // definir utilisation d'express
var bodyParser = require("body-parser"); //pour les url
var morgan = require("morgan"); // voir les requetes
var mongoose = require("mongoose"); //communiquer une databases
var port = process.env.PORT || 8080; //definir le ports
 mongoose.connect('mongodb://localhost/db_exomongo');
var User = require('./app/models/user.js');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req,res, next){
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');
 next();
});
app.use(morgan("Dev"));//accede au log de la requete dans la console
app.get('/', function(req, res) {
 res.send('Welcome to the home page!');
});
var apiRouter = express.Router();
apiRouter.get('/', function(req, res) {
res.json({ message: 'hooray! welcome to our api!' });
 });
 apiRouter.route('/users')
            // create a user (accessed at POST http://localhost:8080/api/users)
        .post(function(req, res) {
        // create a new instance of the User model
        var user = new User();
                        // set the users information (comes from the request)
                        user.name = req.body.name;
                        user.username = req.body.username;
                        user.password = req.body.password;
                        // save the user and check for errors
            user.save(function(err) { if (err) {
                        // duplicate entry
            if (err.code == 11000)
                return res.json({ success: false, message: 'A user with that\
            username already exists. '});
             else
                return res.send(err);
            }
            res.json({ message: 'User created!' });
           });
    })
    
    .get(function(req, res) {
              User.find(function(err, user) {
                if (err) res.send(err);
                res.json(user);
              });
            });

apiRouter.route('/users/:user_id')
   .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) { 
    if (err) res.send(err);
    res.json(user);
     });
 })

 app.use('/api', apiRouter);

 app.listen(port);
 console.log("ça marche," + port);
