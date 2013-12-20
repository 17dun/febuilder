#! /usr/bin/env node

var MoudleCom = require('./Com.js');
var MoudleDirectory = require('./Directory.js');
var MoudleGenderMergeFile = require('./GenderMergeFile.js');

var Directory = MoudleDirectory.Directory;
var Com = MoudleCom.Com;
var GenderMergeFile = MoudleGenderMergeFile.GenderMergeFile;



var MergeFile = (function() {

    var mergeSuccess = true;

    var _setMergeError = function(options) {
        console.log('error:\r\n');
        console.log(options);
        mergeSuccess = false;
    };

    var fs = require('fs');
    var staticPath = Directory.getStaticPath();
    var fePath = Directory.getFEPath();
    var jsDevPath = Directory.getJSDevPath();
    var cssDevPath = Directory.getCSSDevPath();

    var writeFile = function(filePath, data) {
        fs.writeFile(filePath, data, 'utf8', function(err) {
            if(err) {
                _setMergeError( { filePath: filePath } );
                console.log('writeFile error: ' + filePath + ' \r\n'  + err);
            } else {
                console.log('The file' + filePath +' was wrote!');
            }
        });
    };

    var appendFile = function(filePath, data, callback) {
        fs.appendFile(filePath, data, 'utf8', function(err) {
            if(err) {
                _setMergeError( { filePath: filePath } );
                console.log('appendFile error: ' + filePath + ' \r\n'  + err);
            } else {
                console.log('The file' + filePath +' append successed!');
            }
            if (typeof callback == 'function') {
                callback.call(this, data);
            }
        });
    };

    var readFile = function(filePath, callback) {
        fs.readFile(filePath, 'utf-8', function(err, data) {
            if(err) {
                _setMergeError( { filePath: filePath } );
                console.log('readFile error: ' + filePath + ' \r\n'  + err);
            } else {
                // console.log('The file' + filePath +' read successed!');
            }
            if (typeof callback == 'function') {
                callback.call(this, data);
            }
        });
    };

    var _appendFiles = function(idx, includeFile, files) {
        if (idx < files.length) {
            readFile(files[idx], function(data) {
                appendFile(includeFile, '\r\n' + data, function() {
                    // console.log(idx);
                    // console.log(files[idx]);
                    idx += 1;
                    // 递归逐个合并文件
                    _appendFiles(idx, includeFile, files);
                });

            });
        }
    };

    var mergeCSSFile = function(data) {
        var path = staticPath + '/css';
        var includeFile;
        var filePath;
        var files = data;
        var filePathList = [];
        var list;

        for (var file in files) {
            // 首先清空文件
            includeFile = path + '/' + file + '.css';
            writeFile(includeFile, '');
            filePathList = [];

            for (var i = 0, l = files[file].length; i < l; i++) {
                list = files[file][i];
                for (var j = 0, len = list['files'].length; j < len; j++) {
                    filePath = cssDevPath + '/' + list['folder'] + '/' + list['files'][j];
                    filePathList.push(filePath);

                    // 放在闭包中执行，顺序会被打乱
                    /*
                    (function(includeFile, filePath) {
                        readFile(filePath, function(data) {
                            appendFile(includeFile, '\r\n' + data);
                        });
                    })(includeFile, filePath);
                    */
                }
            }
            console.log('Begin to merge the css file:' + includeFile);
            _appendFiles(0, includeFile, filePathList);
        }

    };

    var mergeJSFile = function(data) {
        var path = staticPath + '/js';
        var includeFile;
        var filePath;
        var files = data;
        var filePathList = [];
        var list;

        for (var file in files) {
            // 首先清空文件
            includeFile = path + '/' + file + '.js';
            writeFile(includeFile, '');
            filePathList = [];

            for (var i = 0, l = files[file].length; i < l; i++) {
                list = files[file][i];
                
                for (var j = 0, len = list['files'].length; j < len; j++) {
                    filePath = jsDevPath + '/' + list['folder'] + '/' + list['files'][j];
                    filePathList.push(filePath);
                    // 放在闭包中执行，顺序会被打乱
                    /*
                    (function(file, includeFile, filePath) {
                        readFile(filePath, function(data) {
                            appendFile(includeFile, '\r\n' + data);
                        });
                    })(file, includeFile, filePath);
                    */
                }
            }
            console.log('Begin to merge the js file:' + includeFile);
            _appendFiles(0, includeFile, filePathList);
        }

    };

    var run = function() {

        GenderMergeFile.loadCSSDevConfig(function(data) {
            mergeCSSFile(data);
        });

        GenderMergeFile.loadJSDevConfig(function(data) {
            mergeJSFile(data);
        });
    };

    return {
        run: run
    }
})();

MergeFile.run();
