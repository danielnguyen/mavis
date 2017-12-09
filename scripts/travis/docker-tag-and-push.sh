#!/bin/bash

docker tag $NAME $DOCKER_REPO/$NAME
docker push $DOCKER_REPO/$NAME