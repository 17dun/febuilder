#!/bin/bash


##
# 
# for publish to online
#
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
SHELL_DIR=${FE_DIR}/shell
STATIC_DIR=$PROJECT_DIR/static
RUN_DIR=${PROJECT_DIR}/static
TEMPLATE_DIR=/data/content/

HOST_NAME=`hostname`
TAG_VERSION=""
ARGUMENTS_NUMBER=$#

# authorized for work
#echo "sudo chown work:work ${PROJECT_DIR} -R"
#echo "sudo chown work:work ${TEMPLATE_DIR} -R"
#sudo chown work:work ${PROJECT_DIR} -R
#sudo chown work:work ${TEMPLATE_DIR} -R

function update_content() {
    cd $TEMPLATE_DIR
    svn up
    cd $SHELL_DIR
}

function update_static() {
    cd ${FE_DIR}
    svn up
    cd $SHELL_DIR
}

function remove_static() {
    # remove static file first
    rm $PROJECT_DIR/static/js/* -f
    rm $PROJECT_DIR/static/css/* -f
}

function deploy_online() {
    # execute to publish online
    sh ${SHELL_DIR}/deploy.sh -online
}

function svn_add_tag() {
    # add tag to svn
    sh ${SHELL_DIR}/add-tag.sh $1 $2
}

function update_test_server() {
    echo 'delopy to test enviroment.'
    ssh $HOST_NAME '/data/static_update.sh'
}

remove_static
update_static

# 是否手动更新svn内容
if [ "$1" != "-manual" ]; then 
    echo 'auto update svn files:'
    update_content
else 
    echo 'manual update svn files:'
fi

deploy_online

while (($# > 0)) 
do
    case $1 in
    -online)
        svn_add_tag
        ;;
    -tag)
        TAG_VERSION=$2
        svn_add_tag -r $2
        ;;
    -test)
        svn_add_tag
        update_test_server
        ;;
    -*)
        echo 'default'
        ;;
    *)
        break;;
    esac
    shift
done

echo 'release done.'

#echo $STATIC_DIR/js
#ls -l $STATIC_DIR/js
#echo $STATIC_DIR/css
#ls -l $STATIC_DIR/css

# sh ${SHELL_DIR}/deploy.sh -test

exit 0;
