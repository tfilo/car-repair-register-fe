#!/bin/bash

# Get the installed Node.js version
NODE_VERSION=$(node -v 2>/dev/null)

# Check if Node.js is installed
if [[ -z "$NODE_VERSION" ]]; then
    echo "Node.js is not installed. Please install Node.js 22."
    exit 1
fi

# Extract the major version number
NODE_MAJOR_VERSION=$(echo "$NODE_VERSION" | grep -oE '[0-9]+' | head -1)

# Check if the major version is 22
if [[ "$NODE_MAJOR_VERSION" -ne 22 ]]; then
    echo "Node.js version 22 is required, but found $NODE_VERSION."
    exit 1
fi

npm run build && docker build -f Dockerfile -t tfilo/car-repair-register-fe:latest .
