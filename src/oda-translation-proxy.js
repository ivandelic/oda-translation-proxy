const http = require('http');
const https = require('https');
const url = require('url');
const config = require('./config');

http.createServer((proxyReq, proxyResp) => {
    let input = [];

    proxyReq.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        input.push(chunk);
    }).on('end', () => {
        let key = url.parse(proxyReq.url, true).query.key;
        console.log("Request Body: \n" + input);

        input = JSON.parse(Buffer.concat(input).toString());
        if (input.source == config.nonTranslatableLang && input.target != config.nonTranslatableLang && !input.q.startsWith(".", 1)) {
            const fakeResponse = {
                data: {
                    translations: [{
                        translatedText: input.q
                    }]
                }
            }
            proxyResp.writeHead(200, { 'Content-Type': 'application/json' });
            proxyResp.write(JSON.stringify(fakeResponse));
            proxyResp.end();
            return;
        }

        const innerReq = https.request({
            hostname: config.googleTranslate.hostname,
            port: config.googleTranslate.port,
            path: config.googleTranslate.path + (!key ? "" : key),
            method: config.googleTranslate.method
        }, innerResp => {
            let output = [];
            innerResp.on('data', (chunk) => {
                output.push(chunk);
            });
            innerResp.on('end', () => {
                output = JSON.parse(Buffer.concat(output).toString());
                console.log("Response Body: \n" + JSON.stringify(output));
                let code = 200;
                if (!!output.error) {
                    code = output.error.code;
                }
                proxyResp.writeHead(code, { 'Content-Type': 'application/json' });
                proxyResp.write(JSON.stringify(output));
                proxyResp.end();
            });
        }).on('error', error => {
            console.log("Response Error: \n" + output);
            proxyResp.end();
        });
        innerReq.write(JSON.stringify(input));
        innerReq.end();
    });
}).listen(config.port);