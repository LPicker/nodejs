var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var chatServer = require('./lib/chat_server');
var port = 1024;
var cache = {};

// 错误响应
function send404(response){
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}
// 发送文件数据
function sendFile(response, filePath, fileContents){
	response.writeHead(
		200, 
		{'Content-Type': mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}
// 静态文件服务
function serverStatic(response, cache, absPath){
	if(cache[absPath]){
		// 直接发送缓存数据
		sendFile(response, absPath, cache[absPath]);
	}else{
		fs.exists(absPath, function(exists){
			if(exists){
				fs.readFile(absPath, function(err, data){
					if(err){
						send404(response);
					}else{
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			}else{
				send404(response);
			}
		});
	}
}

// http服务器
var server = http.createServer(function(req, res){
	var filePath = false;

	if(req.url == '/'){
		filePath = 'public/index.html';
	}else{
		filePath = 'public' + req.url;
	}

	var absPath = './' + filePath;
	serverStatic(res, cache, absPath);
});
// 启动http服务器
server.listen(port, function(){
	console.log('Server listening on port ' + port +'……');
});

chatServer.listen(server);