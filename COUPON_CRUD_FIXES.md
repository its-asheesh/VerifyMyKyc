# Coupon CRUD Operations - Intermittent Failures Fix

## Issues Identified

The coupon CRUD operations were experiencing intermittent failures due to several race conditions and missing error handling:

### 1. **Query Cache Race Conditions**
- **Problem**: React Query was invalidating queries but not immediately refetching, causing stale data to persist
- **Impact**: UI would sometimes show outdated data after create/update/delete operations
- **Fix**: Added `refetchQueries` after `invalidateQueries` to ensure immediate data refresh

### 2. **Missing Query Configuration**
- **Problem**: No `staleTime`, `refetchOnWindowFocus`, or `retry` logic configured
- **Impact**: Queries could become stale and fail silently
- **Fix**: Added proper query options:
  - `staleTime: 5 minutes` - prevents unnecessary refetches
  - `refetchOnWindowFocus: true` - ensures fresh data when user returns
  - `retry: 2` - automatic retry on failure

### 3. **Form State Not Resetting**
- **Problem**: Form state persisted after successful submission, causing issues on next open
- **Impact**: Next form submission could have stale data
- **Fix**: Added form state reset after successful submission

### 4. **Empty Form Submission Handler**
- **Problem**: `handleFormSubmit` in `CouponManagement.tsx` was empty
- **Impact**: FormModal wrapper was unnecessary and could cause confusion
- **Fix**: Removed FormModal wrapper, form handles submission directly

### 5. **Missing Error Handling**
- **Problem**: Errors were caught but not properly displayed to user
- **Impact**: Users didn't know why operations failed
- **Fix**: Added proper error message extraction and display

### 6. **Backend Race Condition in Code Generation**
- **Problem**: `do-while` loop could theoretically run indefinitely or fail silently
- **Impact**: Coupon creation could fail without proper error message
- **Fix**: 
  - Added max attempts limit (10)
  - Improved duplicate code detection with regex
  - Added try-catch for MongoDB duplicate key errors

### 7. **MongoDB Duplicate Key Error Not Handled**
- **Problem**: If two requests tried to create the same code simultaneously, MongoDB would throw a duplicate key error
- **Impact**: Operation would fail with cryptic error
- **Fix**: Added specific error handling for MongoDB duplicate key errors (code 11000)

## Files Modified

### Frontend (Admin)
1. **`admin/src/hooks/useCoupons.ts`**
   - Added query configuration (staleTime, refetchOnWindowFocus, retry)
   - Changed from `invalidateQueries` to `invalidateQueries` + `refetchQueries`
   - Added error handling in mutations
   - Added retry logic

2. **`admin/src/components/coupons/CouponForm.tsx`**
   - Added form state reset after successful submission
   - Improved error handling with proper error message extraction
   - Form no longer closes on error (allows user to fix and retry)

3. **`admin/src/pages/CouponManagement.tsx`**
   - Removed unnecessary FormModal wrapper
   - Removed unused FormModal import
   - Form now renders directly when `showForm` is true

### Backend
4. **`backend/src/modules/coupons/coupon.controller.ts`**
   - Added max attempts limit for code generation (prevents infinite loops)
   - Improved duplicate code detection with case-insensitive regex
   - Added try-catch for MongoDB duplicate key errors
   - Better error messages for users

## Key Improvements

### 1. Immediate Data Refresh
```typescript
// Before
queryClient.invalidateQueries({ queryKey: ['coupons'] })

// After
await Promise.all([
  queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  queryClient.invalidateQueries({ queryKey: ['couponStats'] })
])
await queryClient.refetchQueries({ queryKey: ['coupons'] })
```

### 2. Better Error Handling
```typescript
// Before
catch (error) {
  showError('Failed to save coupon. Please try again.')
}

// After
catch (error: any) {
  const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save coupon. Please try again.'
  showError(errorMessage)
}
```

### 3. Race Condition Prevention
```typescript
// Before
do {
  couponCode = generateCouponCode()
} while (await Coupon.findOne({ code: couponCode }))

// After
let attempts = 0
const maxAttempts = 10
do {
  couponCode = generateCouponCode()
  attempts++
  if (attempts >= maxAttempts) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate unique coupon code. Please try again.'
    })
  }
} while (await Coupon.findOne({ code: couponCode }))
```

### 4. MongoDB Duplicate Key Handling
```typescript
try {
  const coupon = await Coupon.create({ ... })
} catch (error: any) {
  if (error.code === 11000 || error.name === 'MongoServerError') {
    return res.status(400).json({
      success: false,
      message: 'Coupon code already exists. Please try again.'
    })
  }
  throw error
}
```

## Testing Recommendations

1. **Test rapid create operations**: Try creating multiple coupons quickly
2. **Test with same code**: Try creating a coupon with a code that already exists
3. **Test form state**: Create a coupon, close form, open again - should be clean
4. **Test error handling**: Disconnect network and try operations - should show proper errors
5. **Test window focus**: Create/update a coupon, switch tabs, come back - should refresh data

## Expected Behavior After Fix

✅ **Create**: Should always work, with proper error messages if code exists
✅ **Update**: Should immediately reflect changes in UI
✅ **Delete**: Should immediately remove from list
✅ **Form State**: Should reset after successful operations
✅ **Error Messages**: Should be clear and actionable
✅ **Race Conditions**: Should be handled gracefully

## Notes

- The unique index on `code` field in MongoDB provides database-level protection
- React Query's cache invalidation + refetch ensures UI consistency
- Form state reset prevents stale data issues
- Error handling provides better user experience




