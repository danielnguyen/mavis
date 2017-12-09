#!/bin/bash

docker login -u $DOCKER_USER -p $DOCKER_PASS
docker tag $NAME $DOCKER_REPO/$NAME
docker push $DOCKER_REPO/$NAME