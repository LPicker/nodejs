var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

// 创建路由映射表
var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

// 启动服务
server.start(router.route, handle);