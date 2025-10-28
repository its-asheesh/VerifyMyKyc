# Modules Directory Analysis - Unused Files

## 🚨 Critical Security Issue

### Firebase Service Account Private Key (SECURITY RISK)
- **File:** `backend/src/modules/auth/verifymykyc-5f02e-firebase-adminsdk-fbsvc-41079032c4.json`
- **Status:** ⚠️ **ACTIVELY USED** but **SHOULD BE DELETED**
- **Issue:** Private keys should NEVER be in git repository
- **Action Required:** 
  1. Regenerate Firebase service account key
  2. Remove this file from repository
  3. Add to .gitignore
  4. Use environment variable instead

---

## 📊 Seed Files Analysis

### Used Seed Files:
1. ✅ `seed-users.ts` - Imported in package.json scripts
2. ✅ `seed-pricing.ts` - Imported in package.json scripts
3. ✅ `seed-coupons.ts` - Imported in package.json scripts
4. ✅ `seed-carousel.ts` - Imported in package.json scripts
5. ✅ `seed-orders.ts` - Imported in package.json scripts
6. ✅ `seed-blogs.ts` - Imported in package.json scripts

### Unused Seed Files:
1. ❓ `seed-users-location.ts` - **NEEDS VERIFICATION**
   - Creates random location data for users
   - Never imported in package.json
   - Appears to be a one-time migration script

---

## Recommendations

### Immediate Actions:
1. 🚨 **REGENERATE Firebase service account key** and remove from repo
2. 🔍 **Review seed-users-location.ts** - Delete if it was a one-time migration
3. ✅ Keep other seed files (they're used in package.json)

### Files to Consider:
- `seed-users-location.ts/js` - If this was a one-time migration, it should be deleted

---

## Status

### Active Files: ✅ ALL IN USE
- All seed files (except seed-users-location) are imported in package.json
- All controllers are imported in routes.ts
- All routers are imported in routes.ts
- All services are imported by their respective controllers

### Security Issue: 🚨 FIREBASE PRIVATE KEY
- **File:** verifymykyc-5f02e-firebase-adminsdk-fbsvc-41079032c4.json
- **Action:** MUST be removed and replaced with environment variable

---

## Next Steps

1. Check package.json for seed scripts
2. Verify seed-users-location usage
3. Document Firebase private key removal process

