# Aadhaar V2 Implementation - QuickEKYC

## Overview

This document describes the new Aadhaar V2 verification implementation using QuickEKYC API, replacing the previous Gridlines integration.

## API Endpoints

### 1. Generate OTP v2
**Endpoint:** `POST /api/aadhaar/v2/generate-otp`

**Description:** Generates an OTP for Aadhaar verification. There's a 45-second cooldown for the same Aadhaar number.

**Authentication:** Required (JWT token)

**Rate Limit:** 3 requests per 15 minutes (OTP limiter)

**Request Body:**
```json
{
  "id_number": "123456789012",
  "consent": "Y"
}
```

**Response (Success - 200):**
```json
{
  "data": {
    "otp_sent": true,
    "if_number": true,
    "valid_aadhaar": true
  },
  "status_code": 200,
  "message": "OTP Sent.",
  "status": "success",
  "request_id": 58
}
```

**Response (Rate Limit - 429):**
```json
{
  "success": false,
  "message": "Please wait 45 seconds before requesting another OTP for the same Aadhaar number",
  "retryAfter": 45
}
```

---

### 2. Submit OTP v2
**Endpoint:** `POST /api/aadhaar/v2/submit-otp`

**Description:** Submits OTP received on mobile for Aadhaar verification and retrieves Aadhaar details.

**Authentication:** Required (JWT token)

**Rate Limit:** 100 requests per 15 minutes (API limiter)

**Request Body:**
```json
{
  "request_id": "58",
  "otp": "123456",
  "consent": "Y",
  "client_id": "optional-client-id"
}
```

**Response (Success - 200):**
```json
{
  "data": {
    "aadhaar_number": "123456789012",
    "dob": "1990-01-15",
    "zip": "110001",
    "full_name": "JOHN DOE",
    "gender": "M",
    "address": {
      "dist": "Central Delhi",
      "house": "123",
      "country": "India",
      "subdist": "New Delhi",
      "vtc": "New Delhi",
      "po": "New Delhi",
      "state": "Delhi",
      "street": "Main Street",
      "loc": "Connaught Place"
    },
    "client_id": "unique-id",
    "profile_image": "base64-string",
    "zip_data": "https://url-to-zip",
    "raw_xml": "https://url-to-xml",
    "share_code": "share-code",
    "care_of": "C/O Someone"
  },
  "status_code": 200,
  "message": "Verification successful",
  "status": "success",
  "request_id": 58
}
```

**Response (Error - 400):**
```json
{
  "status_code": 200,
  "status": "error",
  "message": "Invalid request",
  "data": {},
  "request_id": 100001
}
```

---

## Implementation Details

### File Structure:
```
aadhaar/
├── providers/
│   ├── generateOtpV2.provider.ts    # QuickEKYC Generate OTP
│   └── submitOtpV2.provider.ts       # QuickEKYC Submit OTP
├── aadhaar.service.ts                # Service layer
├── aadhaar.controller.ts            # Controller handlers
└── aadhaar.router.ts                # Route definitions
```

### Provider Layer:
- **generateOtpV2Provider**: Handles OTP generation API call
- **submitOtpV2Provider**: Handles OTP submission and data retrieval

### Service Layer:
- **generateOtpV2**: Service method for OTP generation
- **submitOtpV2**: Service method for OTP submission

### Controller Layer:
- **generateOtpV2Handler**: Controller handler with quota management
- **submitOtpV2Handler**: Controller handler with quota management

---

## Configuration

### Environment Variables:

Add to `.env` file:

```env
# QuickEKYC API Configuration
QUICKEKYC_API_KEY=your-api-key-here
QUICKEKYC_BASE_URL=https://api.quickekyc.com
```

**Note:** `QUICKEKYC_BASE_URL` is optional and defaults to `https://api.quickekyc.com`

---

## Features

### 1. Input Validation
- ✅ Aadhaar number validated (12 digits)
- ✅ OTP validated (6 digits)
- ✅ Request ID validated
- ✅ Automatic input sanitization

### 2. Rate Limiting
- ✅ OTP generation: 3 requests per 15 minutes
- ✅ OTP submission: 100 requests per 15 minutes
- ✅ Prevents abuse and brute force

### 3. Security
- ✅ Authentication required
- ✅ Quota management per user
- ✅ Input sanitization
- ✅ Error handling

### 4. Error Handling
- ✅ Specific error for rate limit (429)
- ✅ Invalid OTP handling (400)
- ✅ Standardized error responses

---

## Usage Flow

### Step 1: Generate OTP
```typescript
// Frontend request
POST /api/aadhaar/v2/generate-otp
{
  "id_number": "123456789012",
  "consent": "Y"
}

// Response
{
  "data": {
    "otp_sent": true,
    "if_number": true,
    "valid_aadhaar": true
  },
  "request_id": 58
}
```

### Step 2: User Enters OTP
User receives OTP on registered mobile number and enters it.

### Step 3: Submit OTP
```typescript
// Frontend request
POST /api/aadhaar/v2/submit-otp
{
  "request_id": "58",
  "otp": "123456",
  "consent": "Y"
}

// Response
{
  "data": {
    "aadhaar_number": "123456789012",
    "full_name": "JOHN DOE",
    "dob": "1990-01-15",
    // ... full Aadhaar details
  }
}
```

---

## Error Scenarios

### 1. Rate Limit (429)
**Trigger:** Requesting OTP within 45 seconds for same Aadhaar number

**Response:**
```json
{
  "success": false,
  "message": "Please wait 45 seconds before requesting another OTP for the same Aadhaar number",
  "retryAfter": 45
}
```

### 2. Invalid OTP (400)
**Trigger:** Wrong OTP or expired request_id

**Response:**
```json
{
  "status_code": 200,
  "status": "error",
  "message": "Invalid request",
  "data": {}
}
```

### 3. Missing API Key (500)
**Trigger:** QUICKEKYC_API_KEY not configured

**Response:**
```json
{
  "message": "QUICKEKYC_API_KEY is not configured",
  "status": 500
}
```

---

## Migration from Legacy

### Legacy Endpoints (Still Available):
- `/api/aadhaar/ocr-v1` - Base64 image OCR
- `/api/aadhaar/ocr-v2` - File upload OCR
- `/api/aadhaar/fetch-eaadhaar` - e-Aadhaar fetch

### New Endpoints (Recommended):
- `/api/aadhaar/v2/generate-otp` - Generate OTP
- `/api/aadhaar/v2/submit-otp` - Submit OTP and get details

---

## Testing

### Test Generate OTP:
```bash
curl -X POST http://localhost:5000/api/aadhaar/v2/generate-otp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_number": "123456789012",
    "consent": "Y"
  }'
```

### Test Submit OTP:
```bash
curl -X POST http://localhost:5000/api/aadhaar/v2/submit-otp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "58",
    "otp": "123456",
    "consent": "Y"
  }'
```

---

## Notes

1. **45-Second Cooldown:** QuickEKYC enforces a 45-second wait between OTP requests for the same Aadhaar number.

2. **Quota Management:** Each verification consumes user quota managed by BaseController.

3. **Consent:** Consent is required and validated in the controller before processing.

4. **Request ID:** The `request_id` from Generate OTP response must be used in Submit OTP request.

5. **Data Format:** Date of birth is returned in `yyyy-mm-dd` format.

---

## Support

For issues or questions:
1. Check environment variables are set correctly
2. Verify API key is valid
3. Check rate limit headers in response
4. Review error logs for detailed error messages

