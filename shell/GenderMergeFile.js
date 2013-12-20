#! /usr/bin/env node

var MoudleCom = require('./Com.js');
var MoudleDirectory = require('./Directory.js');
var Directory = MoudleDirectory.Directory;
var Com = MoudleCom.Com;

var DevConfig = DevConfig || {};
DevConfig['SCRIPT_LIST'] = DevConfig['SCRIPT_LIST'] || {};
DevConfig['CSS_LIST'] = DevConfig['CSS_LIST'] || {};

var GenderMergeFile = (function() {

    var fs = require('fs');

    var JSDEV_CONFIG_PREFIX  = '/*$$CONFIG_START$$*/';
    var JSDEV_CONFIG_POSTFIX = '/*$$CONFIG_END$$*/';
    var CSSDEV_CONFIG_PREFIX  = 'url\\("';
    var CSSDEV_CONFIG_POSTFIX = '"\\)';
    var BUILD_CONTNET_START  = '<!--$$CONTNET_START$$-->';
    var BUILD_CONTNET_END    = '<!--$$CONTNET_END$$-->';

    var fePath               = Directory.getFEPath();
    var jsMergeFile          = fePath + '/js-src/build/merge-js.xml';
    var cssMergeFile         = fePath + '/css-src/build/merge-css.xml';

    var getJSMergeFile = function() {
        return jsMergeFile;
    };

    var getCSSMergeFile = function() {
        return cssMergeFile;
    };

    var writeFile = function(filePath, data) {
        fs.writeFile(filePath, data, function(err) {
            if(err) {
                console.log(err);
            } else {
                // console.log(data);
                console.log('The file' + filePath +' was saved!');
            }
        });
    };

    var writeCSSBuildXML = function(xmlStr) {
        writeFile(cssMergeFile, xmlStr);
    };

    var writeJSBuildXML = function(xmlStr) {
        writeFile(jsMergeFile, xmlStr);
    };

    var genderNewMergeStr = function(xmlStr, mergeFile, callback) {
        var startIdx;
        var endIdx;
        var prefixText;
        var postfixText;
        var newXMLStr = '';

        fs.readFile(mergeFile, 'utf-8', function(err, data){
            if(err) {
                console.log(err);
            }
            startIdx = data.indexOf(BUILD_CONTNET_START);
            endIdx = data.indexOf(BUILD_CONTNET_END);

            if (endIdx > 0 && startIdx > 0) {

                prefixText  = data.substring(0, startIdx);
                postfixText = data.substr(endIdx + BUILD_CONTNET_END.length);
                
                newXMLStr += prefixText
                            + xmlStr
                            + postfixText;

                if (typeof callback == 'function') {
                    callback.call(this, newXMLStr);
                }
            }
        });
    };

    var getJSBuildXML = function(filesList) {
        var temp  = [];
        var xmlStr = '';
        var files = null;
        var dir   = null;
        var idx   = 0;
        var dirNames = [];
    
        // 拼接ant脚本，此处严格按照文件结构来写
        var _getMergeStrList = function(dir, files) {
            // 第0个不需要依赖
            var dependsDir = idx > 0 ? dirNames[idx - 1] : '';
            var dependsDirStr = idx > 0 ? 'depends="Merge ' + dependsDir +  '.js"' : '';

            var str = '';
            var file = '';

            str += ('<!--Merge ' + dir + '.js-->\r\n')
                + '<target name="Merge ' + dir + '.js" ' + dependsDirStr + '>\r\n'
                +   '<echo message="merge ' + dir + '.js Begin"/>\r\n'
                +   '<concat destfile="${js-run-path}/' + dir + '.js" encoding="utf-8">\r\n';

            for (var i = 0, filesLen = files.length; i < filesLen; i++) {
                file = files[i];
                str += '   <!--  ' + file.folder + ' dir -->\r\n';
                    for (var j = 0, scriptLen = file.files.length; j < scriptLen; j++) {
                        str +='   <fileset dir="${js-src-path}/' + files[i].folder + '/" includes="' + file.files[j] +'"/>\r\n';
                    }
            }

            str +=  '</concat>\r\n'
                +   '<echo message="Merge ' + dir + '.js Finished"/>\r\n'
                +   '</target>\r\n';

            return str;
        }

        var propertyStr = '';
        temp.push(propertyStr);
        for (var files in filesList) {
            dirNames.push(files);
            temp.push(_getMergeStrList(files, filesList[files]));
            idx += 1;
        }

        // 重新设置第一条数据
        propertyStr += '<!--$$CONTNET_START$$-->\r\n';
        propertyStr += '<project name="Lego JS Files Merge" default="Merge ' + dirNames[idx - 1] + '.js" basedir=".">\r\n'
            + ' <property name="root-path" value="../../../.." />\r\n'
            + ' <property name="fe-path" value="../.." />\r\n'
            + ' <property name="js-src-path" value="${fe-path}/js-src" />\r\n'
            + ' <property name="js-run-path" value="${root-path}/static/js" />\r\n'
            + '';
        temp[0] = propertyStr;
        xmlStr = temp.join('') + '\r\n</project>\r\n<!--$$CONTNET_END$$-->';

        genderNewMergeStr(xmlStr, jsMergeFile, writeJSBuildXML );
        
    };

    var getCSSBuildXML = function(filesList) {
        var temp  = [];
        var xmlStr = '';
        var files = null;
        var dir   = null;
        var idx   = 0;
        var dirNames = [];

        // 拼接ant脚本，此处严格按照文件结构来写
        var _getMergeStrList = function(dir, files) {
            // 第0个不需要依赖
            var dependsDir = idx > 0 ? dirNames[idx - 1] : '';
            var dependsDirStr = idx > 0 ? 'depends="Merge ' + dependsDir +  '.css"' : '';

            var str = '';
            var file = '';

            str += ('<!--Merge ' + dir + '.css-->\r\n')
                + '<target name="Merge ' + dir + '.css" ' + dependsDirStr + '>\r\n'
                +   '<echo message="merge ' + dir + '.css Begin"/>\r\n'
                +   '<concat destfile="${css-run-path}/' + dir + '.css" encoding="utf-8">\r\n';

            for (var i = 0, filesLen = files.length; i < filesLen; i++) {
                file = files[i];
                str += '   <!--  ' + file.folder + ' dir -->\r\n';
                    for (var j = 0, scriptLen = file.files.length; j < scriptLen; j++) {
                        str +='   <fileset dir="${css-src-path}/' + files[i].folder + '/" includes="' + file.files[j] +'"/>\r\n';
                    }
            }

            str +=  '</concat>\r\n'
                +   '<echo message="Merge ' + dir + '.css Finished"/>\r\n'
                +   '</target>\r\n';


            return str;
        }

        var propertyStr = '';
        temp.push(propertyStr);
        for (var files in filesList) {
            dirNames.push(files);
            temp.push(_getMergeStrList(files, filesList[files]));
            idx += 1;
        }

        // 重新设置第一条数据
        propertyStr += '<!--$$CONTNET_START$$-->\r\n';
        propertyStr += '<project name="Lego CSS Files Merge" default="Merge ' + dirNames[idx - 1] + '.css" basedir=".">\r\n'
            + ' <property name="root-path" value="../../../.." />\r\n'
            + ' <property name="fe-path" value="../.." />\r\n'
            + ' <property name="css-src-path" value="${fe-path}/css-src" />\r\n'
            + ' <property name="css-run-path" value="${root-path}/static/css" />\r\n'
            + '';
        temp[0] = propertyStr;
        xmlStr = temp.join('') + '\r\n</project>\r\n<!--$$CONTNET_END$$-->';

        genderNewMergeStr(xmlStr, cssMergeFile, writeCSSBuildXML );
        
    };

    var loadCSSDevConfig = function(callback) {
        var cssIncludeFiles = Directory.getFilesName( Directory.getCSSDevPath() );
        var path = Directory.getCSSDevPath();

        var _getDir = function(path) {
            var cssSrc = 'css-src';
            var start = path.indexOf(cssSrc);
            path = path.substr(start + cssSrc.length + 1);
            var end = path.indexOf('/');
            path = path.substring(0, end);
            return (path);
        }
        var _getFile = function(path) {
            var cssSrc = 'css-src';
            var start = path.indexOf(cssSrc);
            var end = path.lastIndexOf('/');
            var path = path.substring(start + cssSrc.length + 1, path.length);
            var pos = path.indexOf('/');
            path = path.substr(pos + 1);
            return (path);
        }

        var _exsitItem = function(list, folder) {
            for (var i = 0, l = list.length; i < l; i++) {
                if (folder  === list[i].folder) {
                    return list[i];
                }
            }
            return false;
        };

        var _setJSONlist = function(dir, folder, file) {
            if (!DevConfig['CSS_LIST'][dir]) {
                DevConfig['CSS_LIST'][dir] = [];
            }
            var item = _exsitItem(DevConfig['CSS_LIST'][dir], folder);
            if (item) {
                item.files.push(file);
            } else {
                DevConfig['CSS_LIST'][dir].push(
                    {
                        'folder': folder,
                        'files': [file]
                    }
                );
            }
        };
        
        cssIncludeFiles.forEach( function(file, idx) {
            var startIdx;
            var endIdx;
            var json;
            var dir;

            fs.readFile( path + '/' + file, 'utf-8', function(err, data) {
                if(err) {
                    console.log(err);
                }

                dir = file.substring(0, file.lastIndexOf('.'));

                var reg = new RegExp(CSSDEV_CONFIG_PREFIX + '(.*)' + CSSDEV_CONFIG_POSTFIX, 'gmi');

                var value = data.replace(reg, function(data, path, index) {
                        console.log(index);
                        _setJSONlist(dir, _getDir(path), _getFile(path));
                        return path;
                });
                // 最后一个文件读取完成，则生成css ant脚本
                if ((idx + 1) == cssIncludeFiles.length) {
                    if (typeof callback == 'function') {
                        callback.call(this, DevConfig['CSS_LIST']);
                    } else {
                        getCSSBuildXML(DevConfig['CSS_LIST']);
                    }
                }
            });
        });
    };

    var loadJSDevConfig = function(callback) {
        var jsIncludeFiles = Directory.getFilesName( Directory.getJSDevPath() );
        var path = Directory.getJSDevPath();

        jsIncludeFiles.forEach( function(file, idx) {
            var startIdx;
            var endIdx;
            var json;
            var dir;
            fs.readFile( path + '/' + file, 'utf-8', function(err, data) {
            //fs.readFileSync( path + '/' + file, 'utf-8', function(err, data) {
                if(err) {
                    console.log(err);
                }
                dir = file.substring(0, file.lastIndexOf('.'));
                // substring替换法
                // startIdx = data.indexOf(JSDEV_CONFIG_PREFIX);
                // endIdx = data.indexOf(JSDEV_CONFIG_POSTFIX);

                // if (endIdx > 0 && startIdx > 0) {
                //     data = ( data.substring( startIdx + JSDEV_CONFIG_PREFIX.length, endIdx) );
                //     data = data.substr( (data.indexOf('=') + 1));
                //     if ( data.lastIndexOf(';') != -1) {
                //         data = data.substring(0, data.lastIndexOf(';'));
                //     }
                //     json = Com.base.func(data);
                //     DevConfig['SCRIPT_LIST'][dir] = json;
                //     // 最后一个文件读取完成，则生成js ant脚本
                //     if ((idx + 1) == jsIncludeFiles.length) {
                //         if (typeof callback == 'function') {
                //             callback.call(this, DevConfig['SCRIPT_LIST']);
                //         } else {
                //             getJSBuildXML(DevConfig['SCRIPT_LIST']);
                //         }
                //     }
                // }
                // substr end

                // 正则匹配替换法
                JSDEV_CONFIG_PREFIX = '/\\*\\$\\$CONFIG_START\\$\\$\\*/';
                JSDEV_CONFIG_POSTFIX = '/\\*\\$\\$CONFIG_END\\$\\$\\*/';
                var reg = new RegExp(JSDEV_CONFIG_PREFIX + '(?:.|[\r\n])*' + JSDEV_CONFIG_POSTFIX, 'ig');
                var json = data.replace(reg, function(json, index, data) {
                    if (index) {
                        json = json.substr( (json.indexOf('=') + 1));
                        if ( json.lastIndexOf(';') != -1) {
                            json = json.substring(0, json.lastIndexOf(';'));
                        }

                        json = Com.base.func(json);
                        DevConfig['SCRIPT_LIST'][dir] = json;
                        // 最后一个文件读取完成，则生成js ant脚本
                        if ((idx + 1) == jsIncludeFiles.length) {
                            if (typeof callback == 'function') {
                                callback.call(this, DevConfig['SCRIPT_LIST']);
                            } else {
                                getJSBuildXML(DevConfig['SCRIPT_LIST']);
                            }
                        }
                    }
                });
                // 正则end
                
            });
        });
    };

    var run = function() {
        // loadCSSDevConfig();
        loadJSDevConfig();
    };

    return {
        getCSSMergeFile: getCSSMergeFile,
        getJSMergeFile: getJSMergeFile,
        run: run,
        loadCSSDevConfig: loadCSSDevConfig,
        loadJSDevConfig: loadJSDevConfig
    };
})();

// accept argments
process.argv.forEach(function (val, index, file) {
    if (val == '-run') {
        console.log(index + ': ' + val + ':' + file);
        GenderMergeFile.run();
    }
});

exports.GenderMergeFile = GenderMergeFile;
