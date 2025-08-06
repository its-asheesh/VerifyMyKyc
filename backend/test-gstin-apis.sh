#!/bin/bash

BASE_URL="http://localhost:5000"

echo "=== Testing GSTIN APIs ==="
echo "Server: $BASE_URL"
echo ""

# Test GSTIN Lite API
echo "1. Testing GSTIN Lite API..."
echo "Request: POST /api/gstin/fetch-lite"
echo "Payload: {\"gstin\": \"27AAPFU0939F1Z5\", \"consent\": \"Y\"}"
echo "Response:"
curl -X POST "$BASE_URL/api/gstin/fetch-lite" \
  -H "Content-Type: application/json" \
  -d '{"gstin": "27AAPFU0939F1Z5", "consent": "Y"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""

# Test GSTIN Contact Details API
echo "2. Testing GSTIN Contact Details API..."
echo "Request: POST /api/gstin/fetch-contact"
echo "Payload: {\"gstin\": \"27AAPFU0939F1Z5\", \"consent\": \"Y\"}"
echo "Response:"
curl -X POST "$BASE_URL/api/gstin/fetch-contact" \
  -H "Content-Type: application/json" \
  -d '{"gstin": "27AAPFU0939F1Z5", "consent": "Y"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""

# Test GSTIN by PAN API
echo "3. Testing GSTIN by PAN API..."
echo "Request: POST /api/gstin/fetch-by-pan"
echo "Payload: {\"pan\": \"AAPFU0939F\"}"
echo "Response:"
curl -X POST "$BASE_URL/api/gstin/fetch-by-pan" \
  -H "Content-Type: application/json" \
  -d '{"pan": "AAPFU0939F"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""

echo "=== Testing Complete ==="
echo ""
echo "Note: External API errors are expected if the Gridlines service is not configured."
echo "The important thing is that our APIs are responding correctly." 