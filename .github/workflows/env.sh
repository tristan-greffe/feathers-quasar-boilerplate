#!/bin/bash

check_code()
{
   if [[ $1 -ne $2 ]]; then
	  echo "$3 has failed [error: $1]"
	  exit 1
  fi
}

parse_semver()
{
  local REGEXP="^([0-9]+)\.([0-9]+)\.([0-9]+)"
  [[ "$1" =~ $REGEXP ]]
  SEMVER=(${BASH_REMATCH[1]} ${BASH_REMATCH[2]} ${BASH_REMATCH[3]})
}

#
# Provision the required files
#
echo "##[group]Provision"

# Define the application name
APP=$(node -p -e "require('./package.json').name")

# Define the application version
VERSION=$(node -p -e "require('./package.json').version")
parse_semver $VERSION
MAJOR=${SEMVER[0]}
MINOR=${SEMVER[1]}
PATCH=${SEMVER[2]}

echo "Building $APP v$MAJOR.$MINOR.$PATCH"

# Define the flavor build
TEST_FLAVOR_REGEX="^test-*|-test$"
PROD_FLAVOR_REGEX="^prod-v[0-9]+\.[0-9]+\.[0-9]+"
if [[ ${GITHUB_REF#refs/tags/} =~ $PROD_FLAVOR_REGEX ]];
then
  export FLAVOR=prod
  KLI_FILE=$APP-$VERSION
else
  if [[ ${GITHUB_REF##*/} =~ $TEST_FLAVOR_REGEX ]];
  then
    export FLAVOR=test
    KLI_FILE=$APP-$MAJOR.$MINOR
  else
    export FLAVOR=dev
    KLI_FILE=$APP
  fi
fi
export NODE_APP_INSTANCE=$FLAVOR
TAG=$VERSION-$FLAVOR

echo "Build flavor is $FLAVOR on branch ${GITHUB_REF##*/}"
echo "##[endgroup]"