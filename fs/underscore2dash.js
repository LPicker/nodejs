// 引入fs文件处理模块
var fs = require("fs");
// 用变量src表示这个文件夹名称
var src = "icons";
// fs.readdir(path, callback) 遍历文件夹
// 读取path路径所在目录的内容，回调函数(callback)接收两个参数(err, files)，
// 其中files是一个存储目录中所包含的文件名称的数组
// var files = fs.readdirSync(src);
fs.readdir(src, function(err, files){
	console.log(src + "里面共有" + files.length + "个文件/n");
	// for(var i=0,len=files.length;i<len;i++){
	// 	var filename = files[i];
	// 	var oldPath = src + "/" + filename;
	// 	var newPath = src + "/" + filename.replace(/_/g, "-");
	// 	// fs.rename(oldPath, newPath, callback) 重命名
	// 	fs.rename(oldPath, newPath, fn);
	// }
	// function fn(err){
	// 	if(!err){
	// 		console.log(filename + "下划线替换成功！");
	// 	}
	// }

	
	// forEach 遍历方式
	var n = 0;
	files.forEach(function(filename){
		var oldPath = src + "/" + filename;
		var newPath = src + "/" + filename.replace(/-/g, "_");
		// 重命名
		fs.rename(oldPath, newPath, function(err){
			if(!err){
				console.log("第" + (++n) + "个文件：" + filename + "替换成功！");
			}
		});
	});
});