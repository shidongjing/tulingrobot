var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var req = require('request');

http.createServer(function (request, response) {
    var pathName = url.parse(request.url).pathname;
    var query = url.parse(request.url, true).query;
    if (isStaticRequest(pathName)) {
        // console.log(path.resolve(__dirname + '/page'))
        var data = fs.readFileSync(__dirname + '/page/' + pathName);
        response.writeHead(200);
        response.write(data);
        response.end();
    } else {
        if (pathName == '/chat') {
            var data = {
                "reqType": 0,
                "perception": {
                    "inputText": {
                        "text": query.text,
                    },
                },
                "userInfo": {
                    "apiKey": "31a329bfc39a406ea4ff5e93ad7fe4a9",
                    "userId": "380269"
                }
            }
            var content = JSON.stringify(data);
            req({
                url: 'http://openapi.tuling123.com/openapi/api/v2',
                method: 'POST',
                header: {
                    'content-type': 'application/json',

                },
                body: content,
            }, function (error, resp, body) {
                if (!error && resp.statusCode == 200) {
                    var obj = JSON.parse(body)
                    if (obj && obj.results && obj.results.length > 0 && obj.results[0]) {
                        data = obj.results[0].values;
                        var head = {
                            'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET',
                            'Access-Control-Allow-Headers': "x-request-with, content-type"
                        }
                        response.writeHead(200, head);
                        response.write(JSON.stringify(data));
                        response.end();
                    }
                } else {
                    response.writeHead(403);
                    response.write('<div><body>不知道你在说什么</body></div>')
                }
            })

        }
    }

}).listen(12345)

function isStaticRequest(pathName) {
    var arr = ['.html', '.css', '.js'];
    for (var i = 0; i < arr.length; i++) {
        if (pathName.endsWith(arr[i])) {
            return true
        }
    }

    return false
}

