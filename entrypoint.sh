#!/bin/sh
set -e

# ============================================
# Runtime Environment Configuration Generator
# ============================================
# 
# Script ini akan:
# 1. Membaca environment variables dari Docker/Compose
# 2. Generate env.js dari template dengan nilai yang sesuai
# 3. Menjalankan nginx sebagai PID 1
#
# Dijalankan setiap kali container start, bukan saat build
# ============================================

echo "🔧 Generating runtime environment configuration..."

# Check if template exists
if [ ! -f /usr/share/nginx/html/env.template.js ]; then
  echo "❌ ERROR: env.template.js not found!"
  exit 1
fi

# Set default value if not provided
API_URL=${API_URL:-"http://localhost:8080"}

echo "📝 API_URL: $API_URL"

# Generate env.js from template using envsubst
envsubst < /usr/share/nginx/html/env.template.js \
  > /usr/share/nginx/html/env.js

# Verify env.js was created
if [ ! -f /usr/share/nginx/html/env.js ]; then
  echo "❌ ERROR: Failed to generate env.js!"
  exit 1
fi

echo "✅ Environment configuration generated successfully"
echo "📄 Content of env.js:"
cat /usr/share/nginx/html/env.js

# Execute the main command (nginx)
# This ensures nginx becomes PID 1 and handles signals properly
echo "🚀 Starting nginx..."
exec "$@"