#!/bin/bash

## constant
## /home/work/project/lego
ROOT_DIR=~/

CURRENT_DIR=`pwd`
RELATION_DIR=`dirname $0`

# shell envi path + shell file relation path + ../../ = lego project path
# PROJECT_DIR=${CURRENT_DIR}/${RELATION_DIR}/../..
# ~/project/lego
PROJECT_DIR=$CURRENT_DIR/../../../

BUILD_DIR=build
FE_DIR=${CURRENT_DIR}/../

JS_DIR=${FE_DIR}/js-src
CSS_DIR=${FE_DIR}/css-src
RUN_DIR=${PROJECT_DIR}/static

##

function mk_run_dir() {

    # if [ -d ${RUN_DIR} ]; then
    #    rm ${RUN_DIR} -rf
    #    echo 'delete ' ${RUN_DIR}
    # fi

    if [ ! -d ${RUN_DIR} ]; then
        mkdir ${RUN_DIR} 
        echo 'mkdir ' ${RUN_DIR}
    fi

    if [ ! -d ${RUN_DIR}/js ]; then
        mkdir ${RUN_DIR}/js
        echo 'mkdir ' ${RUN_DIR} '/js'
    fi

    if [ ! -d ${RUN_DIR}/css ]; then
        mkdir ${RUN_DIR}/css
        echo 'mkdir ' ${RUN_DIR} '/css'
    fi
}

function copy_include_files() {
    #cp ${JS_DIR}/*.js  ${RUN_DIR}/js
    #cp  ${JS_DIR}/core.js ${RUN_DIR}/js/
    #cp  ${JS_DIR}/lego.js ${RUN_DIR}/js/
    cp ${JS_DIR}/*.js ${RUN_DIR}/js/
    cp ${CSS_DIR}/*.css ${RUN_DIR}/css/
}

function list_run_dir() {
    ls -l ${RUN_DIR}
    ls -l ${RUN_DIR}/js
    ls -l ${RUN_DIR}/css
}

STATIC_HOST_DEV=''
HOST_NAME=`hostname`
STATIC_HOST_TEST="http:\/\/$HOST_NAME:9000"
DEV_STATIC_JS_CONFIG="DevConfig\['STATIC_IP'\]="

DEV_SRC_PATH='\/lego-dev'

SCRIPT_LIST_FILE=${RUN_DIR}/js/core.js
CSS_LIST_FILE=${RUN_DIR}/css/lego.css
#
replace_css_host() {
    files=`ls ${RUN_DIR}/css/`
    #sed -i "s/\(@import url(\"\).*\($DEV_SRC_PATH\)/\1$STATIC_HOST_TEST$DEV_SRC_PATH/g" ${CSS_LIST_FILE}
    for filename in $files
    do
        sed -i "s/\(@import url(\"\).*\($1\)/\1$2/g" ${RUN_DIR}/css/$filename
    done
}
#
replace_js_host() {
    files=`ls ${RUN_DIR}/js/`
    #sed -i "s/\($DEV_STATIC_JS_CONFIG\).*\(\'\)/\1\'$STATIC_HOST_TEST\';/g" ${SCRIPT_LIST_FILE}
    for filename in $files
    do
        sed -i "s/\($1\).*\(\'\)/\1\'$2\';/g" ${RUN_DIR}/js/$filename
    done
}

#
set_dev_mode() {
    echo 'replace js files:'
    replace_js_host $DEV_STATIC_JS_CONFIG $STATIC_HOST_DEV
    echo 'replace css files:'
    replace_css_host $DEV_SRC_PATH $DEV_SRC_PATH
}

#
set_test_mode() {
    echo 'replace js files:'
    replace_js_host $DEV_STATIC_JS_CONFIG $STATIC_HOST_TEST
    echo 'replace css files:'
    replace_css_host $DEV_SRC_PATH $STATIC_HOST_TEST$DEV_SRC_PATH
}

mk_run_dir
copy_include_files

echo "copy include files start."

HAS_ARGUMENTS=0
if [ $# -gt 0 ]; then
    HAS_ARGUMENTS=1
fi

while (($# > 0)) 
do
    case $1 in
    -dev)
        echo 'dev mode'
        set_dev_mode
        ;;
    -test)
        echo 'test mode'
        set_test_mode
        ;;
    -*)
        echo 'INVALID ARGUMENTS'
        ;;
    *)
        break;;

    esac
    shift

done

# the default mode is development mode
if [ $HAS_ARGUMENTS -le 0 ]; then
    echo 'default dev mode:'
    set_dev_mode
fi

# list_run_dir

# less $SCRIPT_LIST_FILE
echo "copy include files end."

exit 0
