#!/bin/bash

# Load environment variables from .env file
source .env

yarn

# Validate environment variables
if [ -z "$PORT" ]; then
  echo "PORT is not set"
  exit 1
fi

if [ -z "$UPLOAD_PATH" ]; then
  echo "UPLOAD_PATH is not set"
  exit 1
fi

if [ -z "$UPLOAD_PORT" ]; then
  echo "UPLOAD_PORT is not set"
  exit 1
fi

if [ -z "$MONGO_EXPOSE_PORT" ]; then
  echo "MONGO_EXPOSE_PORT is not set"
  exit 1
fi

# Create the directory if it doesn't exist
if [ ! -d "$UPLOAD_PATH" ]; then
  echo "Creating directory $UPLOAD_PATH"
  sudo mkdir -p "$UPLOAD_PATH"
fi

# Set permissions for the directory
echo "Setting permissions for $UPLOAD_PATH"
sudo chown -R 1000:1000 "$UPLOAD_PATH"
sudo chmod -R 775 "$UPLOAD_PATH"

# Initialize variables
DOCKER_COMMAND=""
NO_CACHE=""

# Check for --no-cache argument
for arg in "$@"
do
  if [ "$arg" == "--no-cache" ]; then
    NO_CACHE="--no-cache"
  fi
done

# Determine the command to run based on the argument
if [ "$1" == "-prod" ]; then
  DOCKER_COMMAND="docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build $NO_CACHE -d"
else
  DOCKER_COMMAND="docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build $NO_CACHE -d"
fi

# Run Docker Compose
echo "Starting Docker Compose with command: $DOCKER_COMMAND"
$DOCKER_COMMAND
