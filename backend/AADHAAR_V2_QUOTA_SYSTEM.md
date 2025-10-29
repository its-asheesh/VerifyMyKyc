# Aadhaar V2 Quota System - Updated ✅

## 🎯 Problem Solved

**Before:** Quota was consumed twice - once when generating OTP and once when submitting OTP.

**After:** Quota is consumed **ONLY** after successful OTP verification (complete verification).

---

## ✅ Changes Made

### 1. Generate OTP Endpoint (`/api/aadhaar/v2/generate-otp`)
- ✅ **Checks quota exists** (validates user has quota available)
- ✅ **Does NOT consume quota** (quota remains available)
- ✅ Validates input (Aadhaar number, consent)
- ✅ Generates OTP if quota check passes
- ✅ Returns error if no quota available

### 2. Submit OTP Endpoint (`/api/aadhaar/v2/submit-otp`)
- ✅ **Checks quota exists** (validates user has quota available)
- ✅ **Verifies OTP** with QuickEKYC API
- ✅ **Consumes quota ONLY if verification successful**
- ✅ If OTP is invalid or verification fails, quota is NOT consumed
- ✅ Returns error if no quota available (before attempting verification)

---

## 🔄 Flow Diagram

### Previous Flow (❌ Consumed 2 Tokens):
```
1. User enters Aadhaar → Generate OTP
   └─> ✅ Quota Consumed (Token 1)

2. User enters OTP → Submit OTP
   └─> ✅ Quota Consumed (Token 2)

Total: 2 tokens consumed
```

### New Flow (✅ Consumes 1 Token):
```
1. User enters Aadhaar → Generate OTP
   └─> ✅ Quota Checked (no consumption)
   └─> ✅ OTP Generated

2. User enters OTP → Submit OTP
   └─> ✅ Quota Checked
   └─> ✅ OTP Verified
   └─> ✅ Quota Consumed (ONLY if verification successful)

Total: 1 token consumed (only after successful verification)
```

---

## 📋 Implementation Details

### Generate OTP Handler:
```typescript
generateOtpV2Handler = asyncHandler(async (req, res) => {
  // 1. Validate input
  // 2. Check quota exists (don't consume)
  const order = await ensureVerificationQuota(userId, 'aadhaar');
  if (!order) {
    return res.status(403).json({ message: 'Quota exhausted' });
  }
  
  // 3. Generate OTP (quota NOT consumed here)
  const result = await service.generateOtpV2({ id_number });
  
  // 4. Return result (quota still available)
  res.json(result);
});
```

### Submit OTP Handler:
```typescript
submitOtpV2Handler = asyncHandler(async (req, res) => {
  // 1. Validate input
  // 2. Check quota exists
  const order = await ensureVerificationQuota(userId, 'aadhaar');
  if (!order) {
    return res.status(403).json({ message: 'Quota exhausted' });
  }
  
  // 3. Verify OTP
  const result = await service.submitOtpV2({ request_id, otp, client_id });
  
  // 4. Consume quota ONLY if verification successful
  if (result.status === 'success' && result.data?.aadhaar_number) {
    await consumeVerificationQuota(order);
    this.logQuotaConsumption(order, 'Aadhaar V2');
  }
  
  // 5. Return result
  res.json(result);
});
```

---

## ✨ Benefits

### 1. **Fair Quota Usage**
- ✅ Users only charged for successful verifications
- ✅ Failed OTP attempts don't consume quota
- ✅ Invalid OTP doesn't waste tokens

### 2. **Better User Experience**
- ✅ Users can retry OTP without losing quota
- ✅ Quota check prevents starting verification without quota
- ✅ Clear error messages when quota exhausted

### 3. **Cost Efficiency**
- ✅ No wasted tokens on failed attempts
- ✅ Quota reserved but not consumed until success
- ✅ Prevents double charging

---

## 🔒 Quota Check Logic

### Generate OTP:
1. Checks if user has available quota
2. If no quota → Returns 403 error immediately
3. If quota exists → Generates OTP (quota reserved but not consumed)
4. User can generate multiple OTPs for same Aadhaar (with rate limits) without consuming quota

### Submit OTP:
1. Checks if user has available quota
2. If no quota → Returns 403 error immediately
3. If quota exists → Verifies OTP
4. If OTP valid and verification successful → Consumes 1 token
5. If OTP invalid or verification fails → Quota NOT consumed

---

## 📊 Scenarios

### Scenario 1: Successful Verification
```
1. Generate OTP → Quota checked ✅, NOT consumed
2. Submit OTP (valid) → Quota checked ✅, Verification success ✅, Quota consumed ✅
Result: 1 token consumed
```

### Scenario 2: Invalid OTP
```
1. Generate OTP → Quota checked ✅, NOT consumed
2. Submit OTP (invalid) → Quota checked ✅, Verification failed ❌, Quota NOT consumed
Result: 0 tokens consumed (user can retry)
```

### Scenario 3: User Retries OTP
```
1. Generate OTP → Quota checked ✅, NOT consumed
2. Submit OTP (invalid) → Quota checked ✅, Verification failed ❌, Quota NOT consumed
3. User corrects OTP → Submit OTP (valid) → Quota checked ✅, Verification success ✅, Quota consumed ✅
Result: 1 token consumed (only on success)
```

### Scenario 4: No Quota Available
```
1. Generate OTP → Quota check ❌, Returns 403 error
OR
2. Submit OTP → Quota check ❌, Returns 403 error
Result: 0 tokens consumed (user prevented from starting without quota)
```

---

## 🎯 Key Points

1. **Quota Reservation**: Quota is checked but not consumed during OTP generation
2. **Success-Based Consumption**: Quota consumed ONLY on successful verification
3. **Retry Friendly**: Failed OTP attempts don't consume quota
4. **Early Validation**: Quota checked before attempting verification
5. **Consistent Behavior**: Same quota checking logic as other endpoints

---

## 📝 Code Changes

### File Modified:
- `backend/src/modules/aadhaar/aadhaar.controller.ts`

### Changes:
- ✅ `generateOtpV2Handler`: Removed quota consumption, added quota check only
- ✅ `submitOtpV2Handler`: Added conditional quota consumption (only on success)
- ✅ Added imports for quota service functions
- ✅ Added proper logging

---

## ✅ Testing Checklist

### Test Scenarios:
- [x] Generate OTP with quota available → Should succeed, quota not consumed
- [x] Generate OTP without quota → Should return 403 error
- [x] Submit OTP with valid OTP → Should succeed, quota consumed
- [x] Submit OTP with invalid OTP → Should fail, quota NOT consumed
- [x] Submit OTP without quota → Should return 403 before verification
- [x] Multiple failed OTP attempts → Should not consume quota
- [x] Successful verification after retry → Should consume 1 token only

---

## 🎉 Status

**✅ COMPLETE**

The quota system has been updated so that tokens are consumed **ONLY** after successful OTP verification.

**Token Consumption:**
- ✅ Generate OTP: **0 tokens** (quota checked only)
- ✅ Submit OTP (success): **1 token** (quota consumed)
- ✅ Submit OTP (failure): **0 tokens** (quota not consumed)

---

## 📚 Related Documentation

- Backend Implementation: `backend/src/modules/aadhaar/README_V2.md`
- Full Integration: `AADHAAR_V2_FULL_INTEGRATION.md`

---

## 💡 Notes

1. **Rate Limiting**: Still applies (3 OTP requests per 15 minutes)
2. **Quota Validation**: Happens at both steps to prevent unnecessary API calls
3. **Error Handling**: Quota errors return before attempting QuickEKYC API calls
4. **Logging**: All quota operations are logged for audit purposes

**Status:** ✅ Production Ready

