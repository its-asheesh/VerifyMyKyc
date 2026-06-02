# Rate Limiting Analysis - VerifyMyKyc Project

## Executive Summary

This document provides a comprehensive analysis of rate limiting implementation across the backend and client components of the VerifyMyKyc project.

---

## Backend Rate Limiting

### Library Used
- **express-rate-limit** (v8.1.0)
- Location: `backend/src/common/middleware/rateLimiter.ts`

### Rate Limiter Configurations

#### 1. **authLimiter** - Authentication Endpoints
- **Window**: 15 minutes
- **Max Requests**: 5 per IP
- **Endpoints Protected**:
  - `/auth/login`
  - `/auth/logout`
  - `/auth/phone/login`
  - `/auth/login/phone-password`
- **Skip Condition**: Development mode + localhost (127.0.0.1)
- **Message**: "Too many authentication attempts, please try again later"
- **Retry After**: 15 minutes

#### 2. **otpLimiter** - OTP Endpoints (Very Strict)
- **Window**: 15 minutes
- **Max Requests**: 3 per IP
- **Endpoints Protected**:
  - `/auth/send-email-otp`
  - `/auth/verify-email-otp`
  - `/aadhaar/v2/generate-otp`
- **Message**: "Too many OTP requests, please try again after 15 minutes"
- **Retry After**: 15 minutes

#### 3. **passwordResetLimiter** - Password Reset (Very Strict)
- **Window**: 1 hour
- **Max Requests**: 3 per IP
- **Endpoints Protected**:
  - `/auth/password/send-otp`
  - `/auth/password/reset`
  - `/auth/password/reset-phone`
- **Message**: "Too many password reset attempts, please try again after 1 hour"
- **Retry After**: 60 minutes

#### 4. **registerLimiter** - Registration Endpoints
- **Window**: 1 hour
- **Max Requests**: 5 per IP
- **Endpoints Protected**:
  - `/auth/register`
  - `/auth/phone/register`
- **Message**: "Too many registration attempts, please try again later"
- **Retry After**: 60 minutes

#### 5. **apiLimiter** - General API (Moderate)
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Endpoints Protected**:
  - `/aadhaar/v2/submit-otp`
- **Skip Condition**: Development mode + localhost (127.0.0.1)
- **Message**: "Too many requests, please try again later"
- **Retry After**: 15 minutes

#### 6. **verificationLimiter** - Verification Endpoints (Cost Quota)
- **Window**: 1 minute
- **Max Requests**: 20 per IP
- **Status**: ⚠️ **DEFINED BUT NOT USED**
- **Message**: "Too many verification requests, please slow down"
- **Retry After**: 1 minute
- **Note**: This limiter is defined but not applied to any routes

#### 7. **fileUploadLimiter** - File Upload Endpoints
- **Window**: 1 minute
- **Max Requests**: 10 per IP
- **Status**: ⚠️ **DEFINED BUT NOT USED**
- **Message**: "Too many file uploads, please try again later"
- **Retry After**: 1 minute
- **Note**: This limiter is defined but not applied to any routes

### Custom Rate Limiter Factory
- **Function**: `createRateLimiter(options)`
- **Purpose**: Create custom rate limiters with specific configurations
- **Parameters**:
  - `windowMs`: Time window in milliseconds
  - `max`: Maximum requests per window
  - `message`: Optional custom message
  - `skip`: Optional skip function

### Rate Limiter Usage Analysis

#### ✅ Routes WITH Rate Limiting:
1. **Auth Router** (`backend/src/modules/auth/auth.router.ts`)
   - ✅ `/register` - `registerLimiter`
   - ✅ `/login` - `authLimiter`
   - ✅ `/send-email-otp` - `otpLimiter`
   - ✅ `/verify-email-otp` - `otpLimiter`
   - ✅ `/password/send-otp` - `passwordResetLimiter`
   - ✅ `/password/reset` - `passwordResetLimiter`
   - ✅ `/password/reset-phone` - `passwordResetLimiter`
   - ✅ `/logout` - `authLimiter`
   - ✅ `/phone/register` - `registerLimiter`
   - ✅ `/phone/login` - `authLimiter`
   - ✅ `/login/phone-password` - `authLimiter`

2. **Aadhaar Router** (`backend/src/modules/aadhaar/aadhaar.router.ts`)
   - ✅ `/v2/generate-otp` - `otpLimiter`
   - ✅ `/v2/submit-otp` - `apiLimiter`

#### ❌ Routes WITHOUT Rate Limiting:

**Critical Verification Endpoints Missing Rate Limiting:**
1. **PAN Router** (`backend/src/modules/pan/pan.router.ts`)
   - ❌ `/father-name`
   - ❌ `/gstin-by-pan`
   - ❌ `/din-by-pan`
   - ❌ `/cin-by-pan`
   - ❌ `/aadhaar-link`
   - ❌ `/digilocker-init`
   - ❌ `/digilocker-pull`
   - ❌ `/digilocker-fetch-document`
   - ❌ `/fetch-pan-advance`
   - ❌ `/fetch-pan-detailed`

2. **Aadhaar Router** (`backend/src/modules/aadhaar/aadhaar.router.ts`)
   - ❌ `/ocr-v1`
   - ❌ `/ocr-v2` (file upload - should use `fileUploadLimiter`)
   - ❌ `/fetch-eaadhaar`

3. **EPFO Router** (`backend/src/modules/epfo/epfo.router.ts`)
   - ❌ `/fetch-uan`
   - ❌ `/passbook/generate-otp`
   - ❌ `/passbook/validate-otp`
   - ❌ `/passbook/employers`
   - ❌ `/passbook/fetch`
   - ❌ `/employment-history/fetch-by-uan`
   - ❌ `/employment-history/fetch-latest`
   - ❌ `/uan/fetch-by-pan`
   - ❌ `/employer-verify`

4. **MCA Router** (`backend/src/modules/mca/mca.router.ts`)
   - ❌ `/din-by-pan`
   - ❌ `/cin-by-pan`
   - ❌ `/fetch-company`

5. **GSTIN Router** (`backend/src/modules/gstin/gstin.router.ts`)
   - ❌ `/fetch-by-pan`
   - ❌ `/fetch-lite`
   - ❌ `/fetch-contact`

6. **Driving License Router** (`backend/src/modules/drivinglicense/drivinglicense.router.ts`)
   - ❌ `/ocr` (file upload - should use `fileUploadLimiter`)
   - ❌ `/fetch-details`

7. **Voter Router** (`backend/src/modules/voter/voter.router.ts`)
   - ❌ `/boson/fetch`
   - ❌ `/meson/init`
   - ❌ `/meson/fetch`
   - ❌ `/ocr` (file upload - should use `fileUploadLimiter`)

8. **Vehicle Router** (`backend/src/modules/vehicle/vehicle.router.ts`)
   - ❌ `/rc/fetch-lite`
   - ❌ `/rc/fetch-detailed`
   - ❌ `/rc/fetch-detailed-challan`
   - ❌ `/challan/fetch`
   - ❌ `/rc/fetch-reg-num-by-chassis`
   - ❌ `/fastag/fetch-detailed`

### Global Rate Limiting
- **Status**: ❌ **NOT IMPLEMENTED**
- No global rate limiter applied at the application level (`app.ts`)
- Only route-specific rate limiters are used

### Rate Limiter Features
- ✅ Standard headers enabled (`standardHeaders: true`)
- ✅ Legacy headers disabled (`legacyHeaders: false`)
- ✅ Custom error messages with retry-after information
- ✅ Development mode skip for localhost
- ⚠️ No Redis/store configuration (uses in-memory storage)
- ⚠️ No distributed rate limiting (single instance only)

---

## Client-Side Rate Limiting

### Current Implementation

#### 1. **API Base Configuration**
- **File**: `client/src/services/api/baseApi.ts`
- **Timeout**: 30 seconds
- **No Built-in Rate Limiting**: The client does not implement client-side rate limiting
- **No Retry Logic**: No automatic retry mechanism for rate-limited requests

#### 2. **Error Handling**
- **File**: `client/src/services/api/baseApi.ts`
- **Response Interceptor**: Handles 401 (unauthorized) but **NOT 429 (rate limited)**
- **Error Message Extraction**: Extracts backend error messages but doesn't handle rate limit responses specifically

#### 3. **Rate Limit Detection**
- **File**: `client/src/components/verification/AadhaarSection.tsx`
- **Status**: ⚠️ **PARTIAL IMPLEMENTATION**
- **Detection**: Checks for status 429 or "45 seconds" in error message
- **Issue**: Only implemented in one component, not globally

#### 4. **Quota Error Handling**
- **Files**: Multiple verification components
- **Pattern**: Components check for quota/limit errors (status 403 or keywords)
- **Examples**:
  - `EpfoSection.tsx`: Checks for 403 or quota-related keywords
  - Other components: Similar pattern but inconsistent

### Client-Side Gaps

#### ❌ Missing Features:
1. **No Global Rate Limit Handler**
   - No centralized handling of 429 responses
   - Each component handles rate limits individually (if at all)

2. **No Request Throttling**
   - No debouncing or throttling of API calls
   - Users can spam-click submit buttons

3. **No Retry Logic**
   - No automatic retry with exponential backoff
   - No handling of retry-after headers

4. **No Rate Limit State Management**
   - No global state to track rate limit status
   - No UI indicators for rate limit status

5. **No Request Queue**
   - No queuing mechanism for requests
   - No prioritization of requests

---

## Security Analysis

### Backend Security Concerns

#### 🔴 Critical Issues:
1. **Verification Endpoints Unprotected**
   - Most verification endpoints (PAN, EPFO, MCA, GSTIN, etc.) have NO rate limiting
   - These endpoints consume quota/tokens and cost money
   - Vulnerable to abuse and quota exhaustion attacks

2. **File Upload Endpoints Unprotected**
   - File upload endpoints (OCR) have NO rate limiting
   - Large file uploads can consume significant resources
   - `fileUploadLimiter` is defined but not used

3. **No Global Rate Limiting**
   - No baseline protection for all endpoints
   - Attackers can target unprotected routes

4. **In-Memory Storage**
   - Rate limiters use in-memory storage
   - Not suitable for distributed/scaled deployments
   - Rate limits reset on server restart

#### ⚠️ Medium Issues:
1. **Development Mode Bypass**
   - Rate limiting skipped for localhost in development
   - Could be exploited if development server is exposed

2. **IP-Based Limiting Only**
   - Rate limiting based on IP address only
   - No user-based or token-based limiting
   - VPN/proxy can bypass limits

3. **No Rate Limit Headers in Response**
   - While `standardHeaders` is enabled, clients may not be reading them
   - No explicit rate limit information in API responses

### Client Security Concerns

#### ⚠️ Medium Issues:
1. **No Client-Side Protection**
   - No client-side throttling
   - Users can make excessive requests before hitting backend limits

2. **No Rate Limit Feedback**
   - Users don't know when they're approaching rate limits
   - Poor user experience when rate limited

---

## Recommendations

### Backend Recommendations

#### 🔴 High Priority:
1. **Apply Rate Limiting to All Verification Endpoints**
   ```typescript
   // Example for PAN router
   router.post('/fetch-pan-detailed', 
     authenticate, 
     requireUser, 
     verificationLimiter,  // Add this
     fetchPanDetailedHandler
   );
   ```

2. **Apply File Upload Rate Limiting**
   ```typescript
   // Example for Aadhaar OCR
   router.post('/ocr-v2',
     authenticate,
     requireUser,
     fileUploadLimiter,  // Add this
     upload.fields([...]),
     aadhaarOcrV2Handler
   );
   ```

3. **Add Global Rate Limiter**
   ```typescript
   // In app.ts
   import { apiLimiter } from './src/common/middleware/rateLimiter';
   app.use('/api', apiLimiter);  // Apply to all API routes
   ```

4. **Implement Distributed Rate Limiting**
   - Use Redis or similar for rate limit storage
   - Enables rate limiting across multiple server instances
   - Consider using `rate-limiter-flexible` or `express-rate-limit` with Redis store

#### ⚠️ Medium Priority:
1. **Add User-Based Rate Limiting**
   - Implement rate limiting per authenticated user
   - More accurate than IP-based limiting
   - Prevents abuse by authenticated users

2. **Add Rate Limit Headers to Responses**
   - Include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers
   - Helps clients understand rate limit status

3. **Implement Tiered Rate Limiting**
   - Different limits for different user tiers (free, paid, premium)
   - Higher limits for paying customers

4. **Add Rate Limit Logging**
   - Log rate limit violations for security monitoring
   - Track patterns of abuse

### Client Recommendations

#### 🔴 High Priority:
1. **Implement Global Rate Limit Handler**
   ```typescript
   // In baseApi.ts response interceptor
   if (error.response?.status === 429) {
     const retryAfter = error.response.headers['retry-after'];
     // Show user-friendly message
     // Implement retry logic
   }
   ```

2. **Add Request Throttling**
   - Debounce/throttle form submissions
   - Prevent rapid-fire API calls
   - Use libraries like `lodash.debounce` or `lodash.throttle`

3. **Add Rate Limit State Management**
   - Track rate limit status globally
   - Show UI indicators when approaching limits
   - Disable buttons when rate limited

#### ⚠️ Medium Priority:
1. **Implement Retry Logic**
   - Automatic retry with exponential backoff
   - Respect `Retry-After` headers
   - Use libraries like `axios-retry`

2. **Add Request Queue**
   - Queue requests when rate limited
   - Process queue when rate limit resets
   - Prioritize user-initiated actions

3. **Improve Error Messages**
   - User-friendly rate limit error messages
   - Show countdown timers for retry
   - Provide clear instructions

---

## Rate Limit Configuration Summary

| Limiter | Window | Max Requests | Used | Status |
|---------|--------|--------------|------|--------|
| authLimiter | 15 min | 5 | ✅ | Active |
| otpLimiter | 15 min | 3 | ✅ | Active |
| passwordResetLimiter | 1 hour | 3 | ✅ | Active |
| registerLimiter | 1 hour | 5 | ✅ | Active |
| apiLimiter | 15 min | 100 | ⚠️ | Partially Used |
| verificationLimiter | 1 min | 20 | ❌ | **Not Used** |
| fileUploadLimiter | 1 min | 10 | ❌ | **Not Used** |

---

## Conclusion

The project has a **solid foundation** for rate limiting with well-defined limiters, but there are **critical gaps** in implementation:

1. **Most verification endpoints are unprotected** - This is a security and cost risk
2. **File upload endpoints are unprotected** - Resource consumption risk
3. **No global rate limiting** - No baseline protection
4. **Client-side has minimal rate limit handling** - Poor user experience

**Priority Actions:**
1. Apply `verificationLimiter` to all verification endpoints
2. Apply `fileUploadLimiter` to all file upload endpoints
3. Add global rate limiting
4. Implement client-side rate limit handling

---

## Files Analyzed

### Backend:
- `backend/src/common/middleware/rateLimiter.ts`
- `backend/src/modules/auth/auth.router.ts`
- `backend/src/modules/aadhaar/aadhaar.router.ts`
- `backend/src/modules/pan/pan.router.ts`
- `backend/src/modules/epfo/epfo.router.ts`
- `backend/src/modules/mca/mca.router.ts`
- `backend/src/modules/gstin/gstin.router.ts`
- `backend/src/modules/drivinglicense/drivinglicense.router.ts`
- `backend/src/modules/voter/voter.router.ts`
- `backend/src/modules/vehicle/vehicle.router.ts`
- `backend/app.ts`
- `backend/package.json`

### Client:
- `client/src/services/api/baseApi.ts`
- `client/src/components/verification/AadhaarSection.tsx`
- `client/src/components/verification/EpfoSection.tsx`
- `client/src/components/verification/CompanySection.tsx`

---

*Analysis Date: 2024*
*Analyzed by: Auto (Cursor AI)*


