// simulateur de compteur elec (envoie la conso/jour, la puissance du compteur et la puissance max)

var express = require('express'); // utilisé pour l'envoi de jason via la poste
var app = express();
var bodyParser = require('body-parser')

// ça c'est le module pour faire une requete
var request = require('request');

// autoriser jason à utiliser la poste

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded(
{
    // to support URL-encoded bodies
    extended: true
}));


//classe capteur

function sensors(id,type,unit,min,max)
{
    this.id = id;
    this.type = type;
    this.unit = unit;
    this.min = min;
    this.max = max;
    this.value = 0;
    this.alea = function () {
        this.value = Math.floor((Math.random() * this.max) + (this.min+1));
    };
}

var fs = require('fs'); // filestream
var obj = JSON.parse(fs.readFileSync('config/config.ini', 'utf8')); // ça lit mon config.ini de manière synchro
console.log("\n ---DEBUT SIMU--- \n");
var urlServer = obj.Serveur_Url;
var secondes = obj.sec;


//init capteurs

var listSensors = [];

for(i = 0; i < obj.Topology.number; i++)
{
    listSensors.push(new sensors(i,obj.Topology.Sensors[0].type,obj.Topology.Sensors[0].unit,obj.Topology.Sensors[0].min,obj.Topology.Sensors[0].max));
    listSensors.push(new sensors(i,obj.Topology.Sensors[1].type,obj.Topology.Sensors[1].unit,obj.Topology.Sensors[1].min,obj.Topology.Sensors[1].max));
    listSensors.push(new sensors(i,obj.Topology.Sensors[2].type,obj.Topology.Sensors[2].unit,obj.Topology.Sensors[2].min,obj.Topology.Sensors[2].max));
}

// fonction pour envoyer jason

function sendData(sensor,urlServer)
{
    sensor.alea();
    var requete = request({
        uri: urlServer, //adresse du serv a atteindre
        method: 'POST',
        //faire confiance a jason stattham pour transporter des valeurs
        json: {
            origin: sensor.id,
            type: sensor.type,
            unit: sensor.unit,
            value: sensor.value
        }
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });

    console.log("Requete : " + " Url : " + requete.uri.href + " - methode : " + requete.method + " -  Data :  " + requete.body);
}

function start()
{
    for(i = 0; i < listSensors.length; i++)
    {
        sendData(listSensors[i],urlServer);
    }
    setTimeout(start, secondes * 1000); // le timeout de sec secondes pour permettre de killer la fonction donc faire la boucle configurable dans le .ini
}

start();
console.log("\n ---FIN SIMU--- \n");