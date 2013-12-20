#!/bin/bash

##
# 
# for add tag to svn store
# use:
#  option [-r tag number]
# 
## constant
ROOT_DIR=~/

CURRENT_DIR=`pwd`
RELATION_DIR=`dirname $0`

cd $CURRENT_DIR/../../..
echo "The project dir is:" `pwd`
# ~/project/lego
PROJECT_DIR=`pwd`
cd $CURRENT_DIR
SHELL_DIR=$CURRENT_DIR
TEMPLATE_DIR=/data/content
TAG_VERSION=$(date +%Y%m%d)
TAGS_SVN_DIR=$PROJECT_DIR/tags-svn
SVN_STATIC_TRUNK=http:..
SVN_STATIC_TAGS=https:

# authorized for work
#sudo chown work:work ${ROOT_DIR}* -R
#sudo chown work:work ${TEMPLATE_DIR}* -R

function svn_ci_trunk() {
    # svn commit for trunk
    cd $PROJECT_DIR/static/
    pwd
    svn ci --message "commit static trunk by add-tag.sh -ignore"
    echo "svn ci trunk by add-tag.sh -ignore"
}

function copy_static_to_tag() {
    svn co ${SVN_STATIC_TAGS}/${TAG_VERSION}/ $TAGS_SVN_DIR/${TAG_VERSION}
    # echo $TAGS_SVN_DIR/${TAG_VERSION}/js
    cp $PROJECT_DIR/static/js/*  $TAGS_SVN_DIR/${TAG_VERSION}/js
    cp $PROJECT_DIR/static/css/*  $TAGS_SVN_DIR/${TAG_VERSION}/css
}
function svn_ci_tag() {
    # svn commit for tags
    svn ci -m "update tags ${TAG_VERSION} -ignore" $TAGS_SVN_DIR/${TAG_VERSION}/
    echo "svn ci tags ${TAG_VERSION} by add-tag.sh -ignore"
}

function svn_add_tag() {
    svn rm ${SVN_STATIC_TAGS}/${TAG_VERSION} -m "rm tag ${TAG_VERSION} by add-tag.sh"
    svn copy ${SVN_STATIC_TRUNK} ${SVN_STATIC_TAGS}/${TAG_VERSION} -m "add tag ${TAG_VERSION} by add-tag.sh"
    echo "svn add new tag:\r\n"
    echo ${SVN_STATIC_TAGS}/${TAG_VERSION}
    echo "\r\nsvn add tag done."
}

HAS_TAG_ARG=0
while (($# > 0)) 
do
    case $1 in
    -r) 
        if [ $2 ]; then
            TAG_VERSION=$2
            HAS_TAG_ARG=1
        fi
        ;;
    -*)
        echo 'default'
        ;;
    *)
        break;;
    esac
    shift
done

svn_add_tag
copy_static_to_tag
svn_ci_tag
# 如果是自动生成的日期tag才更新到svn trunk上
if [ $HAS_TAG_ARG -le 0 ]; then
    svn_ci_trunk
fi

exit 0;
