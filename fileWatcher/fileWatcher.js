// 引入fs文件处理模块
var fs = require("fs"),
    events = require("events"),
    util = require("util"),
    colors = require('colors'),
    watcherDir = "./dist-tmp/web/csm-resmgr",
    processedDir = "./dist";

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
        // console.log("\nwatcherDir files: ", files);
        var filesMap = {};
        for (var file of files) {
            var watchFile = watcher.watcherDir + "/" + file;
            (function(file){
                // 读取文件属性是耗时的IO操作，这里使用异步方式，为避免遍历文件顺序错乱，使用闭包
                fs.stat(watchFile, function(err, stats) {
                    if (err) throw err;
                    var birthtime = new Date(stats.birthtime).getTime();
                    var fileNameProps = getFileNameProps(file);
                    var extensionNames = [".js", ".css"];
                    var {fileName, extensionName} = fileNameProps;
                    var isSupport = extensionNames.includes(extensionName);
                    if(!isSupport){
                        console.log(`\n不支持 ${extensionName} 文件格式，仅支持以下类型扩展名的文件: [${extensionNames.join("、")}]`.red);
                        console.log(`跳过 ${file}`.yellow);
                        return;
                    }
                    if(!filesMap[fileName]){
                        filesMap[fileName] = {props:[], arr:[]};
                    }
                    filesMap[fileName].props.push({
                        fileName: file,
                        birthtime: birthtime
                    });
                    filesMap[fileName].arr.push(birthtime);

                    var fileNameArr = files.filter(function(file){
                        var fileNameProps = getFileNameProps(file);
                        return fileNameProps.fileName === fileName;
                    });
                    // fileNameArr 数组中有多余的 .map 格式的文件，数量刚好为数组的一半
                    if(fileNameArr.length/2 === filesMap[fileName].arr.length){
                        handleFile(watcher, filesMap[fileName]);
                    }
                });
            })(file);
        }
    });
};

function handleFile(watcher, fileMap){
    var {props, arr} = fileMap;
    arr.sort((a, b) => b - a);
    var lastFile = props.find(fileProp => fileProp.birthtime === arr[0]);
    
    watcher.emit("process", lastFile.fileName);
}

Watcher.prototype.start = function() {
    var watcher = this;
    console.log("watching......".yellow);
    fs.watchFile(watcherDir, function() {
        watcher.watch();
    });
};

var watcher = new Watcher(watcherDir, processedDir);

watcher.on("process", function(fullName) {
    var fileNameProps = getFileNameProps(fullName);
    var {fileName, extensionName} = fileNameProps;
    var reNamedName = fileName + ".1.0.1" + extensionName;
    var watchFile = watcher.watcherDir + "/" + fullName;
    var processedFile = watcher.processedDir + "/" + reNamedName;

    (function(reNamedName){
        console.log(`\n尝试进行重命名${watchFile}为${processedFile}`.yellow);
        fs.rename(watchFile, processedFile, function(err) {
            if (err) throw err;
            console.log(`\nrenamed done!, generated ${reNamedName}`.green);
        });
    })(reNamedName);
});

function getFileNameProps(fullName) {
    var firstPointIndex = fullName.indexOf(".");
    var lastPointIndex = fullName.lastIndexOf(".");
    var fileName = fullName.substr(0, firstPointIndex);
    var extensionName = fullName.substr(lastPointIndex, fullName.length);
    return {fileName, extensionName};
}

watcher.start();
watcher.watch();
