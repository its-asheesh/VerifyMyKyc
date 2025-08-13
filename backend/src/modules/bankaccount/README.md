# Bank Account Verification Module

Provides REST API to verify bank account details using account number and IFSC.

## Endpoint

- POST `/api/bankaccount/verify`

### Request Body
```json
{
  "account_number": "string",
  "ifsc": "string",
  "consent": "Y"
}
```

### Response (example)
```json
{
  "status": 200,
  "data": {
    "code": "1000",
    "message": "Bank Account details verified successfully.",
    "bank_account_data": {
      "name": "JOHN DOE",
      "bank_name": "YES BANK",
      "ifsc": "YESB0XXXXXX"
    }
  },
  "timestamp": 123456789,
  "path": "/bank-api/verify"
}
```

## File Structure
```
bankaccount/
  bankaccount.router.ts
  bankaccount.controller.ts
  bankaccount.service.ts
  providers/
    verify.provider.ts
```

## Notes
- Uses shared `apiClient` which expects `GRIDLINES_BASE_URL` and `GRIDLINES_API_KEY` env vars.
- Errors are thrown via `HTTPError` and handled by the global middleware.


