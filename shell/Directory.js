#! /usr/bin/env node

var Directory = (function(options) {

    var currentPath = null;
    var rootPath = null;

    var FE_DIR = 'fe/trunk';
    // var FE_DIR = '../../';
    var STATIC_DIR = 'static';
    var SHELL_DIR = 'shell';
    var JS_DEV_DIR = 'js-src';
    var CSS_DEV_DIR = 'css-src';

    var getCurrentPath = function() {
        if (!currentPath) {  
            currentPath = process.cwd();
        }
        return currentPath;
    };

    var getRootPath = function() {
        var path = getCurrentPath().replace(/\\/g, '/');
        var reg = new RegExp('(.*)\/fe(.*)\/shell');
        path = path.match(reg);
        if (path) {
            return path[1];
        }
        /*
        var ends = '/fe/shell';
        var len = path.length;
        var pos = len - ends.length;
        if (path.substr(pos, len) == ends) {
            // remove /fe/shell from the path
            return path.substr(0, pos);
        }
        return path;
        */
        return null;
    };

    var getFEPath = function() {
        var root = getRootPath();
        return root + '/' + FE_DIR;
    };

    var getStaticPath = function() {
        var root = getRootPath();
        return root + '/' + STATIC_DIR;
    };

    var getShellPath = function() {
        var fe = getFEPath();
        return fe + '/' + SHELL_DIR;
    };

    var getJSDevPath = function() {
        var fe = getFEPath();
        return fe + '/' + JS_DEV_DIR;
    };

    var getCSSDevPath = function() {
        var fe = getFEPath();
        return fe + '/' + CSS_DEV_DIR;
    };

    var getFilesName = function(dir) {
        if (!dir) {
            return null;
        }
        var list = [];
        var fs = require('fs');
        var files = fs.readdirSync(dir);

        files.forEach(function (fileName) {
            var stat = fs.statSync(dir + '/' + fileName);
            if (stat.isFile()) {
                list.push(fileName);
            }
        });
        return list;
    };

    var getFiles = function(dir) {
        if (!dir) {
            return null;
        }
        var list = [];
        var fs = require('fs');
        var files = fs.readdirSync(dir);

        files.forEach(function (fileName) {
            var stat = fs.statSync(dir + '/' + fileName);
            if (stat.isFile()) {
                list.push(dir + '/' + fileName);
            }
        });
        return list;
    };

    var getAllFiles = function(dir){
        var fs = require('fs');
        var files = fs.readdirSync(dir);
        var list = [];
        files.forEach(function (fileName) {
            var stat = fs.statSync(dir + '/' + fileName);
            if ( stat.isDirectory() ) {
                list = list.concat(getAllFiles(dir + '/' + fileName));
            } else {
                list.push(dir + '/' + fileName);
            }
        });
        return list;
    };

    var displayAll = function(dir) {
        if (!dir) {
            return null;
        }
        var fs = require('fs');

        try {
            fs.readdir(dir, function(err, files){
                if(err){
                    return console.log(err);
                }
                for(var i = 0; i < files.length; i += 1) {
                    
                    (function(fileName) {
                        fs.stat(dir + '/' + fileName, 
                            function(err, stats) {
                                // if (stats.isFile()) {
                                    console.log(
                                        'name: ' + fileName
                                        + '\r\npath:' + dir + '/' + fileName
                                        + '\t\nsize:' + stats.size
                                        + '\r\nctime' + stats.ctime
                                    );
                                // }
                            }
                        )
                            
                    })(files[i]);

                }
            });
        } catch (e) {
            console.log('error: ' + e);
        }

    };

    return {
        getCurrentPath: getCurrentPath,
        getRootPath:    getRootPath,
        getFEPath:      getFEPath,
        getStaticPath:  getStaticPath,
        getShellPath:   getShellPath,
        getJSDevPath:   getJSDevPath,
        getCSSDevPath:  getCSSDevPath,
        getFilesName: getFilesName,
        getFiles:    getFiles,
        getAllFiles:    getAllFiles,
        displayAll:     displayAll
    }

})();

exports.Directory = Directory;
