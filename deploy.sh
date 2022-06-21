#!/bin/bash

git pull
cd obugs && ng build --prod
docker-compose down
docker-compose up -d

