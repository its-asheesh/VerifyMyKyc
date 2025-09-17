# VerifyMyKYC - Project Architecture

## System Architecture Overview

```mermaid
graph TD
    %% ==================== CLIENT LAYER ====================
    subgraph CLIENT[🌐 Client Layer]
        direction TB
        WEB[Web Client] -->|React| WEB1[Components]
        WEB -->|Redux| WEB2[State Management]
        WEB -->|Axios| WEB3[API Client]
        
        subgraph WEB1[Components]
            UI1[Auth Forms]
            UI2[Document Upload]
            UI3[Pricing Plans]
            UI4[Dashboard]
            UI5[User Profile]
        end
        
        subgraph WEB2[State Management]
            STORE1[Auth Store]
            STORE2[User Store]
            STORE3[Verification Store]
            STORE4[Payment Store]
        end
    end

    %% ==================== API GATEWAY ====================
    GATEWAY[🚪 API Gateway] -->|Routes| BACKEND
    GATEWAY -->|Load Balancer| BACKEND
    GATEWAY -->|Rate Limiting| BACKEND
    GATEWAY -->|Request Validation| BACKEND

    %% ==================== BACKEND LAYER ====================
    subgraph BACKEND[⚙️ Backend Services]
        direction TB
        
        %% AUTHENTICATION SERVICE
        subgraph AUTH[🔐 Auth Service]
            A1[JWT Token Issuance]
            A2[OAuth2 Integration]
            A3[Session Management]
            A4[Role-Based Access Control]
        end
        
        %% USER SERVICE
        subgraph USER[👥 User Service]
            U1[Profile Management]
            U2[Preferences]
            U3[Activity Logs]
            U4[Notifications]
        end
        
        %% VERIFICATION SERVICE
        subgraph VERIFY[🔍 Verification Service]
            direction LR
            
            %% DOCUMENT PROCESSING
            subgraph DOC[Document Processing]
                D1[File Validation]
                D2[OCR Engine]
                D3[Data Extraction]
                D4[Image Processing]
            end
            
            %% VERIFICATION TYPES
            subgraph VTYPES[Verification Types]
                V1[Aadhaar Verification]
                V2[Passport Verification]
                V3[Driving License]
                V4[Voter ID]
            end
            
            %% VERIFICATION STEPS
            subgraph VFLOW[Verification Flow]
                F1[Initial Check]
                F2[Document Analysis]
                F3[Data Validation]
                F4[Result Compilation]
            end
            
            DOC --> VTYPES
            VTYPES --> VFLOW
        end
        
        %% PAYMENT SERVICE
        subgraph PAY[💳 Payment Service]
            P1[Subscription Plans]
            P2[Payment Processing]
            P3[Invoice Generation]
            P4[Refund Handling]
        end
        
        %% NOTIFICATION SERVICE
        subgraph NOTIFY[🔔 Notification Service]
            N1[Email Notifications]
            N2[SMS Alerts]
            N3[In-App Messages]
            N4[Webhooks]
        end
    end

    %% ==================== DATA LAYER ====================
    subgraph DATA[💾 Data Layer]
        direction TB
        
        %% PRIMARY DATABASE
        subgraph DB[📊 MongoDB]
            DB1[Users Collection]
            DB2[Verifications]
            DB3[Transactions]
            DB4[Audit Logs]
        end
        
        %% CACHE
        subgraph CACHE[⚡ Redis Cache]
            C1[Session Store]
            C2[Rate Limiting]
            C3[Frequently Accessed Data]
        end
        
        %% FILE STORAGE
        subgraph STORAGE[📁 Cloud Storage]
            S1[Document Storage]
            S2[Processed Files]
            S3[Backups]
        end
    end

    %% ==================== EXTERNAL SERVICES ====================
    subgraph EXTERNAL[🌍 External Services]
        direction TB
        
        %% PAYMENT GATEWAYS
        subgraph PAYMENT[💸 Payment Gateways]
            PG1[Stripe]
            PG2[Razorpay]
            PG3[PayPal]
        end
        
        %% VERIFICATION APIS
        subgraph VERIFY_APIS[🔐 Verification APIs]
            VA1[UIDAI]
            VA2[Passport Seva]
            VA3[Transport Dept]
            VA4[Election Commission]
        end
        
        %% NOTIFICATION SERVICES
        subgraph NOTIFY_EXTRA[📨 Notification Services]
            NE1[SendGrid]
            NE2[Twilio]
            NE3[Firebase Cloud Messaging]
        end
    end

    %% ==================== ADMIN DASHBOARD ====================
    subgraph ADMIN[👨‍💼 Admin Dashboard]
        direction TB
        
        subgraph ADMIN_UI[Admin UI]
            AUI1[User Management]
            AUI2[Verification Dashboard]
            AUI3[Analytics]
            AUI4[System Settings]
        end
        
        subgraph ADMIN_TOOLS[Admin Tools]
            AT1[Bulk Operations]
            AT2[Report Generation]
            AT3[Audit Logs]
            AT4[System Health]
        end
    end

    %% ==================== DATA FLOW ====================
    CLIENT -->|HTTPS| GATEWAY
    GATEWAY --> BACKEND
    
    BACKEND -->|Read/Write| DB
    BACKEND -->|Cache| CACHE
    BACKEND -->|Store Files| STORAGE
    
    BACKEND -->|Process Payments| PAYMENT
    BACKEND -->|Verify Documents| VERIFY_APIS
    BACKEND -->|Send Alerts| NOTIFY_EXTRA
    
    ADMIN -->|Manage| BACKEND
    ADMIN -->|Monitor| DATA

    %% ==================== STYLING ====================
    classDef client fill:#f3e5f5,stroke:#8e24aa,color:#4a148c
    classDef backend fill:#e1f5fe,stroke:#0288d1,color:#01579b
    classDef storage fill:#e8f5e9,stroke:#388e3c,color:#1b5e20
    classDef external fill:#fff3e0,stroke:#f57c00,color:#e65100
    classDef admin fill:#fce4ec,stroke:#c2185b,color:#880e4f
    classDef gateway fill:#f3e0f7,stroke:#9c27b0,color:#6a1b9a
    
    class CLIENT,WEB,WEB1,WEB2,WEB3,UI1,UI2,UI3,UI4,UI5,STORE1,STORE2,STORE3,STORE4 client
    class BACKEND,AUTH,USER,VERIFY,PAY,NOTIFY,A1,A2,A3,A4,U1,U2,U3,U4,DOC,D1,D2,D3,D4,VTYPES,V1,V2,V3,V4,VFLOW,F1,F2,F3,F4,P1,P2,P3,P4,N1,N2,N3,N4 backend
    class DATA,DB,CACHE,STORAGE,DB1,DB2,DB3,DB4,C1,C2,C3,S1,S2,S3 storage
    class EXTERNAL,PAYMENT,VERIFY_APIS,NOTIFY_EXTRA,PG1,PG2,PG3,VA1,VA2,VA3,VA4,NE1,NE2,NE3 external
    class ADMIN,ADMIN_UI,ADMIN_TOOLS,AUI1,AUI2,AUI3,AUI4,AT1,AT2,AT3,AT4 admin
    class GATEWAY gateway
```

## Key Components Legend

| Component | Description |
|-----------|-------------|
| Client Application | React-based frontend with Redux state management |
| Backend Server | Node.js/Express microservices |
| Admin Dashboard | Administrative interface for system management |
| MongoDB | Primary NoSQL database |
| Redis | In-memory data store for caching |
| Cloud Storage | For document and file storage |
| Verification Services | Document processing and validation |
| External APIs | Third-party integrations |
| Auth Service | Authentication and authorization |

## Directory Structure

```
VerifyMyKyc/
├── admin/                  # Admin panel frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       └── pages/
│
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── common/       # Shared utilities
│   │   ├── config/       # Configuration
│   │   └── modules/      # Feature modules
│   │       ├── auth/     # Authentication
│   │       ├── blog/     # Blog management
│   │       ├── pricing/  # Pricing plans
│   │       └── verify/   # Verification services
│   └── .env              # Environment variables
│
└── client/               # Main frontend
    ├── public/
    └── src/
        ├── components/   # Reusable UI components
        ├── containers/   # Page components
        │   └── Home/     # Homepage components
        │       └── PricingSection.tsx
        ├── context/      # React context providers
        ├── types/        # TypeScript types
        └── utils/        # Utility functions
            ├── aadhaarServices.ts
            ├── passportServices.ts
            └── ...
```

## Core Components

### 1. Pricing Section (`PricingSection.tsx`)
- **Purpose**: Display and manage subscription plans with interactive features
- **Key Features**:
  - Dynamic plan cards with smooth animations
  - Billing period toggle (monthly/yearly/custom)
  - Responsive design for all device sizes
  - Interactive hover/focus states with visual feedback
  - Scroll-snap functionality for plan cards
  - Accessibility support (keyboard navigation, ARIA labels)

- **State Management**:
  ```typescript
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [focusedCard, setFocusedCard] = useState<number | null>(0);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly' | 'custom'>('monthly');
  const { homepagePlans, homepageLoading, homepageError, getHomepagePlansByPeriod } = usePricingContext();
  ```

### 2. Verification Services

#### Aadhaar Service (`aadhaarServices.ts`)
- **Features**:
  - OCR v2 for front/back image processing
  - Multi-step form handling
  - Real-time validation
  - Secure file uploads

- **Service Configuration**:
  ```typescript
  export const aadhaarServices: AadhaarServiceMeta[] = [
    {
      key: "ocr-v2",
      name: "Aadhaar OCR (File Upload)",
      description: "Extract data from Aadhaar image (file upload)",
      apiEndpoint: "/api/aadhaar/ocr-v2",
      formFields: [
        { name: "file_front", label: "Aadhaar Front Image", 
          type: "file", required: true },
        { name: "file_back", label: "Aadhaar Back Image", 
          type: "file", required: false },
        { name: "consent", label: "Consent", 
          type: "text", required: true },
      ],
      icon: Upload,
    }
  ];
  ```

## UI/UX Architecture

### 1. Design System

#### Color Palette
```scss
// Primary Colors
$primary: #2563eb;      // Main brand color
$primary-dark: #1d4ed8; // Hover state
$primary-light: #3b82f6; // Active state

// Secondary Colors
$secondary: #7c3aed;
$accent: #ec4899;

// Neutral Colors
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-900: #111827;

// Status Colors
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;
$info: #3b82f6;
```

#### Typography
- **Primary Font**: 'Inter', sans-serif
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Type Scale**:
  - H1: 3rem (48px)
  - H2: 2.25rem (36px)
  - H3: 1.5rem (24px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### 2. Component Library

#### Button Component
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}
```

## Deployment

### Frontend
- Built with Vite
- Deployed on Vercel/Netlify
- Environment-based configuration

### Backend
- Node.js with Express
- MongoDB Atlas
- Containerized with Docker
- CI/CD with GitHub Actions

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../admin && npm install
   cd ../backend && npm install
   ```
3. Set up environment variables
4. Start development servers:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Client
   cd ../client && npm run dev
   
   # Admin
   cd ../admin && npm run dev
   ```

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- <test-file>
```

## Contributing
1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## License
[Your License Here]
