# Input Validation Implementation with Zod

## ✅ What's Been Implemented

### 1. Validation Schemas (`src/common/validation/schemas.ts`)
- ✅ Environment variables schema
- ✅ Auth schemas (register, login, password operations)
- ✅ PAN verification schemas
- ✅ GSTIN verification schemas
- ✅ Driving License schemas
- ✅ Voter ID schemas
- ✅ Bank Account schemas
- ✅ EPFO schemas
- ✅ MCA schemas

### 2. Validation Middleware (`src/common/validation/middleware.ts`)
- ✅ Request body validation
- ✅ Query parameter validation
- ✅ URL parameter validation
- ✅ Consistent error formatting
- ✅ Input sanitization

### 3. Integration
- ✅ Added validation to auth router
- ✅ Zod library installed
- ✅ Type-safe validation

---

## 🎯 How to Use

### Basic Usage

```typescript
import { validate } from '../../common/validation/middleware';
import { registerSchema } from '../../common/validation/schemas';

router.post('/register', validate(registerSchema), registerHandler);
```

### What Happens:

1. **Validation:** Zod validates the request body against the schema
2. **Sanitization:** Input is trimmed, transformed, and type-safe
3. **Error Handling:** Returns 400 with detailed error messages
4. **Type Safety:** req.body has correct TypeScript types

---

## 📋 Available Schemas

### Auth Schemas:
- `registerSchema` - User registration
- `loginSchema` - User login
- `changePasswordSchema` - Change password
- `resetPasswordSchema` - Reset password with OTP
- `sendOtpSchema` - Send OTP
- `verifyOtpSchema` - Verify OTP

### Verification Schemas:
- `panFatherNameSchema` - PAN father name lookup
- `panAadhaarLinkSchema` - PAN-Aadhaar link check
- `gstinFetchSchema` - GSTIN fetch
- `gstinByPanSchema` - GSTIN by PAN
- `drivingLicenseSchema` - Driving license verification
- `voterBosonFetchSchema` - Voter ID fetch
- `bankAccountVerifySchema` - Bank account verification
- `epfoFetchUanSchema` - EPFO UAN fetch
- `epfoGenerateOtpSchema` - EPFO OTP generation
- `cinByPanSchema` - CIN by PAN

---

## 🔧 Example: Adding Validation to a Route

### Before:
```typescript
router.post('/pan/father-name', authenticate, async (req, res) => {
  const { pan_number, consent } = req.body;
  
  // Manual validation
  if (!pan_number) {
    return res.status(400).json({ message: 'PAN number is required' });
  }
  if (!consent || (consent !== 'Y' && consent !== 'N')) {
    return res.status(400).json({ message: 'Consent must be Y or N' });
  }
  
  // Handle PAN format
  const pan = pan_number.toUpperCase();
  
  // ... rest of handler
});
```

### After:
```typescript
import { validate } from '../../common/validation/middleware';
import { panFatherNameSchema } from '../../common/validation/schemas';

router.post(
  '/pan/father-name',
  authenticate,
  validate(panFatherNameSchema), // Validates and sanitizes
  async (req, res) => {
    const { pan_number, consent } = req.body;
    
    // pan_number is already validated, sanitized, and uppercase
    // consent is already validated as 'Y' or 'N'
    // TypeScript knows the types are correct
    
    // ... rest of handler
  }
);
```

---

## ✨ Benefits

### 1. Type Safety
- TypeScript automatically infers types from schemas
- No need to manually type `req.body`
- Compile-time error checking

### 2. Input Sanitization
- Strings are automatically trimmed
- Emails are normalized
- PAN numbers are uppercase
- Phone numbers are formatted

### 3. Security
- Prevents injection attacks
- Validates data types
- Checks required fields
- Rejects malicious input

### 4. Consistent Error Messages
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email address"
    },
    {
      "path": "password",
      "message": "String must contain at least 6 character(s)"
    }
  ],
  "error": "email: Invalid email address, password: String must contain at least 6 character(s)"
}
```

### 5. Less Code
- No manual validation needed
- No repeated error handling
- Schema is reusable
- DRY principle

---

## 🚀 Next Steps

### To Add Validation to More Routes:

1. **Import the validation middleware:**
```typescript
import { validate } from '../../common/validation/middleware';
```

2. **Import or create the schema:**
```typescript
import { panFatherNameSchema } from '../../common/validation/schemas';
// OR create a custom schema in schemas.ts
```

3. **Add validation to route:**
```typescript
router.post('/endpoint', validate(schema), handler);
```

---

## 📝 Creating Custom Schemas

### Example: Creating a Custom Schema

```typescript
// In src/common/validation/schemas.ts
export const myCustomSchema = z.object({
  field1: z.string()
    .min(1, 'Field1 is required')
    .max(50, 'Field1 cannot exceed 50 characters')
    .trim(),
  field2: z.number()
    .positive('Field2 must be positive'),
  field3: z.boolean().optional(),
});
```

### Using Custom Schema

```typescript
import { myCustomSchema } from '../../common/validation/schemas';

router.post('/my-endpoint', validate(myCustomSchema), handler);
```

---

## 🎯 Priority Routes for Validation

### High Priority:
- ✅ Auth routes (register, login, password operations)
- ⏳ PAN verification routes
- ⏳ Aadhaar OCR routes
- ⏳ Bank account verification

### Medium Priority:
- ⏳ EPFO routes
- ⏳ GSTIN routes
- ⏳ MCA routes
- ⏳ Vehicle verification

### Low Priority:
- ⏳ Other verification routes

---

## 📊 Current Status

### Completed:
- ✅ Zod library installed
- ✅ Validation schemas created
- ✅ Validation middleware created
- ✅ Auth routes updated

### Next:
- ⏳ Update PAN routes with validation
- ⏳ Update Aadhaar routes with validation
- ⏳ Add rate limiting
- ⏳ Add environment variable validation at startup

---

## 🔒 Security Benefits

1. **Prevents Injection Attacks**
   - Input is validated before reaching handlers
   - No malicious SQL or NoSQL injection

2. **Type Safety**
   - Prevents type coercion attacks
   - Ensures correct data types

3. **Sanitization**
   - Trims whitespace
   - Removes special characters
   - Normalizes input

4. **Error Exposure**
   - Detailed errors help development
   - Generic errors for production

---

## 📚 Documentation

### Zod Documentation:
- https://zod.dev/

### Best Practices:
- Use descriptive error messages
- Add transforms for data normalization
- Use refinements for complex validations
- Keep schemas DRY and reusable

