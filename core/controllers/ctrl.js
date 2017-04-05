var model = require('../models/models');
var phantom = require('phantom');
var request = require('request');
var nodemailer = require('nodemailer');

var screenshot = require('desktop-screenshot');
var smtpTransport = require('nodemailer-smtp-transport');
var cpt=0;

exports.updateAccount = function(req, res)
{
    model.updateRank();
    res.render('adminpage', {username: req.session.username, pass: req.session.pass, id: req.body.id})
}

exports.delog = function(req, res)
{
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
}

exports.admin = function(req, res)
{
    res.render('adminpage', {username: req.body.username, pass: req.body.pass, id: req.body.id});
}

exports.genPDF = function(req, res)
{
    var username = req.body.username;
    var password = req.body.pass;

    screenshot("rapport.png", function(error, complete) {
        if(error)
            console.log("Screenshot failed", error);
        else
            console.log("Screenshot succeeded");
    });

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'Yandex',
        auth: {
            user: 'exemple',
            pass: 'password'
        }
    }));

    var message = {
        from: 'Exsar',
        to: username,
        subject: 'Rapport Exsar',
        text: 'Plaintext version of the message',
        html: '<p>en piece jointe, la capture de votre consomation</p>',
        attachments: [{filename: 'rapport.png', path: 'rapport.png'}]
    };


    transporter.sendMail(message, function () {
        console.log("rapport envoyé");
        res.render('profile', {
            username: username,
            pass: password,
            id: req.body.id,
            generatePDF: false
        });
    });
}

exports.insc = function(req, res)
{
    var username = req.body.username;
    var pass = req.body.pass;

    model.inscription(username, pass, res, req);
}


exports.auth = function(req, res)
{
	var username = req.body.username;
	var pass = req.body.pass;

	model.checkLog(username, pass, res, req);
}

exports.valid = function(username, pass, val, res, req, fail, id, rank)
{
	if (val)
	{
	    if (rank == 1337)
	        res.render('admin', {username: username, pass: pass, id: id});
	    else if (rank == 1)
            res.render('profile', {username: username, pass: pass, id: id});
	    else
	        res.render('free', {username: username, pass: pass, id: id})
    }
	else
	{
		if (fail)
			res.render('../views/compte_verr');
		else
		{
            res.render('../views/login');
        }
	}
}

// CRUD

exports.displayBodyConsole = function(req, res)
{
	console.log(req.body);
	res.sendStatus(200);
	res.end();
}

exports.addDB = function(req, res)
{
	model.add(req, res);
	res.sendStatus(200);
	res.end();
}

exports.changeDB = function(req, res)
{
	model.change(req, res);
	res.sendStatus(200);
	res.end();
}

exports.supprDB = function(req, res)
{
	model.suppr(req, res);
	res.sendStatus(200);
	res.end();
}

exports.readDB = function(req, res)
{
	model.read(req, res);

}