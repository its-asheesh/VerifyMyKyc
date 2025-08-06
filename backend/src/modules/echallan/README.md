# E-Challan Module

This module provides a REST API for fetching E-Challan details for a vehicle using RC, chassis, and engine numbers.

## Available API

### 1. Fetch E-Challan
- **Endpoint**: `POST /api/echallan/fetch`
- **Description**: Fetches challan details for a vehicle from the external Gridlines API.
- **Request Body**:
  ```json
  {
    "rc_number": "AB10A9999",
    "chassis_number": "ABCDEF12345",
    "engine_number": "ABCDEF12345",
    "consent": "Y"
  }
  ```

## File Structure

```
echallan/
├── echallan.router.ts          # Route definitions
├── echallan.controller.ts      # Request handler
├── echallan.service.ts         # Business logic
├── providers/                  # External API integration
│   └── fetch.provider.ts
└── README.md                   # This file
```

## Error Handling

- HTTP errors are wrapped in `HTTPError` class
- Error responses include status code, message, and original error data
- Console logging for debugging purposes 