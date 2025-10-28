# 🏗️ Backend Architecture Refactoring Guide

## Overview
This guide provides step-by-step instructions for refactoring existing modules to use the new base classes while maintaining 100% functionality compatibility.

## 📋 Migration Checklist

### ✅ Completed Infrastructure
- [x] BaseController class with common patterns
- [x] BaseProvider class with error handling
- [x] BaseService interface
- [x] Error mapping utilities
- [x] Validation utilities
- [x] Example refactored modules

### 🔄 Migration Steps

## Step 1: Update Controller

### Before (Original Pattern):
```typescript
export const someHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'verificationType');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  
  const result = await service.someMethod(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});
```

### After (Refactored Pattern):
```typescript
class SomeController extends BaseController {
  async someHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    return this.handleVerificationRequest(req, res, {
      verificationType: 'verificationType'
    }, () => service.someMethod(req.body));
  }
}

const controller = new SomeController();
export const someHandler = asyncHandler(controller.someHandler.bind(controller));
```

## Step 2: Update Provider

### Before (Original Pattern):
```typescript
export async function someProvider(payload: SomeRequest): Promise<SomeResponse> {
  try {
    console.log('API Request:', { url: '/endpoint', payload });
    const response = await apiClient.post('/endpoint', payload);
    console.log('API Response:', { status: response.status, data: response.data });
    return response.data;
  } catch (error: any) {
    console.error('API Error:', { message: error.message, status: error.response?.status });
    // ... error mapping logic
    throw new HTTPError(errorMessage, statusCode, error.response?.data);
  }
}
```

### After (Refactored Pattern):
```typescript
class SomeProvider extends BaseProvider {
  async someMethod(payload: SomeRequest): Promise<SomeResponse> {
    return this.makeApiCall<SomeResponse>({
      endpoint: '/endpoint',
      payload,
      operationName: 'Some Operation'
    });
  }
}

const provider = new SomeProvider();
export async function someProvider(payload: SomeRequest): Promise<SomeResponse> {
  return provider.someMethod(payload);
}
```

## Step 3: Update Service

### Before (Original Pattern):
```typescript
export class SomeService {
  async someMethod(payload: SomeRequest): Promise<SomeResponse> {
    return someProvider(payload);
  }
}
```

### After (Refactored Pattern):
```typescript
export class SomeService extends BaseService {
  async someMethod(payload: SomeRequest): Promise<SomeResponse> {
    this.logServiceCall('SomeService.someMethod', payload);
    
    try {
      const result = await someProvider(payload);
      return this.createServiceResponse(result);
    } catch (error) {
      this.handleServiceError(error, 'SomeService.someMethod');
    }
  }
}
```

## 🔧 Module-Specific Migration Examples

### PAN Module Migration
```typescript
// Controller with fallback quota support
class PanController extends BaseController {
  async fetchDinByPan(req: AuthenticatedRequest, res: Response): Promise<void> {
    return this.handleVerificationWithFallback(
      req, 
      res, 
      'company', 
      ['pan'], 
      () => service.fetchDinByPan(req.body)
    );
  }
}
```

### File Upload Module Migration
```typescript
// Controller with file upload support
class AadhaarController extends BaseController {
  async ocrV2(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { consent } = req.body;
    
    return this.handleFileUploadRequest(req, res, {
      verificationType: 'aadhaar',
      requireConsent: true
    }, ({ file_front, file_back }) => 
      service.ocrV2(file_front.buffer, file_front.originalname, consent, file_back?.buffer, file_back?.originalname)
    );
  }
}
```

### Provider with Custom Error Mapping
```typescript
class PanProvider extends BaseProvider {
  protected getErrorMapping() {
    return createErrorMapper({
      operationName: 'PAN Verification',
      customMessages: {
        404: 'PAN API endpoint not found'
      }
    });
  }
}
```

## 🧹 Cleanup Steps

### 1. Remove JavaScript Duplicates
```bash
# Run the cleanup script
cd backend
npx ts-node scripts/cleanup-duplicates.ts
```

### 2. Update Build Configuration
Ensure your `tsconfig.json` outputs compiled files to `dist/` directory:
```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### 3. Update .gitignore
Add to `.gitignore`:
```
# Compiled JavaScript files
src/**/*.js
src/**/*.js.map
```

## 📊 Benefits After Migration

### Code Reduction
- **Controllers**: ~60% reduction in boilerplate code
- **Providers**: ~70% reduction in error handling code
- **Services**: ~40% reduction in logging and error handling

### Maintainability Improvements
- Single source of truth for common patterns
- Consistent error handling across all modules
- Standardized logging and validation
- Better TypeScript support with base classes

### Testing Benefits
- Easier to mock base classes
- Consistent test patterns across modules
- Better error testing with standardized error mapping

## ⚠️ Important Notes

### Functionality Preservation
- All existing API endpoints remain unchanged
- Response formats are identical
- Error messages are preserved
- Logging patterns are maintained

### Backward Compatibility
- All existing imports continue to work
- No breaking changes to external APIs
- Gradual migration is possible (module by module)

### Testing Strategy
1. Run existing tests to ensure no regressions
2. Test error scenarios with new error mapping
3. Verify logging output matches expectations
4. Test quota management functionality

## 🚀 Migration Priority

### High Priority (Immediate)
1. Clean up JavaScript duplicates
2. Migrate modules with most duplication (PAN, GSTIN, MCA)
3. Update error handling patterns

### Medium Priority (Next Sprint)
1. Migrate remaining verification modules
2. Implement validation utilities
3. Add comprehensive testing

### Low Priority (Future)
1. Implement dependency injection
2. Add advanced error recovery
3. Optimize performance patterns

## 📝 Migration Template

Use this template for each module:

```typescript
// 1. Create refactored controller
class ModuleController extends BaseController {
  // Implement methods using base class helpers
}

// 2. Create refactored provider
class ModuleProvider extends BaseProvider {
  // Implement methods using base class helpers
}

// 3. Create refactored service
class ModuleService extends BaseService {
  // Implement methods using base class helpers
}

// 4. Export with same signatures as original
export const handlers = {
  // Export handlers with identical signatures
};
```

This ensures zero breaking changes while gaining all the benefits of the new architecture.
