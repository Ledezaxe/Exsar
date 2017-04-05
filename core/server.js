/**
 * Created by Ledezaxe on 07/01/2017.
 */

var express  = require('express');
var app      = express();
var session = require('express-session');

var bodyParser = require('body-parser');


// configuration ===============================================================

app.use(session({secret: 'ExsarSession'}));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

require('./models/models');

// set up our express application
app.use( express.static( "public" ) );
app.set('view engine', 'ejs'); // set up ejs for templating


// routes ======================================================================

require('./routes/routes')(app);

// launch ======================================================================
app.listen(5333);
console.log('serv lancé sur le port 5333');