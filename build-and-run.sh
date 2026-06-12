#!/usr/bin/bash

CURRENT_UID=$(id -u):$(id -g)
docker build -t edt-bot . && docker run --name=edt-bot edt-bot --user=$CURRENT_UID