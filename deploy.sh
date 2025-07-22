#!/bin/bash
# Simple deployment script

echo "🚀 Deploying Payment System to Firebase..."
echo "📦 Building..."
npm run build

echo "🌐 Deploying..."
firebase deploy --only hosting

echo "✅ Deployment Complete!"
echo "🌐 Live at: https://flame-grilled-cafe-pos.web.app"
