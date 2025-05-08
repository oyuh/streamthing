#!/bin/bash

# Script to migrate from npm to pnpm

echo "🚀 Starting migration from npm to pnpm..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm globally..."
    npm install -g pnpm
else
    echo "✅ pnpm is already installed"
fi

# Remove node_modules and package-lock.json
echo "🧹 Cleaning up npm artifacts..."
rm -rf node_modules
if [ -f package-lock.json ]; then
    rm package-lock.json
    echo "  ✓ Removed package-lock.json"
else
    echo "  ✓ No package-lock.json found"
fi

# Install dependencies with pnpm
echo "📦 Installing dependencies with pnpm..."
pnpm install

# Done
echo "✅ Migration complete! You can now use pnpm commands:"
echo "  • pnpm dev          - Start development server"
echo "  • pnpm build        - Build for production"
echo "  • pnpm start        - Start production server"
echo "  • pnpm add <pkg>    - Add a dependency"

echo ""
echo "🔍 Remember to commit the pnpm-lock.yaml file to your repository"
echo "🎵 Your Streamthing project is now using pnpm! 🎉"
