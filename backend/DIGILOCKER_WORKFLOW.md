# DigiLocker Complete Workflow Guide

## 🔍 **Issue Analysis**

The error `DIGILOCKER_AUTHORIZATION_NOT_COMPLETED` indicates that the DigiLocker OAuth flow needs to be completed before pulling documents.

## 🔄 **Complete DigiLocker Workflow**

### **Step 1: Initialize DigiLocker (OAuth Setup)**
```bash
curl -X POST http://localhost:5000/api/pan/digilocker-init \
  -H "Content-Type: application/json" \
  -d '{
    "redirect_uri": "https://your-app.com/callback",
    "consent": "Y"
  }'
```

**Response:**
```json
{
  "request_id": "4c3470ab-a008-4512-96ce-de4656d1ef08",
  "transaction_id": "9c60463d-59bc-41cb-bdaf-79a8f7e043f7",
  "status": 200,
  "data": {
    "code": "1000",
    "message": "Authorization URL generated.",
    "transaction_id": "9c60463d-59bc-41cb-bdaf-79a8f7e043f7",
    "authorization_url": "https://api.digitallocker.gov.in/public/oauth2/1/authorize?..."
  }
}
```

### **Step 2: Complete OAuth Authorization**
1. **Open the authorization URL** from the init response in a browser
2. **User logs in** to DigiLocker with their credentials
3. **User grants consent** for document access
4. **User is redirected** back to your callback URL

### **Step 3: Pull PAN Document (After OAuth)**
```bash
curl -X POST http://localhost:5000/api/pan/digilocker-pull \
  -H "Content-Type: application/json" \
  -d '{
    "parameters": {
      "panno": "BZLPJ0707Q",
      "PANFullName": "Rohan Kumar Jha"
    },
    "transactionId": "9c60463d-59bc-41cb-bdaf-79a8f7e043f7"
  }'
```

### **Step 4: Fetch Document Content**
```bash
curl -X POST http://localhost:5000/api/pan/digilocker-fetch-document \
  -H "Content-Type: application/json" \
  -d '{
    "document_uri": "https://api.digilocker.gov.in/files/123456",
    "transaction_id": "9c60463d-59bc-41cb-bdaf-79a8f7e043f7"
  }'
```

## 🚨 **Current Issue**

The error occurs because you're trying to pull a document **before completing the OAuth authorization**. 

### **What's Happening:**
1. ✅ Init API works (creates authorization URL)
2. ❌ Pull API fails (authorization not completed)
3. ❌ User hasn't visited the authorization URL yet

### **Solution:**
1. **Get the authorization URL** from the init API response
2. **Visit that URL** in a browser
3. **Complete the DigiLocker login and consent**
4. **Then try the pull API again**

## 🔧 **Testing the Complete Flow**

### **1. Test Init API:**
```bash
curl -X POST http://localhost:5000/api/pan/digilocker-init \
  -H "Content-Type: application/json" \
  -d '{
    "redirect_uri": "https://gridlines.io/digilocker-app/callback",
    "consent": "Y"
  }'
```

### **2. Visit Authorization URL:**
Copy the `authorization_url` from the response and open it in a browser.

### **3. Test Pull API (After OAuth):**
```bash
curl -X POST http://localhost:5000/api/pan/digilocker-pull \
  -H "Content-Type: application/json" \
  -d '{
    "parameters": {
      "panno": "BZLPJ0707Q",
      "PANFullName": "Rohan Kumar Jha"
    },
    "transactionId": "9c60463d-59bc-41cb-bdaf-79a8f7e043f7"
  }'
```

## 📋 **API Endpoints Summary**

| **API** | **Method** | **URL** | **Purpose** |
|---------|------------|---------|-------------|
| DigiLocker Init | POST | `/api/pan/digilocker-init` | Start OAuth flow |
| DigiLocker Pull | POST | `/api/pan/digilocker-pull` | Pull document (after OAuth) |
| DigiLocker Fetch | POST | `/api/pan/digilocker-fetch-document` | Get document content |

## 🔐 **Environment Variables**

Make sure your `.env` file has:
```bash
GRIDLINES_BASE_URL=https://api.gridlines.io
GRIDLINES_API_KEY=your_actual_api_key_here
```

## ✅ **Success Indicators**

- **Init API**: Returns authorization URL
- **OAuth**: User completes login and consent
- **Pull API**: Returns document URI
- **Fetch API**: Returns document content

The APIs are working correctly - you just need to complete the OAuth flow first! 🎉 