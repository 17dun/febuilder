
 List:
 1. copy-include.sh
 2. replace-host.sh
 3. deploy.sh
 4. release.sh
-------------------------

* 使用说明,必须在shell目录下执行，根据相对目录获取文件
=======================================
$ cd ~/lego/fe/trunk/shell/
$ sh ./deploy.sh -m
$ node ./MergeFile.js


*  copy-include
=======================================
用途：将JS、CSS开发引用文件复制到运行目录下，并替换相关引用地址
参数：
-dev 开发模式，复制文件后将引用文件的地址改为开发路径(/lego-dev/)
默认为test模式

*  replace-host 
=======================================
用途：替换后端模板里面的全局文件，修改配置属性
参数：
-dev 开发模式，静态模板引入时更新为本地URL
 同时更新js的version信息
 默认为test模式

*  deploy 
=======================================
用途：复制开发引用文件、合并压缩脚本、发布上线
参数：
-dev 开发模式，静态模板引入时更新为本地URL，同时执行copy-include -dev、replace-host -dev
-test 测试模式，静态模板引入时更新为测试URL，同时执行copy-include -test、replace-host -test
-online 上线模式，静态模板引入时更新为线上URL同时执行copy-include -online、replace-host -online
- m 合并脚本，并且执行test模式。合并之前会提前生成merge-js.xml与merge-css.xml
- c 合并压缩脚本，并且执行test模式

 默认为test模式

*  GenderMergeFile.js
=======================================
用途：用nodejs生成合并xml文件

*  MergeFile.js
=======================================
用途：根据开发目录js-src下的js文件合并文件到static目录

