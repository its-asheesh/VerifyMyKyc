# Bank Account Verification APIs - Implementation Status

## Comparison: OpenAPI 3.1.0 Specification vs Current Implementation

### ✅ Implemented APIs

| OpenAPI Endpoint | Backend Route | Frontend API | Status | Notes |
|-----------------|---------------|--------------|--------|-------|
| `POST /bank-api/verify` | `POST /api/bankaccount/verify` | `bankApi.verifyAccount()` | ✅ Complete | Validated, matches spec |

---

### ❌ Missing APIs (Backend + Frontend)

| OpenAPI Endpoint | OpenAPI Method | Backend Status | Frontend Status | Priority |
|------------------|----------------|----------------|-----------------|----------|
| `POST /bank-api/verify-ifsc` | POST | ❌ Not implemented | ⚠️ TODO comment | High |
| `POST /bank-api/v2/verify` | POST | ❌ Not implemented | ❌ Not implemented | High |
| `POST /bank-api/verify/hybrid` | POST | ❌ Not implemented | ❌ Not implemented | High |
| `POST /bank-api/verify/penniless` | POST | ❌ Not implemented | ❌ Not implemented | Medium |
| `POST /bank-api/cheque/ocr` | POST (multipart) | ❌ Not implemented | ❌ Not implemented | Medium |
| `POST /bank-api/statement/ocr` | POST (multipart) | ❌ Not implemented | ❌ Not implemented | Medium |
| `POST /bank-api/bank-statement-analyzer/upload` | POST (multipart) | ❌ Not implemented | ❌ Not implemented | Low |
| `GET /bank-api/bank-statement-analyzer/fetch-report` | GET | ❌ Not implemented | ❌ Not implemented | Low |
| `GET /bank-api/rpd/init` | GET | ❌ Not implemented | ❌ Not implemented | Medium |
| `GET /bank-api/rpd/status` | GET | ❌ Not implemented | ❌ Not implemented | Medium |
| `POST /bank-api/account/fetch-by-mobile` | POST | ❌ Not implemented | ❌ Not implemented | Low |
| `POST /bank-api/account/fetch-by-upi` | POST | ❌ Not implemented | ❌ Not implemented | Low |
| `POST /bank-api/salary-slip/ocr` | POST | ❌ Not implemented | ❌ Not implemented | Low |

---

### ⚠️ Partially Implemented APIs

| OpenAPI Endpoint | Frontend API | Backend Status | Issue |
|------------------|--------------|---------------|-------|
| `POST /bank-api/verify-upi` | `bankApi.verifyUpi()` | ❌ Missing | Frontend has TODO comment, backend route doesn't exist |
| IFSC Validation | `bankApi.validateIfsc()` | ❌ Missing | Frontend has TODO comment, backend route doesn't exist |

**Note:** The OpenAPI spec shows `/bank-api/verify-ifsc` but frontend uses `/bank/validate-ifsc`. These need to be aligned.

---

## Detailed Implementation Gaps

### 1. IFSC Validation API (`/bank-api/verify-ifsc`)

**OpenAPI Spec:**
- **Endpoint:** `POST /bank-api/verify-ifsc`
- **Request:** `{ ifsc: string, consent: 'Y' | 'N' }`
- **Response:** Includes `bank_ifsc_data` with bank name, branch, address, payment channels, etc.

**Current Status:**
- ❌ Backend: No route, controller, service, or provider
- ⚠️ Frontend: `bankApi.validateIfsc()` exists but has TODO comment
- ❌ Frontend: Calls `/bank/validate-ifsc` (wrong endpoint - should be `/bankaccount/verify-ifsc`)

---

### 2. UPI Verification API (`/bank-api/verify-upi`)

**OpenAPI Spec:**
- **Endpoint:** `POST /bank-api/verify-upi` (mentioned in requestBodies)
- **Request:** `{ upi: string, consent: 'Y' | 'N' }`
- **Response:** Includes `upi_data` with name

**Current Status:**
- ❌ Backend: No route, controller, service, or provider
- ⚠️ Frontend: `bankApi.verifyUpi()` exists but has TODO comment
- ❌ Frontend: Calls `/bank/verify-upi` (wrong endpoint - should be `/bankaccount/verify-upi`)

---

### 3. Bank Account Verification V2 (`/bank-api/v2/verify`)

**OpenAPI Spec:**
- **Endpoint:** `POST /bank-api/v2/verify`
- **Request:** Same as v1 (`account_number`, `ifsc`, `consent`)
- **Response:** Different structure - uses `bank_account_verification_data` with `name` and `utr` only

**Current Status:**
- ❌ Backend: Not implemented
- ❌ Frontend: Not implemented

---

### 4. Hybrid Verification (`/bank-api/verify/hybrid`)

**OpenAPI Spec:**
- **Endpoint:** `POST /bank-api/verify/hybrid`
- **Description:** Uses both Penny drop and Penniless BAV channels
- **Response:** Includes `account_status` and `npci_response_code`

**Current Status:**
- ❌ Backend: Not implemented
- ❌ Frontend: Not implemented

---

### 5. Penniless Verification (`/bank-api/verify/penniless`)

**OpenAPI Spec:**
- **Endpoint:** `POST /bank-api/verify/penniless`
- **Description:** Cost-efficient verification without fund transfer
- **Response:** Similar to v1 but without UTR

**Current Status:**
- ❌ Backend: Not implemented
- ❌ Frontend: Not implemented

---

### 6. OCR APIs

#### Cheque OCR (`/bank-api/cheque/ocr`)
- **Method:** POST (multipart/form-data)
- **Request:** File upload + consent
- **Response:** Extracts account number, IFSC, MICR, name, bank name, branch
- **Status:** ❌ Not implemented

#### Statement OCR (`/bank-api/statement/ocr`)
- **Method:** POST (multipart/form-data)
- **Request:** File upload + consent
- **Response:** Extracts comprehensive account details
- **Status:** ❌ Not implemented

#### Salary Slip OCR (`/bank-api/salary-slip/ocr`)
- **Method:** POST
- **Request:** `file_url` or `base64_data` + consent
- **Response:** Extracts salary slip details
- **Status:** ❌ Not implemented

---

### 7. Reverse Penny Drop (RPD) APIs

#### RPD Initiate (`/bank-api/rpd/init`)
- **Method:** GET
- **Query:** `consent=Y`
- **Response:** Returns UPI intent links and QR code
- **Status:** ❌ Not implemented

#### RPD Status (`/bank-api/rpd/status`)
- **Method:** GET
- **Header:** `X-Transaction-ID`
- **Response:** Returns transaction status and bank account details
- **Status:** ❌ Not implemented

---

### 8. Bank Statement Analyzer APIs

#### Upload Statement (`/bank-api/bank-statement-analyzer/upload`)
- **Method:** POST (multipart/form-data)
- **Request:** PDF file, optional bank_name, password, consent
- **Response:** Returns transaction_id for report generation
- **Status:** ❌ Not implemented

#### Fetch Report (`/bank-api/bank-statement-analyzer/fetch-report`)
- **Method:** GET
- **Header:** `X-Transaction-ID`
- **Response:** Returns Excel/JSON report links
- **Status:** ❌ Not implemented

---

### 9. Account Fetch APIs

#### Fetch by Mobile (`/bank-api/account/fetch-by-mobile`)
- **Method:** POST
- **Request:** `{ mobile_number: string, consent: 'Y' | 'N' }`
- **Response:** Returns bank account details linked to mobile number
- **Status:** ❌ Not implemented

#### Fetch by UPI (`/bank-api/account/fetch-by-upi`)
- **Method:** POST
- **Request:** `{ upi: string, consent: 'Y' | 'N' }`
- **Response:** Returns bank account details linked to UPI ID
- **Status:** ❌ Not implemented

---

## Frontend-Backend Endpoint Mismatches

| Frontend Endpoint | Should Be | Current Backend |
|-------------------|------------|-----------------|
| `/bank/validate-ifsc` | `/bankaccount/verify-ifsc` | ❌ Doesn't exist |
| `/bank/verify-upi` | `/bankaccount/verify-upi` | ❌ Doesn't exist |
| `/bank/verify-account` | `/bankaccount/verify` | ✅ Matches (but frontend uses wrong path) |

**Note:** Frontend `bankServices.ts` uses `/bank/verify-account` but actual API calls use `/bankaccount/verify` ✅

---

## Type Definitions Status

### Backend Types (`backend/src/common/types/bank.d.ts`)
- ✅ `BankAccountVerifyRequest` - Complete
- ✅ `BankAccountVerifyResponse` - Complete (updated to match spec)
- ✅ `BankAccountData` - Complete (updated to match spec)
- ❌ Missing: `IfscValidateRequest`, `IfscValidateResponse`
- ❌ Missing: `UpiVerifyRequest`, `UpiVerifyResponse`
- ❌ Missing: All other API request/response types

### Frontend Types (`client/src/types/kyc.ts`)
- ✅ `BankAccountVerifyRequest` - Complete
- ⚠️ `BankAccountVerifyResponse` - Missing `request_id`, `transaction_id`, `reference_id`
- ✅ `BankAccountData` - Complete
- ✅ `IfscValidateRequest`, `IfscValidateResponse` - Basic (needs refinement)
- ✅ `UpiVerifyRequest`, `UpiVerifyResponse` - Basic (needs refinement)
- ❌ Missing: All other API request/response types

---

## Validation Schema Status

### Backend (`backend/src/common/validation/schemas.ts`)
- ✅ `bankAccountVerifySchema` - Complete (with IFSC transformation)
- ❌ Missing: `ifscValidateSchema`
- ❌ Missing: `upiVerifySchema`
- ❌ Missing: All other validation schemas

---

## Recommendations

### High Priority (Core Features)
1. **Implement IFSC Validation API** (`/bankaccount/verify-ifsc`)
   - Backend route, controller, service, provider
   - Update frontend to use correct endpoint
   - Add validation schema

2. **Implement UPI Verification API** (`/bankaccount/verify-upi`)
   - Backend route, controller, service, provider
   - Update frontend to use correct endpoint
   - Add validation schema

3. **Fix Frontend Type Definitions**
   - Update `BankAccountVerifyResponse` to include `request_id`, `transaction_id`, `reference_id`
   - Make `timestamp` and `path` required

### Medium Priority (Enhanced Features)
4. Implement V2, Hybrid, and Penniless verification APIs
5. Implement OCR APIs (Cheque, Statement, Salary Slip)
6. Implement RPD APIs

### Low Priority (Advanced Features)
7. Implement Bank Statement Analyzer APIs
8. Implement Account Fetch APIs

---

## Summary

**Total APIs in OpenAPI Spec:** 14
**Implemented:** 1 (7%)
**Partially Implemented:** 2 (14%)
**Missing:** 11 (79%)

**Critical Issues:**
- Only 1 API fully implemented
- Frontend has wrong endpoint paths for IFSC and UPI
- Missing type definitions for most APIs
- Missing validation schemas for most APIs

