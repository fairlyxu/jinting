// 模块调用声明  s为文件模块，path为系统路径模块
var fs = require('fs-extra');
var path = require('path');
// express() 表示创建express应用程序。简单几行代码其实就可以创建一个应用
var express = require('express');

var root = __dirname;
// console.log(root);
fs.mkdirs(
    path.join(root, 'dep'),
    function() {
        fs.link(
            path.join(root, '..', '..', 'src'),
            path.join(root, 'dep', 'er'),
            function(err) {
                var app = express();
                app.use(express.static(root));
                app.listen(3000);
                console.log(root);
                console.log('visit http://localhost:3000/main.htm');
            }
        );
    }
);