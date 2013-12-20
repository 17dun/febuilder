/*
 * 开发时的配置，上线合并压缩时本文件会被替换
 * shenll脚本会根据DevConfig来替换相应的地址，供所有js引用文件引用
 * 配置标识符CONFIG_START、CONFIG_END不要随意改动或增加
 * 每次更新时只更新DevConfig下的内容
 */
var DevConfig = DevConfig || {};

// 本地开发IP: 为空
DevConfig["STATIC_IP"]="";
DevConfig["DEV_PATH"]="/lego-dev";

// 用于引入脚本文件的列表对象
DevConfig["SCRIPT_LIST"] = DevConfig["SCRIPT_LIST"] || {};

// 每个要合并文件都建立一个对象, 按照顺序去写
// core.js
/*$$CONFIG_START$$*/
DevConfig["SCRIPT_LIST"]["core"] = [
    {
        // 文件夹
        folder: "lib",
        // 该文件夹下的文件列表
        files: [
            "jquery-1.9.1.js",
            "underscore.js",
            "backbone.js",
            "jquery.tmpl.js"
        ]
    },
    {
        folder: "tools",
        files: [
        //    "Tracer.js"
        ]
    },
    {
        folder: "com",
        files: [
            "Com.js",
            "Interface.js",
            "Validator.js",
            "Storage.js",
            "Log.js",
            "RunActiveContent.js",
            "Image.js",
            "Grid.js"
        ]
    }
];
/*$$CONFIG_END$$*/

// 引入脚本文件的方法
var DevConfigWrite = (function () {
    var STATIC_PATH = DevConfig["STATIC_IP"] + DevConfig["DEV_PATH"] + "/js-src";
    function append(src) {
        document.write('<script type="text/javascript" src="' + src + '"></script>');
    }

    function write(scriptList) {
        if (!scriptList || !scriptList instanceof Array) {
            return;
        }
        var script = {};
        var path;
        var filePath;
        for (var i = 0, l = scriptList.length; i < l; i++) {
            script = scriptList[i];
            path = STATIC_PATH + '/' + script['folder'];
            for (var j = 0, len = script['files'].length; j < len; j++) {
                filePath = path + '/' + script['files'][j];
                append(filePath);
            }
        }
    }
    return write;

})();

DevConfigWrite(DevConfig["SCRIPT_LIST"]["core"]);
