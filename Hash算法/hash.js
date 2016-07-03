var crypto = require('crypto'),
    fs = require('fs');


var arr = ['sha256', 'RSA-SHA256'];
var filename = 'F:/软件源文件/开发工具/git/Git-2.9.0-32-bit.exe';
function getHash(algorithm){
    var shasum = crypto.createHash(algorithm);
    var txt = fs.ReadStream(filename);

    txt.on('data', function(d){
        shasum.update(d);
    });
    txt.on('end', function(){
        // 以十六进制返回所传入的所有数据的摘要值
        var d = shasum.digest('hex');
        console.log(algorithm + "：" + d);
    });
}
arr.forEach(function(name){
    getHash(name);
});
// 打印支持的hash算法
// console.log(crypto.getHashes());