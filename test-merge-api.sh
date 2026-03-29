#!/bin/bash

# --- ⚙️ CONFIGURATION ---
BASE_URL="https://ats-app-2.onrender.com/api/merge"

KC_ID="KC1"
SESSION_ID="69c6c49c30adf203eec3968f" 

# Detect if json_pp is available to pretty-print JSON responses
PRETTIFY=""
if command -v json_pp >/dev/null 2>&1; then
    PRETTIFY=" | json_pp"
fi

echo "=================================================="
echo "🧪 Testing Merge Team APIs via Render Analytics"
echo "🌐 URL: $BASE_URL"
echo "=================================================="

# 📍 1. Test Chapter Metadata
echo -e "\n🔍 [1/3] Testing GET Chapter Metadata for $KC_ID..."
RESPONSE=$(curl -s -X GET "$BASE_URL/chapters/metadata" \
     -H "Content-Type: application/json")

if [ -n "$PRETTIFY" ]; then
    echo "$RESPONSE" | json_pp
else
    echo "$RESPONSE"
fi

echo -e "\n--------------------------------------------------"

# 📍 2. Test Session Sync (Simulated compute)
echo -e "\n📊 [2/3] Testing POST Session Interaction Sync for Session: $SESSION_ID..."
RESPONSE=$(curl -s -X POST "$BASE_URL/sessions/$SESSION_ID/sync" \
     -H "Content-Type: application/json" \
     -d '{
           "session_status": "completed"
         }')

if [ -n "$PRETTIFY" ]; then
    echo "$RESPONSE" | json_pp
else
    echo "$RESPONSE"
fi

echo -e "\n--------------------------------------------------"

# 📍 3. Test Midway Exit Context
echo -e "\n🏃‍♂️ [3/3] Testing POST Midway Exit Window for Session: $SESSION_ID..."
RESPONSE=$(curl -s -X POST "$BASE_URL/sessions/$SESSION_ID/exit" \
     -H "Content-Type: application/json")

if [ -n "$PRETTIFY" ]; then
    echo "$RESPONSE" | json_pp
else
    echo "$RESPONSE"
fi

echo -e "\n=================================================="
echo "✅ Testing Suite Complete!"
echo "=================================================="