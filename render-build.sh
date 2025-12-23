#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing root dependencies..."
npm install

echo "Installing server dependencies..."
npm install --prefix server
