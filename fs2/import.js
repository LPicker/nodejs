// 引入fs文件处理模块
var fs = require("fs");
// 测试用的HTML页面文件夹地址、文件名称
var src = "src";
var filename = "import-example.html";
var tar = "dist";
var fnImportExample = function(src, filename){
	// 读取HTML 页面内容
	// 使用 fs.readFile(filename, [options], callback)
	fs.readFile(src + "/" + filename, {
		// 需要指定编码格式，否则返回原生的buffer
		encoding: "utf8"
	}, function(err, data){
		// 把HTML替换成href文件中的内容
		// 替换[<link rel="import" href="import-example.html">]
		var dataReplace = data.replace(/<link\s+rel=["']import["']\s+href=["'](.*)["']\s*>/gi, function(matchs, href){
			// href 就是匹配的路径地址
			// 读文件，返回文件内容
			return fs.readFileSync(src + "/" + href, {
				encoding: "utf8"
			});
		});
		// 由于我们把文件放在更上一层目录，因此，一些相对地址需要处理
		// 本例中，对["..]进行替换
		dataReplace = dataReplace.replace(/"..\//g, "");
		console.log("dataReplace:"+dataReplace+"\n\n");

		// 生成新的HTML文件
		// fs.writeFile(filename, data, [options], callback)
		fs.writeFile(tar + "/" + filename, dataReplace, {
			encoding: "utf8"
		}, function(err){
			if(err){throw err;}
			console.log(filename + "生成成功！");
		});
	});
};

// 默认执行一次
fnImportExample(src, filename);

// 监控文件，变更后重新生成
fs.watch(src + "/" + filename, function(event, filename){
	if(event == "change"){
		console.log(src + "/" + filename + "发生了改变，重新生成……");
		fnImportExample(src, filename);
	}
});