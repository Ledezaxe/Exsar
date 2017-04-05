var home = require('../controllers/ctrl');
var model = require('../models/models');
 

module.exports = function(app)
{


    app.post('/login',home.auth);
    app.post('/delog', home.delog);
    app.post('/insc', home.insc);
    app.post('/adminpage', home.admin);
    app.post('/adminprofile', home.auth);
    app.post('/genPDF', home.genPDF);
    app.post('/updateAccount', home.updateAccount);

    // recoltes données

    app.get("/capteurs/:origin/:type", home.readDB);
    app.post('/capteurs', home.addDB);
    app.put('/capteurs', home.changeDB);
    app.delete('/capteurs', home.supprDB);

    // cas par défaut
    app.use(function(req,res)
        {
            var sess;
            sess = req.session;
            if (sess.username)
                model.checkLog(sess.username, sess.pass, res, req);
            else
                res.render('login');
        });
    
 
};
