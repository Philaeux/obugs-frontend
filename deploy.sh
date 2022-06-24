#!/bin/bash

git pull
cd obugs && ng build
docker-compose build
docker-compose down
docker-compose up -d

