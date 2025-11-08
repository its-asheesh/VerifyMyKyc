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
  "request_id": "711c97ec-446e-49fc-9ef6-81d823636913",
  "transaction_id": "b4c32946-7fd2-454a-be01-5f2a3bc8a588",
  "reference_id": "498799",
  "status": 200,
  "data": {
    "code": "1000",
    "message": "Bank Account details verified successfully.",
    "bank_account_data": {
      "reference_id": "498799",
      "name": "JOHN DOE",
      "bank_name": "YES BANK",
      "utr": "1387XXXXXXXXXXXXXXXXXXXX",
      "city": "GREATER BOMBAY",
      "branch": "SANTACRUZ, MUMBAI",
      "micr": "4005XXXXX"
    }
  },
  "timestamp": 1623743669011,
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
- Request validation is applied using `bankAccountVerifySchema` (Zod) to ensure:
  - Account number is at least 9 digits
  - IFSC code matches format: `^[A-Z]{4}0[A-Z0-9]{6}$`
  - Consent is either 'Y' or 'N'
- Response structure matches OpenAPI 3.1.0 specification from Gridlines API.


