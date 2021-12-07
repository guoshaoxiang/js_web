var PORT = 5800;

var http = require("http");
var url = require("url");
var fs = require("fs"); //fs模块是用于读取文件
var mime = require("./mime").types;
var path = require("path");

// sync version
function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

var server = http.createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', "*");
    response.setHeader('Access-Control-Allow-Headers', true);
    response.setHeader('Access-Control-Allow-Credentials', 'Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    let dirs = fs.readdirSync("report");
    if (dirs.length == 0) {
        response.writeHead(404, {
            "Content-Type": "text/plain"
        });

        response.write("report dirs is empty");
        response.end();
    } else {
        var realPath = path.join("report", dirs[0]);
        var ext = path.extname(realPath);
        ext = ext ? ext.slice(1) : "unknown";
        fs.readFile(realPath, "binary", function (err, file) {
            try {
                fs.unlinkSync(realPath);
                console.log('已成功删除文件', realPath);
            } catch (err) {
                console.log('删除文件失败', realPath);
            }

            if (err) {
                response.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                response.end(err);
            } else {
                var contentType = mime[ext] || "text/plain";
                response.writeHead(200, {
                    "Content-Type": contentType
                });
                response.write(file, "binary");
                response.end();
            }
        });
    }
    // var pathname = url.parse(request.url).pathname;
    // var realPath = path.join("report", pathname);//report就是放置一些静态资源文件的目录，这个可以根据自己的项目需求作修改
    // //console.log(realPath);
    // var ext = path.extname(realPath);
    // ext = ext ? ext.slice(1) : "unknown";
    // fs.access(realPath, fs.constants.F_OK, function (err) {
    //     if (err) {
    //         response.writeHead(404, {
    //             "Content-Type": "text/plain"
    //         });

    //         response.write("This request URL " + pathname + " was not found on this server.");
    //         response.end();
    //     } else {
    //         fs.readFile(realPath, "binary", function (err, file) {
    //             if (err) {
    //                 response.writeHead(500, {
    //                     "Content-Type": "text/plain"
    //                 });
    //                 response.end(err);
    //             } else {
    //                 var contentType = mime[ext] || "text/plain";
    //                 response.writeHead(200, {
    //                     "Content-Type": contentType
    //                 });
    //                 response.write(file, "binary");
    //                 response.end();
    //             }
    //         });
    //     }
    // });
    // fs.exists(realPath, function (exists) {
    //     if (!exists) {
    //         response.writeHead(404, {
    //             "Content-Type": "text/plain"
    //         });

    //         response.write("This request URL " + pathname + " was not found on this server.");
    //         response.end();
    //     } else {
    //         fs.readFile(realPath, "binary", function (err, file) {
    //             if (err) {
    //                 response.writeHead(500, {
    //                     "Content-Type": "text/plain"
    //                 });
    //                 response.end(err);
    //             } else {
    //                 var contentType = mime[ext] || "text/plain";
    //                 response.writeHead(200, {
    //                     "Content-Type": contentType
    //                 });
    //                 response.write(file, "binary");
    //                 response.end();
    //             }
    //         });
    //     }
    // });
});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");