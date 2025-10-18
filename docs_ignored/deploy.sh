#!/bin/bash
set -e

echo "🚀 Deploying kmaurinjones.dev..."

# Navigate to project directory
cd /home/kmaurinjones/projects/kmaurinjones-dev

# Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull

# Install Node dependencies
echo "📦 Installing Node dependencies..."
npm install

# Sync Python dependencies
echo "🐍 Syncing Python dependencies..."
uv sync

# Build the application
echo "🔨 Building application..."
npm run build

# Copy build to production directory
echo "📋 Copying build to production directory..."
cp -r build/* /home/kmaurinjones/projects/sites/kmaurinjones-dev/

# Ensure proper permissions
echo "🔐 Setting permissions..."
chmod -R o+rX /home/kmaurinjones/projects/sites/kmaurinjones-dev

echo "✅ Deployment complete!"
echo "Site is live at http://kmaurinjones.dev"

