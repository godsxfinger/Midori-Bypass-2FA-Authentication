module.exports = function(request, response) {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');
    const config = require('../config');
    const client = require('twilio')(config.accountSid, config.authToken);
    var to = request.body.to || null;
    var user = request.body.user || null;
    var service = request.body.service || null;
    var name = request.body.name || null;
    var callSid = null;
    if (to == null || user == null || service == null) {
        return response.status(200).json({
            error: 'Please post all the informations needed.'
        });
    }
    if (config[service + 'filepath'] == undefined) {
        return response.status(200).json({
            error: "The service wasn't recognised."
        });
    }

    if (!!!user) {
        return response.status(200).json({
            error: "Bad user name."
        });
    }

    if (!!!service) {
        return response.status(200).json({
            error: "Bad service name."
        });
    }
    if (!to.match(/^\d{8,14}$/g)) {
        return response.status(200).json({
            error: 'Bad phone number.'
        });
    }

    client.calls.create({
        method: 'POST',
        statusCallbackEvent: ['initiated', 'answered', 'completed'],
        statusCallback: config.serverurl + '/status/' + config.apipassword,
        url: config.serverurl + '/voice/' + config.apipassword,
        to: to,
        from: config.callerid
    }).then((call) => {
        callSid = call.sid;
        db.get('SELECT callSid FROM calls WHERE callSid = ?', [callSid], (err, row) => {
            if (err) {
                return console.log(err.message);
            }
            if (row == undefined) {
                db.run(`INSERT INTO calls(callSid, user, service, itsto, name) VALUES(?, ?, ?, ?, ?)`, [callSid, user, service, to, name], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });
            } else {
                db.run(`UPDATE calls SET user = ?, service = ?, itsto = ?, name = ?  WHERE callSid = ?`, [user, service, to, callSid, name], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });
            }
        });

        response.status(200).json({
            callSid
        });
    }).catch(error => {
        return response.status(200).json({
            error: 'There was a problem with your call, check if your account is upgraded.'
        });
    });

};