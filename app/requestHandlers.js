var querystring = require('querystring');

function start(request, response) {
    console.log("Request handler 'start' was called.");
    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea><br>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(request, response) {
    console.log("Request handler 'upload' was called.");
    var html = '<!doctype html>\
        <html>\
        <head>\
        <meta http-equiv="content-Type" content="text/html" charset="UTF-8">\
        </head>\
        <body>';
    var postData = "";
    request.setEncoding("utf8");
    response.writeHead(200, {"Content-Type": "text/html"});

    request.addListener("data", function(chunk) {
        // called when a new chunk of data was received
        postData += chunk;
        // console.log("Received POST data chunk '" + chunk + "'.");
    });

    request.addListener("end", function() {
        // called when all chunks of data have been received
        response.write(html + "<h1>Hello Upload</h1>");
        var body = "<p>You've sent the text: " + querystring.parse(postData).text + "\n";

        body += '</p>\
            </body>\
            </html>';
        response.write(body);
        response.end();
    });
}

exports.start = start;
exports.upload = upload;