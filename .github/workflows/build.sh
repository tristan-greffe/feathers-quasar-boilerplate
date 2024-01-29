#!/bin/bash

#
# Provision the required files
#
source ./.github/workflows/env.sh

#
# Build the app
#
echo "##[group]Build"

# Log in to docker before building the app because of rate limiting
docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
check_code $? 0 "Connecting to Docker"

# Build the image
cd $GITHUB_WORKSPACE
docker build --build-arg APP=$APP --build-arg FLAVOR=$FLAVOR --build-arg BUILD_NUMBER=$GITHUB_RUN_NUMBER -f dockerfile -t codask/$APP:$TAG . 
check_code $? 0 "Building the app docker image"

echo "##[endgroup]"

#
# Deploy the app
#
echo "##[group]Deploy"

# Push the app image to the hub with the version tag
docker push codask/$APP:$TAG
check_code $? 0 "Pushing the $APP:$TAG docker image"

# Push the app image to the hub with the flavor tag
docker tag codask/$APP:$TAG codask/$APP:$FLAVOR
docker push codask/$APP:$FLAVOR
check_code $? 0 "Pushing the $APP:$TAG docker image"

echo "##[endgroup]"