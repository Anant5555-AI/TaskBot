#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing server dependencies..."
npm install --legacy-peer-deps
