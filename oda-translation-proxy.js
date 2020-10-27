const http = require('http');
const https = require('https');
const url = require('url');

http.createServer((proxyReq, proxyResp) => {
    let input = [];

    proxyReq.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        input.push(chunk);
    }).on('end', () => {
        let key = url.parse(proxyReq.url, true).query.key;
        if (!key) {
            console.log("No key, aborting...");
            proxyResp.end();
            return;
        }
        console.log("Request Body: \n" + input);

        input = JSON.parse(Buffer.concat(input).toString());
        if (input.source == "en" && input.target != "en") {
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
            hostname: 'translation.googleapis.com',
            port: 443,
            path: '/language/translate/v2?key=' + key,
            method: 'POST'
        }, innerResp => {
            let output = [];
            innerResp.on('data', (chunk) => {
                output.push(chunk);
            });
            innerResp.on('end', () => {
                output = Buffer.concat(output).toString()
                console.log("Response Body: \n" + output);
                proxyResp.writeHead(200, { 'Content-Type': 'application/json' });
                proxyResp.write(output);
                proxyResp.end();
            });
        }).on('error', error => {
            console.error(error)
        });
        innerReq.write(JSON.stringify(input));
        innerReq.end();
    });
}).listen(8080);