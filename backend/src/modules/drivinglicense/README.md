# Driving License Module

This module provides REST APIs for Driving License related operations.

## Available APIs

### 1. Driving License OCR
- **Endpoint**: `POST /api/drivinglicense/ocr`
- **Description**: Extracts data from images of a driving license (front and optional back).
- **Request**: `multipart/form-data` with fields:
  - `file_front`: front image (required)
  - `file_back`: back image (optional)
  - `consent`: string (required)

### 2. Fetch Driving License Details
- **Endpoint**: `POST /api/drivinglicense/fetch-details`
- **Description**: Fetches driving license details from the RTA database.
- **Request Body**:
  ```json
  {
    "driving_license_number": "string",
    "date_of_birth": "yyyy-mm-dd",
    "consent": "Y"
  }
  ```

## File Structure

```
drivinglicense/
├── drivinglicense.router.ts          # Route definitions
├── drivinglicense.controller.ts      # Request handlers
├── drivinglicense.service.ts         # Business logic
├── providers/                        # External API integrations
│   ├── ocr.provider.ts
│   └── fetchDetails.provider.ts
└── README.md                         # This file
```

## Error Handling

All APIs follow a consistent error handling pattern:
- HTTP errors are wrapped in `HTTPError` class
- Error responses include status code, message, and original error data
- Console logging for debugging purposes 