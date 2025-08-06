# Testing GSTIN APIs

This guide provides multiple methods to test the GSTIN APIs we've implemented.

## Prerequisites

1. **Start the server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify server is running**:
   ```bash
   curl http://localhost:5000/health
   # or check if port 5000 is listening
   netstat -tulpn | grep :5000
   ```

## Method 1: cURL Testing

### 1. Test GSTIN Lite API
```bash
curl -X POST http://localhost:5000/api/gstin/fetch-lite \
  -H "Content-Type: application/json" \
  -d '{
    "gstin": "27AAPFU0939F1Z5",
    "consent": "Y"
  }'
```

**Expected Response**:
```json
{
  "request_id": "uuid",
  "transaction_id": "uuid",
  "reference_id": "ref_timestamp_random",
  "status": 200,
  "data": {
    "code": "1005",
    "message": "GSTIN does not exist"
  },
  "timestamp": 1234567890,
  "path": "/gstin-api/fetch-lite"
}
```

### 2. Test GSTIN Contact Details API
```bash
curl -X POST http://localhost:5000/api/gstin/fetch-contact \
  -H "Content-Type: application/json" \
  -d '{
    "gstin": "27AAPFU0939F1Z5",
    "consent": "Y"
  }'
```

### 3. Test GSTIN by PAN API
```bash
curl -X POST http://localhost:5000/api/gstin/fetch-by-pan \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "AAPFU0939F"
  }'
```

## Method 2: Using Postman

### Collection Setup
1. Create a new collection called "GSTIN APIs"
2. Set base URL: `http://localhost:5000`

### Request Examples

#### GSTIN Lite API
- **Method**: POST
- **URL**: `{{base_url}}/api/gstin/fetch-lite`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "gstin": "27AAPFU0939F1Z5",
    "consent": "Y"
  }
  ```

#### GSTIN Contact Details API
- **Method**: POST
- **URL**: `{{base_url}}/api/gstin/fetch-contact`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "gstin": "27AAPFU0939F1Z5",
    "consent": "Y"
  }
  ```

#### GSTIN by PAN API
- **Method**: POST
- **URL**: `{{base_url}}/api/gstin/fetch-by-pan`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "pan": "AAPFU0939F"
  }
  ```

## Method 3: Using JavaScript/Node.js

Create a test file `test-gstin-apis.js`:

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testGstinApis() {
  try {
    // Test GSTIN Lite API
    console.log('Testing GSTIN Lite API...');
    const liteResponse = await axios.post(`${BASE_URL}/api/gstin/fetch-lite`, {
      gstin: '27AAPFU0939F1Z5',
      consent: 'Y'
    });
    console.log('GSTIN Lite Response:', liteResponse.data);

    // Test GSTIN Contact Details API
    console.log('\nTesting GSTIN Contact Details API...');
    const contactResponse = await axios.post(`${BASE_URL}/api/gstin/fetch-contact`, {
      gstin: '27AAPFU0939F1Z5',
      consent: 'Y'
    });
    console.log('GSTIN Contact Response:', contactResponse.data);

    // Test GSTIN by PAN API
    console.log('\nTesting GSTIN by PAN API...');
    const panResponse = await axios.post(`${BASE_URL}/api/gstin/fetch-by-pan`, {
      pan: 'AAPFU0939F'
    });
    console.log('GSTIN by PAN Response:', panResponse.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testGstinApis();
```

Run with:
```bash
node test-gstin-apis.js
```

## Method 4: Using Python

Create a test file `test_gstin_apis.py`:

```python
import requests
import json

BASE_URL = 'http://localhost:5000'

def test_gstin_apis():
    # Test GSTIN Lite API
    print("Testing GSTIN Lite API...")
    lite_data = {
        "gstin": "27AAPFU0939F1Z5",
        "consent": "Y"
    }
    lite_response = requests.post(f"{BASE_URL}/api/gstin/fetch-lite", json=lite_data)
    print(f"Status: {lite_response.status_code}")
    print(f"Response: {json.dumps(lite_response.json(), indent=2)}")

    # Test GSTIN Contact Details API
    print("\nTesting GSTIN Contact Details API...")
    contact_data = {
        "gstin": "27AAPFU0939F1Z5",
        "consent": "Y"
    }
    contact_response = requests.post(f"{BASE_URL}/api/gstin/fetch-contact", json=contact_data)
    print(f"Status: {contact_response.status_code}")
    print(f"Response: {json.dumps(contact_response.json(), indent=2)}")

    # Test GSTIN by PAN API
    print("\nTesting GSTIN by PAN API...")
    pan_data = {
        "pan": "AAPFU0939F"
    }
    pan_response = requests.post(f"{BASE_URL}/api/gstin/fetch-by-pan", json=pan_data)
    print(f"Status: {pan_response.status_code}")
    print(f"Response: {json.dumps(pan_response.json(), indent=2)}")

if __name__ == "__main__":
    test_gstin_apis()
```

Run with:
```bash
python test_gstin_apis.py
```

## Method 5: Automated Test Script

Create a shell script `test-apis.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "=== Testing GSTIN APIs ==="
echo ""

# Test GSTIN Lite API
echo "1. Testing GSTIN Lite API..."
curl -X POST "$BASE_URL/api/gstin/fetch-lite" \
  -H "Content-Type: application/json" \
  -d '{"gstin": "27AAPFU0939F1Z5", "consent": "Y"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "2. Testing GSTIN Contact Details API..."
curl -X POST "$BASE_URL/api/gstin/fetch-contact" \
  -H "Content-Type: application/json" \
  -d '{"gstin": "27AAPFU0939F1Z5", "consent": "Y"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "3. Testing GSTIN by PAN API..."
curl -X POST "$BASE_URL/api/gstin/fetch-by-pan" \
  -H "Content-Type: application/json" \
  -d '{"pan": "AAPFU0939F"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "=== Testing Complete ==="
```

Make executable and run:
```bash
chmod +x test-apis.sh
./test-apis.sh
```

## Expected Results

### ✅ Successful Response (GSTIN Lite)
- Status: 200
- JSON response with proper structure
- Contains request_id, transaction_id, status, data, etc.

### ❌ Error Responses
- **External API Issues**: When external service is unavailable
- **Validation Errors**: When required fields are missing
- **Invalid Data**: When GSTIN/PAN format is incorrect

## Troubleshooting

### Common Issues:

1. **Server not running**:
   ```bash
   # Check if server is running
   ps aux | grep node
   # Restart server
   cd backend && npm run dev
   ```

2. **Port already in use**:
   ```bash
   # Check what's using port 5000
   lsof -i :5000
   # Kill process if needed
   kill -9 <PID>
   ```

3. **External API issues**:
   - Check environment variables: `GRIDLINES_BASE_URL`, `GRIDLINES_API_KEY`
   - Verify external API service is running
   - Check network connectivity

4. **CORS issues** (if testing from browser):
   - Add CORS headers to requests
   - Use appropriate Content-Type headers

## Validation Testing

Test with invalid data to ensure proper error handling:

```bash
# Test with missing required fields
curl -X POST http://localhost:5000/api/gstin/fetch-lite \
  -H "Content-Type: application/json" \
  -d '{"gstin": "27AAPFU0939F1Z5"}'

# Test with invalid GSTIN format
curl -X POST http://localhost:5000/api/gstin/fetch-lite \
  -H "Content-Type: application/json" \
  -d '{"gstin": "INVALID", "consent": "Y"}'

# Test with missing consent
curl -X POST http://localhost:5000/api/gstin/fetch-contact \
  -H "Content-Type: application/json" \
  -d '{"gstin": "27AAPFU0939F1Z5"}'
``` 