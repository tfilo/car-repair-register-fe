#!/bin/bash

npm run build;
docker build -f Dockerfile -t tfilo/car-repair-register-fe:latest .
