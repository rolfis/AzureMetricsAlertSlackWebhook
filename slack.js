var https = require('https');
var url = require('url');
var slackHookRequestOptions = getSlackHookRequestOptions();
module.exports.sendToSlack = sendToSlack;

function getSlackHookRequestOptions() {
    var hookUri = url.parse(process.env.slackhookuri);

    return {
        host: hookUri.hostname,
        port: hookUri.port,
        path: hookUri.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

function sendToSlack(parsedRequest, callback) {
    if (!parsedRequest || (parsedRequest.body || '').trim() === '') {
        callback(true);
        return;
    }

    var error = false;
    var slackMessage = convertToSlackMessage(parsedRequest.body, parsedRequest.channel, parsedRequest.type);
    var req = https.request(slackHookRequestOptions);

    req.on('error', function(e) {
        console.error(e);
        error = true;
    });

    req.on('close', function() {
        callback(error);
    });

    req.write(slackMessage);
    req.end();
}

function convertToSlackMessage(body, channel, type) {
    var parsedBody = trParseBody(body);

    return JSON.stringify({
        username: 'Azure Metrics Alert',
        icon_emoji: ':fire:',
        text: getParsedDescription(parsedBody, type) + " | " + getParsedResourceName(parsedBody, type),
        channel: channel || process.env.slackchannel
    });
}

function trParseBody(body) {
    try {
        return JSON.parse(body) || {
            status: 'failed',
            complete: false
        };
    } catch (err) {
        console.error(err);
        return {
            status: err,
            complete: false
        };
    }
}

function getParsedResourceName(parsedBody, type) {
    return (
        parsedBody.RequestBody.context.resourceName !== '' ? parsedBody.RequestBody.context.resourceName : 'Unknown resource'
    );
}

function getParsedName(parsedBody, type) {
    return (
        parsedBody.RequestBody.context.name !== '' ? parsedBody.RequestBody.context.name : 'Unknown alert name'
    );
}

function getParsedDescription(parsedBody, type) {
    return (
        parsedBody.RequestBody.context.description !== '' ? parsedBody.RequestBody.context.description : 'Unknown alert description'
    );
}
