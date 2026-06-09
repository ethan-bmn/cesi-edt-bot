#!/usr/bin/bash

echo "Building Docker image..."
docker build -t edt-bot .
echo "Running the image..."
docker run -d --name=edt-bot edt-bot