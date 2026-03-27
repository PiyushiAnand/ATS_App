#!/bin/bash

# Configuration
BASE_URL="http://localhost:3000/api/merge"
# 💡 Replace these with real MongoDB ObjectIds from your local DB to test properly!
KC_ID="KC1"
ATTEMPT_ID="65f2c1a8e4b0d1a2b3c4d5e6" 

echo "--------------------------------------------------"
echo "🧪 Testing Merge Team APIs"
echo "--------------------------------------------------"

# 📍 1. Test Chapter Metadata
echo -e "\n🔍 [1/3] Testing GET Chapter Metadata for $KC_ID..."
curl -X GET "$BASE_URL/chapters/$KC_ID/metadata" \
     -H "Content-Type: application/json" \
     -w "\n\n📋 HTTP Status: %{http_code}\n"

echo "--------------------------------------------------"

# 📍 2. Test Session Sync (Completed)
echo -e "\n📊 [2/3] Testing POST Session Sync for Attempt: $ATTEMPT_ID..."
curl -X POST "$BASE_URL/sessions/$ATTEMPT_ID/sync" \
     -H "Content-Type: application/json" \
     -d '{
           "session_status": "completed"
         }' \
     -w "\n\n📋 HTTP Status: %{http_code}\n"

echo "--------------------------------------------------"

# 📍 3. Test Midway Exit
echo -e "\n🏃‍♂️ [3/3] Testing POST Midway Exit for Attempt: $ATTEMPT_ID..."
curl -X POST "$BASE_URL/sessions/$ATTEMPT_ID/exit" \
     -H "Content-Type: application/json" \
     -w "\n\n📋 HTTP Status: %{http_code}\n"

echo "--------------------------------------------------"
echo "✅ Testing Complete!"