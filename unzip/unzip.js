var fs = require("fs");
var unzip = require("unzip");
var fstream = require('fstream');
// var rar = "XSCORE.zip";
var rar = "test.rar";
var outputPath = "output";

fs.createReadStream(rar).pipe(unzip.Extract({ path: outputPath }));
var readStream = fs.createReadStream(rar);
var writeStream = fstream.Writer(outputPath);

fs.createReadStream(rar)
    .pipe(unzip.Parse())
    .on('entry', function(entry) {
        var fileName = entry.path;
        var type = entry.type; // 'Directory' or 'File'
        var size = entry.size;

        //process the entry or pipe it to another stream
        console.log(">>应该已经解压完了！");
    });
