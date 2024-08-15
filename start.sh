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

if [ -z "$UPLOAD_DOMAIN" ]; then
  echo "UPLOAD_DOMAIN is not set"
  exit 1
fi

if [ -z "$MONGO_EXPOSE_PORT" ]; then
  echo "MONGO_EXPOSE_PORT is not set"
  exit 1
fi

if [ ! -d "$UPLOAD_PATH" ]; then
  echo "Creating directory $UPLOAD_PATH"
  sudo mkdir -p "$UPLOAD_PATH"
fi

# Replace env file to upload directory
if ! cp .env ./upload/ -f; then
  echo "Failed to copy .env file to ./upload/"
  exit 1
fi

# Set permissions for the directory
echo "Setting permissions for $UPLOAD_PATH"
sudo chown -R 1000:1000 "$UPLOAD_PATH"
sudo chmod -R 775 "$UPLOAD_PATH"

# Initialize variables
DOCKER_COMMAND=""
NO_CACHE=""
DETACH=""
BUILD=""

# Check for arguments
for arg in "$@"
do
  case $arg in
    --no-cache)
      NO_CACHE="--no-cache"
      shift
      ;;
    -d)
      DETACH="-d"
      shift
      ;;
    --build)
      BUILD="--build"
      shift
      ;;
    -prod)
      ENV_SUFFIX="prod"
      shift
      ;;
    *)
      # Handle unexpected arguments
      echo "Unknown argument: $arg"
      exit 1
      ;;
  esac
done

# Determine the Docker Compose command based on the -prod flag
if [ "$ENV_SUFFIX" == "prod" ]; then
  DOCKER_COMMAND="docker compose -p ${ENV}-playground-be -f docker-compose.yml -f docker-compose.prod.yml up $BUILD $NO_CACHE $DETACH"
else
  DOCKER_COMMAND="docker compose -p ${ENV}-playground-be -f docker-compose.yml -f docker-compose.dev.yml up $BUILD $NO_CACHE $DETACH"
fi

# Run Docker Compose
echo "Starting Docker Compose with command: $DOCKER_COMMAND"
$DOCKER_COMMAND
