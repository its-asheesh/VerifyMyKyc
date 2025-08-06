# Pricing API Documentation

## Overview
This API provides comprehensive pricing management for both homepage plans and individual verification services.

## Base URL
```
http://localhost:3000/api/pricing
```

## API Endpoints

### 1. Combined Pricing Data

#### Get All Pricing Data
```http
GET /api/pricing
```
**Response:**
```json
{
  "verificationPricing": [...],
  "homepagePlans": [...]
}
```

### 2. Homepage Plans

#### Get Homepage Pricing (Monthly/Yearly Plans)
```http
GET /api/pricing/homepage-pricing
```
**Response:**
```json
[
  {
    "_id": "...",
    "planType": "monthly",
    "name": "Monthly Pro Plan",
    "price": 799,
    "description": "Access all verification services monthly",
    "features": [...],
    "highlighted": false,
    "popular": true,
    "color": "blue",
    "includesVerifications": ["aadhaar", "pan", "drivinglicense", "gstin"]
  },
  {
    "_id": "...",
    "planType": "yearly",
    "name": "Yearly Pro Plan",
    "price": 7999,
    "description": "Access all verification services yearly (Save 17%)",
    "features": [...],
    "highlighted": true,
    "popular": true,
    "color": "green",
    "includesVerifications": ["aadhaar", "pan", "drivinglicense", "gstin"]
  }
]
```

#### Get All Homepage Plans
```http
GET /api/pricing/homepage
```

#### Get Homepage Plan by Type
```http
GET /api/pricing/homepage/:planType
```

#### Add Homepage Plan
```http
POST /api/pricing/homepage
```
**Request Body:**
```json
{
  "planType": "monthly",
  "name": "Monthly Pro Plan",
  "price": 799,
  "description": "Access all verification services monthly",
  "features": [
    "Unlimited Aadhaar Verifications",
    "Unlimited PAN Verifications",
    "Unlimited Driving License Verifications",
    "Unlimited GSTIN Verifications",
    "Priority Support",
    "API Access"
  ],
  "highlighted": false,
  "popular": true,
  "color": "blue",
  "includesVerifications": ["aadhaar", "pan", "drivinglicense", "gstin"]
}
```

#### Edit Homepage Plan
```http
PUT /api/pricing/homepage/:id
```

#### Delete Homepage Plan
```http
DELETE /api/pricing/homepage/:id
```

### 3. Individual Verification Pricing

#### Get Available Verifications (for Custom Selection)
```http
GET /api/pricing/available-verifications
```
**Response:**
```json
[
  {
    "_id": "...",
    "verificationType": "aadhaar",
    "title": "Aadhaar Verification",
    "description": "Complete Aadhaar verification services",
    "monthlyPrice": 299,
    "yearlyPrice": 2999,
    "oneTimePrice": 99
  }
]
```

#### Get All Verification Pricing
```http
GET /api/pricing/verification
```

#### Get Verification Pricing by Type
```http
GET /api/pricing/verification/:verificationType
```
**Example:** `/api/pricing/verification/aadhaar`

#### Add Verification Pricing
```http
POST /api/pricing/verification
```
**Request Body:**
```json
{
  "verificationType": "aadhaar",
  "monthlyPrice": 299,
  "yearlyPrice": 2999,
  "oneTimePrice": 99,
  "title": "Aadhaar Verification",
  "description": "Complete Aadhaar verification services",
  "features": [
    "OCR Data Extraction",
    "Digilocker Integration",
    "Real-time Verification",
    "API Access"
  ],
  "highlighted": true,
  "popular": true,
  "color": "blue"
}
```

#### Edit Verification Pricing
```http
PUT /api/pricing/verification/:id
```

#### Delete Verification Pricing
```http
DELETE /api/pricing/verification/:id
```

## Data Models

### HomepagePlan
```typescript
{
  planType: 'monthly' | 'yearly'
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
  popular?: boolean
  color?: string
  includesVerifications: string[]
}
```

### VerificationPricing
```typescript
{
  verificationType: string // 'aadhaar', 'pan', 'drivinglicense', 'gstin'
  monthlyPrice: number
  yearlyPrice: number
  oneTimePrice: number
  title?: string
  description?: string
  features?: string[]
  highlighted?: boolean
  popular?: boolean
  color?: string
}
```

## Usage Examples

### Frontend Integration

#### 1. Homepage Pricing Section
```javascript
// Fetch homepage pricing for Monthly/Yearly toggle
const response = await fetch('/api/pricing/homepage-pricing')
const homepagePlans = await response.json()

// Display plans based on selected period (monthly/yearly)
const monthlyPlan = homepagePlans.find(plan => plan.planType === 'monthly')
const yearlyPlan = homepagePlans.find(plan => plan.planType === 'yearly')
```

#### 2. Custom Selection Page
```javascript
// Fetch available verifications for custom selection
const response = await fetch('/api/pricing/available-verifications')
const verifications = await response.json()

// Display verification options with pricing
verifications.forEach(verification => {
  console.log(`${verification.title}: ₹${verification.oneTimePrice} (one-time)`)
})
```

#### 3. Individual Verification Pages
```javascript
// Fetch specific verification pricing
const response = await fetch('/api/pricing/verification/aadhaar')
const aadhaarPricing = await response.json()

// Display pricing options
console.log(`Monthly: ₹${aadhaarPricing.monthlyPrice}`)
console.log(`Yearly: ₹${aadhaarPricing.yearlyPrice}`)
console.log(`One-time: ₹${aadhaarPricing.oneTimePrice}`)
```

## Seeding Data

To populate the database with initial pricing data:

```bash
cd backend
npm run seed
```

This will create:
- 4 verification pricing entries (aadhaar, pan, drivinglicense, gstin)
- 2 homepage plans (monthly and yearly)

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

Error responses include a `message` field with details about the error. 