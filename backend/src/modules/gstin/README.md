# GSTIN Module

This module provides REST APIs for GSTIN (Goods and Services Tax Identification Number) related operations.

## Available APIs

### 1. Fetch GSTIN by PAN
- **Endpoint**: `POST /api/gstin/fetch-by-pan`
- **Description**: Retrieves GSTIN information using PAN (Permanent Account Number)
- **Request Body**:
  ```json
  {
    "pan": "string"
  }
  ```
- **Response**: Returns GSTIN details associated with the PAN

### 2. Fetch GSTIN Lite
- **Endpoint**: `POST /api/gstin/fetch-lite`
- **Description**: Retrieves basic GSTIN information
- **Request Body**:
  ```json
  {
    "gstin": "string",
    "consent": "string"
  }
  ```
- **Response**: Returns basic GSTIN details including legal name, trade name, registration date, etc.

### 3. Fetch GSTIN Contact Details
- **Endpoint**: `POST /api/gstin/fetch-contact`
- **Description**: Retrieves detailed contact information for a GSTIN
- **Request Body**:
  ```json
  {
    "gstin": "string",
    "consent": "string"
  }
  ```
- **Response**: Returns comprehensive contact and business details for the GSTIN

## File Structure

```
gstin/
├── gstin.router.ts          # Route definitions
├── gstin.controller.ts      # Request handlers
├── gstin.service.ts         # Business logic
├── providers/               # External API integrations
│   ├── fetchByPan.provider.ts
│   ├── fetchLite.provider.ts
│   └── fetchContact.provider.ts
└── README.md               # This file
```

## Error Handling

All APIs follow a consistent error handling pattern:
- HTTP errors are wrapped in `HTTPError` class
- Error responses include status code, message, and original error data
- Console logging for debugging purposes

## Dependencies

- `express`: Web framework
- `axios`: HTTP client for external API calls
- Custom error handling middleware 