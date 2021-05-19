module.exports = function(req, res) {
    const config = require('.././config');
    const fs = require('fs');
    const service = req.params.service + 'filepath';
	if (!!config[service] && config[service] != undefined) {
        const filePath = config[service];
        var stat = fs.statSync(filePath);
        var total = stat.size;
        res.writeHead(200, {
            'Content-Length': total,
            'Content-Type': 'audio/mpeg'
        });
        fs.createReadStream(filePath).pipe(res);
    } else {
        return res.status(200).json({
            error: 'Bad service.'
        });
    }
};