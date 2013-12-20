#!/bin/bash

##

# options 
# -c compress
# default only merge

##

## constant
## /home/work/project
ROOT_DIR=~/
CURRENT_DIR=`pwd`
RELATION_DIR=`dirname $0`

cd $CURRENT_DIR/../../..
echo "The project dir is:" `pwd`
# /home/work/project/lego
PROJECT_DIR=`pwd`
cd $CURRENT_DIR
cd $CURRENT_DIR/..
FE_DIR=`pwd`
echo "The dev dir of trunk is: " $FE_DIR
cd $CURRENT_DIR
BUILD_DIR=build
SHELL_DIR=${FE_DIR}/shell
JS_DIR=${FE_DIR}/js-src
CSS_DIR=${FE_DIR}/css-src
STATIC_DIR=$PROJECT_DIR/static
RUN_DIR=${PROJECT_DIR}/static
TEMPLATE_DIR=/data/content

##

##
# 1. copy js,css including files to `static`
# 2. merge and compress js,css files to `static`
# 3. copy the merged and compressed files from `static` to `/lego/static/`,
#    override the files of same name.
# 4. add js version for velocity template
##


function copy_include_files() {
    echo "copy including files..."
    ant -f ${JS_DIR}/build/copy-include.xml
    ant -f ${CSS_DIR}/build/copy-include.xml
}

function merge_js_files() {
    echo "merge js files start..."
    ant -f ${JS_DIR}/build/merge-js.xml
}

function compress_js_files_uglifyjs() {
    echo "uglifyjs to compress js files start..."
    cd ${RUN_DIR} 
    for item in `find ${RUN_DIR} -name *.js -exec ls {} \;`; do
        uglifyjs $item -o $item --ascii --stats --lint
    done
    cd ${SHELL_DIR} 
}

function compress_js_files() {
    echo "compress js files start..."
    ant -f ${JS_DIR}/build/compress-js.xml
}

function merge_css_files() {
    echo "merge css files start..."
    ant -f ${CSS_DIR}/build/merge-css.xml
}

function compress_css_files() {
    echo "compress css files start..."
    ant -f ${CSS_DIR}/build/compress-css.xml
}

## list static/js static/css
function list_static_dir() {
    echo "list files in static..."
    echo ${RUN_DIR}
    ls -l ${RUN_DIR}
    ls -l ${RUN_DIR}/js
    ls -l ${RUN_DIR}/css
}

function compress_static_files() {
    # 两遍js压缩
    #compress_js_files_uglifyjs
    compress_css_files
    compress_js_files
}

function copy_static_files() {
    sh $SHELL_DIR/copy-include.sh $1
}

function gender_merge_files() {
    #node $SHELL_DIR/GenderMergeFile.js -run
    node $SHELL_DIR/GenderMergeFile.js -run
}

function merge_static_files() {
    gender_merge_files

    # 合并时不要编辑需要合并的开发
    # 并且授权给work账户
    # 否则可能导致合并异常

    # 采用node直接合并
    node $SHELL_DIR/MergeFile.js

    # 采用ant合并
    # merge_js_files
    # merge_css_files
}

function run_dev_mode() {
    sh $SHELL_DIR/replace-host.sh -dev
}

function run_test_mode() {
    sh $SHELL_DIR/replace-host.sh -test
}

function run_online_mode() {
    sh $SHELL_DIR/replace-host.sh -online
}

function svn_ci_template_com() {
    cd $TEMPLATE_DIR/com
    pwd
    svn ci --message 'deploy by deploy.sh'
}

function svn_ci_static() {
    cd $RUN_DIR/
    pwd
    svn ci --message 'deploy by deploy.sh -ignore'
}

function svn_up() {
    echo "svn update start:"
    cd $RUN_DIR
    svn up swf/ img/
    cd $FE_DIR
    svn up
    cd $TEMPLATE_DIR
    svn up
    cd $SHELL_DIR
}

echo "deploy start.";

HAS_ARGUMENTS=0
if [ $# -gt 0 ]; then
    HAS_ARGUMENTS=1
fi

while (($# > 0)) 
do
    case $1 in
    -c)
        echo 'merge_and_compress_mode'
        merge_static_files
        compress_static_files
        HAS_ARGUMENTS=1
        ;;
    -m)
        echo 'merge_mode'
        merge_static_files
        HAS_ARGUMENTS=1
        ;;
    -dev)
        echo 'run_dev_mode'
        run_dev_mode
        copy_static_files -dev
        ;;
    -test)
        echo 'run_test_mode'
        HAS_ARGUMENTS=1
        run_test_mode
        copy_static_files -test
        ;;
    -online)
        echo 'run_online_mode'
        #svn_up
        run_online_mode
        merge_static_files
        compress_static_files
        svn_ci_template_com
        # ci move to add-tag.sh
        # svn_ci_static
        ;;
    -*)
        echo 'default'
        ;;
    *)
        break;;

    esac
    shift
done

echo $HAS_ARGUMENTS

# the default mode is development mode
if [ $HAS_ARGUMENTS -le 0 ]; then
    echo 'default run_test_mode'
    svn_up
    run_test_mode
    copy_static_files -test
fi

list_static_dir
echo "deploy end."

exit 0;
