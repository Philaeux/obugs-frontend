#!/bin/bash

git pull
cd obugs
rm -rf dist
tar -xzvf dist.tar.gz
rm -rf dist.tar.gz
cd ..
docker compose up --build -d
cd ../obugs-backend
./deploy.sh
