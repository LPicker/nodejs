var http = require('http');
var url = require('url');

function start(route, handle){
    function onrequest(request, response) {
        console.log(request.url);
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        route(handle, pathname, request, response);
        // 发送 http 头部
        // HTTP 状态值：200：OK
        // 内容类型：text/plain
    }
    http.createServer(onrequest).listen(8888);
    // 终端打印如下信息
    console.log('Server running at http://127.0.0.1:8888/');
}

exports.start = start;