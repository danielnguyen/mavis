#!/bin/sh

set -x
set -e

mkdir ~/.aws
touch ~/config
chmod 600 ~/.aws/config
echo "[profile eb-cli]" > ~/.aws/config
echo "aws_access_key_id=$AWS_ACCESS_KEY_ID" >> ~/.aws/config
echo "aws_secret_access_key=$AWS_ACCESS_KEY_SECRET" >> ~/.aws/config