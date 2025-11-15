# Repeating Patterns Analysis

## Files Analyzed
1. AadhaarSection.tsx
2. VerificationLayout.tsx
3. VerificationForm.tsx
4. VerificationConfirmDialog.tsx
5. NoQuotaDialog.tsx
6. aadhaarServices.ts
7. aadhaarApi.ts
8. PricingContext.tsx
9. OtpInputWithTimer.tsx

---

## 🔄 REPEATING PATTERNS IDENTIFIED

### 1. **Dialog Structure Pattern** (VerificationConfirmDialog & NoQuotaDialog)
Both dialogs share identical structure:

**Repeated Elements:**
- `AnimatePresence` wrapper
- Backdrop: `className="absolute inset-0 bg-black/50 backdrop-blur-sm"`
- Dialog container: `className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"`
- Same animation pattern:
  ```tsx
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  ```
- Header structure with close button (X icon)
- Footer with action buttons (Cancel + Primary action)

**Location:**
- `VerificationConfirmDialog.tsx` (lines 57-172)
- `NoQuotaDialog.tsx` (lines 28-139)

---

### 2. **Quota Error Detection Pattern**
Repeated across multiple verification sections:

**Pattern:**
```tsx
if (err?.response?.status === 403 || /quota|exhaust|exhausted|limit|token/i.test(errorMessage)) {
  setShowNoQuotaDialog(true)
}
```

**Found in:**
- AadhaarSection.tsx (lines 259, 300)
- EpfoSection.tsx (line 174)
- RcSection.tsx (line 156)
- PassportSection.tsx (line 158)
- DrivingLicenseSection.tsx (line 116)
- BankAccountSection.tsx (lines 167-177)
- VerificationForm.tsx (line 98)

**Variations:**
- Some use `errorMessage`, others use `backendMsg`
- Some extract error message differently:
  ```tsx
  const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || ""
  ```

---

### 3. **State Management Pattern**
Identical state variables repeated across all Section components:

**Repeated State:**
```tsx
const [isLoading, setIsLoading] = useState(false)
const [result, setResult] = useState<any>(null)
const [error, setError] = useState<string | null>(null)
const [showConfirmDialog, setShowConfirmDialog] = useState(false)
const [showNoQuotaDialog, setShowNoQuotaDialog] = useState(false)
const [pendingFormData, setPendingFormData] = useState<any>(null)
```

**Found in:**
- AadhaarSection.tsx (lines 16-21)
- EpfoSection.tsx (lines 90-95)
- CompanySection.tsx (lines 14-18)
- RcSection.tsx (lines 17-19)
- PassportSection.tsx (lines 20-22)
- DrivingLicenseSection.tsx (lines 17-19)
- BankAccountSection.tsx (lines 16-18)
- VoterSection.tsx (similar pattern)
- And others...

---

### 4. **Submit Handler Pattern**
Two-step submission pattern repeated:

**Pattern:**
```tsx
// Step 1: Show confirmation dialog
const handleSubmit = async (formData: any) => {
  setPendingFormData(formData)
  setShowConfirmDialog(true)
}

// Step 2: Actual submission after confirmation
const handleConfirmSubmit = async () => {
  setShowConfirmDialog(false)
  setIsLoading(true)
  setError(null)
  setResult(null)
  
  try {
    // API call
    const response = await someApi.method(pendingFormData)
    setResult(response)
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || err?.message || ""
    // Quota error handling
    if (err?.response?.status === 403 || /quota|exhaust|exhausted|limit|token/i.test(errorMessage)) {
      setShowNoQuotaDialog(true)
    } else {
      setError(errorMessage)
    }
  } finally {
    setIsLoading(false)
  }
}
```

**Found in:**
- AadhaarSection.tsx (lines 238-308)
- EpfoSection.tsx (lines 122-182)
- CompanySection.tsx (lines 45-70)
- RcSection.tsx (lines 69-161)
- PassportSection.tsx (lines 92-163)
- DrivingLicenseSection.tsx (lines 74-120)
- BankAccountSection.tsx (lines 45-178)
- And others...

---

### 5. **Hardcoded Token Cost**
`tokenCost={1}` hardcoded in 11+ places:

**Found in:**
- AadhaarSection.tsx (line 405)
- VoterSection.tsx (line 169)
- EpfoSection.tsx (line 212)
- CompanySection.tsx (line 99)
- RcSection.tsx (line 219)
- PassportSection.tsx (line 200)
- PanSection.tsx (line 222)
- GstinSection.tsx (line 123)
- DrivingLicenseSection.tsx (line 166)
- CcrvSection.tsx (line 253)
- BankAccountSection.tsx (line 215)

**Issue:** Should be dynamic based on pricing context or service type.

---

### 6. **Error Message Extraction Pattern**
Repeated error message extraction logic:

**Pattern:**
```tsx
const errorMessage = 
  err?.response?.data?.message || 
  err?.response?.data?.error ||
  err?.message || 
  "An error occurred"
```

**Variations:**
- Some use `backendMsg`
- Some include `err?.data?.message`
- Default messages vary: "An error occurred", "Verification failed", "Failed to generate OTP"

**Found in:**
- AadhaarSection.tsx (lines 157-161, 208-212, 298)
- EpfoSection.tsx (line 171)
- RcSection.tsx (line 155)
- PassportSection.tsx (line 157)
- DrivingLicenseSection.tsx (line 115)
- BankAccountSection.tsx (line 168)
- And others...

---

### 7. **Framer Motion Animation Patterns**
Same animation patterns repeated:

**Backdrop Animation:**
```tsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
```

**Dialog Animation:**
```tsx
initial={{ opacity: 0, scale: 0.95, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.95, y: 20 }}
```

**Content Animation:**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

**Found in:**
- VerificationConfirmDialog.tsx
- NoQuotaDialog.tsx
- VerificationForm.tsx
- VerificationLayout.tsx
- PostVerificationReview.tsx
- And others...

---

### 8. **Service Change Handler Pattern**
Similar reset logic when service changes:

**Pattern:**
```tsx
const handleServiceChange = (service: any) => {
  setSelectedService(service)
  setResult(null)
  setError(null)
  // Sometimes additional resets
}
```

**Found in:**
- AadhaarSection.tsx (lines 33-41)
- EpfoSection.tsx (lines 96-100)
- CompanySection.tsx (lines 20-24)
- And others...

---

### 9. **Dialog Props Pattern**
Same props structure for both dialogs:

**VerificationConfirmDialog:**
```tsx
<VerificationConfirmDialog
  isOpen={showConfirmDialog}
  onClose={() => setShowConfirmDialog(false)}
  onConfirm={handleConfirmSubmit}
  isLoading={isLoading}
  serviceName={selectedService.name}
  formData={pendingFormData || {}}
  tokenCost={1}
/>
```

**NoQuotaDialog:**
```tsx
<NoQuotaDialog
  isOpen={showNoQuotaDialog}
  onClose={() => setShowNoQuotaDialog(false)}
  serviceName={selectedService.name}
  verificationType="aadhaar" // or other type
/>
```

**Found in:** All Section components (11+ files)

---

### 10. **Loading State Pattern**
Same loading state management:

**Pattern:**
```tsx
setIsLoading(true)
setError(null)
setResult(null)

try {
  // API call
} catch (err) {
  // Error handling
} finally {
  setIsLoading(false)
}
```

**Found in:** All Section components

---

## 📊 SUMMARY

### Most Repeated Patterns:
1. **Dialog structure** (2 files, but used in 11+ components)
2. **Quota error detection** (7+ files)
3. **State management** (11+ files)
4. **Submit handler pattern** (11+ files)
5. **Hardcoded tokenCost** (11+ files)
6. **Error message extraction** (11+ files)
7. **Animation patterns** (5+ files)
8. **Service change handler** (11+ files)
9. **Dialog props** (11+ files)
10. **Loading state management** (11+ files)

### Recommendations:
1. **Create a base dialog component** to reduce duplication between VerificationConfirmDialog and NoQuotaDialog
2. **Create a custom hook** for verification state management (`useVerificationState`)
3. **Create a utility function** for quota error detection (`isQuotaError(err)`)
4. **Create a utility function** for error message extraction (`extractErrorMessage(err)`)
5. **Make tokenCost dynamic** using PricingContext instead of hardcoding
6. **Create a base verification section component** or hook to handle common patterns
7. **Extract animation variants** to a shared constants file

