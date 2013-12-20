#!/bin/bash

##

##

## constant
ROOT_DIR=~/

CURRENT_DIR=`pwd`
RELATION_DIR=`dirname $0`
HOST_NAME=`hostname`

cd $CURRENT_DIR/../../..
echo "The project dir is:" `pwd`
# /home/work/project/lego
PROJECT_DIR=`pwd`
cd $CURRENT_DIR
TEMPLATE_DIR=/data/content
RUN_DIR=$CURRENT_DIR/static
STATIC_DIR=$RUN_DIR

STATIC_HOST_DEV='\/lego-static'
STATIC_HOST_TEST="http:\/\/$HOST_NAME:9000\/lego-static"
STATIC_HOST_ONLINE='http:\/\/static.17dun.com'
WEB_HOST_DEV='http:\/\/localhost'
WEB_HOST_TEST="http:\/\/$HOST_NAME"
WEB_HOST_ONLINE='http:\/\/17dun.com'
JS_VERSION=$(date +%Y%m%d$RANDOM)

TEMPLATE_GLOBAL_FILE=$TEMPLATE_DIR/com/global.vm
JS_INCLUDE_FILE=$TEMPLATE_DIR/js/core.js

#
set_dev_mode() {
    sed -i "s/\(STATIC_HOST=\).*\(\'\)/\1\'$STATIC_HOST_DEV\' )/g" ${TEMPLATE_GLOBAL_FILE}
    sed -i "s/\(WEB_HOST=\).*\(\'\)/\1\'$WEB_HOST_DEV\' )/g" ${TEMPLATE_GLOBAL_FILE}
}

#
set_test_mode() {
    sed -i "s/\(STATIC_HOST=\).*\(\'\)/\1\'$STATIC_HOST_TEST\' )/g" ${TEMPLATE_GLOBAL_FILE}
    sed -i "s/\(WEB_HOST=\).*\(\'\)/\1\'$WEB_HOST_TEST\' )/g" ${TEMPLATE_GLOBAL_FILE}
}

#
set_online_mode() {
    sed -i "s/\(STATIC_HOST=\).*\(\'\)/\1\'$STATIC_HOST_ONLINE\' )/g" ${TEMPLATE_GLOBAL_FILE}
    sed -i "s/\(WEB_HOST=\).*\(\'\)/\1\'$WEB_HOST_ONLINE\' )/g" ${TEMPLATE_GLOBAL_FILE}
}
#
set_js_version() {
    sed -i "s/\(JS_VERSION=\).*\(\'\)/\1\'$JS_VERSION\' )/g" ${TEMPLATE_GLOBAL_FILE}
}

echo "replace host start.";

HAS_ARGUMENTS=0
if [ $# -gt 0 ]; then
    HAS_ARGUMENTS=1
fi

while (($# > 0)) 
do
    case $1 in
    -dev)
        echo 'set_dev_mode'
        set_dev_mode
        ;;
    -test)
        echo 'set_test_mode'
        set_test_mode
        ;;
    -online)
        echo 'set_online_mode'
        set_online_mode
        echo 'set_js_version.'
        set_js_version
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
    echo 'default for set_test_mode:'
    set_test_mode
fi

# set static files version
# echo 'set_js_version.'
# set_js_version

echo "replace host end.";

# display files
#less ${TEMPLATE_GLOBAL_FILE}

exit 0;
