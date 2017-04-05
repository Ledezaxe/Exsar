var home = require('../controllers/ctrl');
var DB = require("mongodb").MongoClient;
var bcrypt = require("bcrypt-nodejs");

const assert = require('assert');

exports.inscription = function(username, pass, res, req)
{
	bcrypt.hash(pass, null, null, function(err, hash)
	{
		DB.connect("mongodb://localhost/pass", function(error, db) {
    	if (error) throw error;
		db.collection("user").insertOne({
			"id": 1,
			"try": 0,
			"username": req.body.username,
			"pass": hash,
			"rank": 0 // 0 : non abo, 1 : abo, 1337 : admin
		},function(err, result) {
			assert.equal(err, null);
			console.log("Compte créé");
		});
		db.close();
	});
})

    home.valid(username,pass,true,res,req,false,1);
}

exports.checkLog = function(username,pass,res,req)
{
	var id;
	DB.connect("mongodb://localhost/pass", function(error, db) {
	    if (error) throw error;

	    db.collection("user").find().toArray(function (error, results) {
	        if (error) throw error;

	        var succes = false;
	        var fail = false;
	        results.forEach(function(i, obj) {

	        var essai = i.try;

	           if(username == i.username)
	            {

	            	if(essai > 2)
	            	{
	            		console.log("-----------------------------" + username + " verrouillé");
	            		fail = true;
	            	}
	            	else
	            	{
	            		bcrypt.compare(pass, i.pass, function(err, result)
						{
                            if(result == true)
                            {
                                id = i.id;
                                console.log("----------------------------log ok");
                                db.collection("user").update(
                                    { username: i.username},
                                    { $set: { try : 0  } }
                                );
                                req.session.username = username;
                                req.session.pass = pass;
                                succes = true;
                            }
                            else
                            {
                                console.log("----------------------------pass fail");

                                if(essai < 3)
                                {
                                    essai = essai + 1;
                                    db.collection("user").update(
                                        { username: i.username},
                                        { $set: { try : essai  } }
                                    );
                                }

                                if(essai > 3)
                                {
                                    console.log("-------------------------Compte verr");
                                    fail = true;
                                }
                            }
                            home.valid(username,pass,succes,res,req,fail,id,i.rank);
						});
	            	}	
	            }
	        });
	    });
	});
	console.log("---------------------------------------");
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}
exports.add = function(req, res)
{
    DB.connect("mongodb://localhost/pass", function(error, db) {
        if (error) throw error;
        db.collection("data").insertOne({
            "id": req.body.origin,
            "type": req.body.type,
            "unit": req.body.unit,
            "value": req.body.value,
            "date" : getDateTime()
        },function(err, result) {
            assert.equal(err, null);
            console.log("Inserted a document into the collection.");
        });
        db.close();
    });
}

exports.change = function(req, res)
{
    DB.connect("mongodb://localhost/pass", function(error, db) {
        if (error) throw error;
        db.collection("data").updateOne({
        	"id" : req.body.origin,
			"type": req.body.type,
			"unit": req.body.unit
			//"date" : getDateTime()
		},
			{ $set:{
				"value": req.body.value
        }},function(err, result) {
            assert.equal(err, null);
            console.log("Updated a document into the collection.");
        });
        db.close();
    });
}

exports.suppr = function(req, res)
{
    DB.connect("mongodb://localhost/pass", function(error, db) {
        if (error) throw error;
        db.collection("data").remove({
                "id" : req.body.origin,
                "type": req.body.type,
                "unit": req.body.unit,
				"value": req.body.value
                //"date" : req.body.date
            },function(err, result) {
                assert.equal(err, null);
                console.log("Deleted a document into the collection.");
            });
        db.close();
    });

}

exports.read = function(req, res)
{
	var ret = [];

	var crit = {};
	crit["id"] = parseInt(req.params.origin);
	crit["type"] = req.params.type;
    DB.connect("mongodb://localhost/pass", function(error, db) {
        var result = db.collection("data").find(crit).sort({_id:-1}).limit(7, function(){});
		console.log("Read a document into the collection.");
        var enr = 0;
        result.forEach(function(o){
                ret[enr] = o;
                enr += 1;
        });

        setTimeout(function(){
            //console.log(ret);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(ret));
            res.end();
		}, 500);
        db.close();
    });

}