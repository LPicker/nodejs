// 引入fs文件处理模块
var fs = require("fs"),
    events = require("events"),
    util = require("util"),
    watcherDir = "./watch",
    processedDir = "./done";

function Watcher(watcherDir, processedDir) {
    this.watcherDir = watcherDir;
    this.processedDir = processedDir;
}

// 添加继承事件发射器行为
util.inherits(Watcher, events.EventEmitter);

Watcher.prototype.watch = function() {
    var watcher = this;
    fs.readdir(watcher.watcherDir, function(err, files) {
        if (err) throw err;
        console.log("watcherDir files:", files);
        for (var file of files) {
            console.log("文件目录发生了改变，尝试进行重命名……", file);
            watcher.emit("process", file);
        }
    });
};

Watcher.prototype.start = function() {
    var watcher = this;
    fs.watchFile(watcherDir, function() {
        watcher.watch();
    });
};

var watcher = new Watcher(watcherDir, processedDir);

watcher.on("process", function(fileName) {
    var watchFile = watcher.watcherDir + "/" + fileName;
    var processedFile = watcher.processedDir + "/" + reNamedName(fileName);

    fs.stat(watchFile, function(err, stats) {
        if (err) throw err;
        console.log(watchFile + " stats:", stats);
    });

    fs.rename(watchFile, processedFile, function(err) {
        if (err) throw err;
        console.log("renamed done!");
    });
});

function reNamedName(fullName) {
    var pointIndex = fullName.lastIndexOf(".");
    return fullName.substr(0, pointIndex) + "1.0.1" + fullName.substr(pointIndex, fullName.length);
}
watcher.start();