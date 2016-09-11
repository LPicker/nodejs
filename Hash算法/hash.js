var crypto = require('crypto'),
    readline = require('readline'),
    fs = require('fs');

var args = ['sha256', 'RSA-SHA256', 'md5'];    // 定义所要计算的算法
var arr_path = [];                      // 用来存储文件路径
//创建readline接口实例
var rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

// question方法
rl.question("请输入文件路径（多个文件用【,】分隔）：\n",function(answer){
    var arr = answer.split(",");
    arr.forEach(function(path){
        arr_path.push(path);
    });

    console.log("文件输入完毕！");
    arr_path.forEach(function(filepath, path_inx){
        console.log("即将读取第【"+(path_inx+1)+"】个文件【"+filepath+"】……");

        args.forEach(function(arg){
            console.log("正在进行【"+arg+"】计算……");
            getHash(arg, filepath);
        });
    });
    // 不加close，则不会结束
    // rl.close();
});

// close事件监听
rl.on("close", function(){
    console.log("Bye Bye!");
    // 结束程序
    process.exit(0);
});

function getHash(algorithm, filepath){
    var shasum = crypto.createHash(algorithm);
    var txt = fs.ReadStream(filepath);

    txt.on('data', function(d){
        shasum.update(d);
    });
    txt.on('end', function(){
        // 以十六进制返回所传入的所有数据的摘要值
        var d = shasum.digest('hex');
        console.log("【"+algorithm + "】：" + d);
    });
}
