# VerifyMyKYC - Maintenance Mode Integration Documentation

A database-controlled, in-memory cached **Production Maintenance Mode** implementation. This feature allows administrators to temporarily take the public-facing client application offline while maintaining bypass privileges for administrators to test or inspect the site.

---

## 1. System Architecture

```
Admin Panel Dashboard
  └── Toggle Maintenance Mode (Settings -> Maintenance Mode)
        └── Updates MongoDB SystemSettings Collection
              └── Triggers Backend Cache Refresh
                    └── Maintenance Middleware (Uses In-Memory Cached State)
                          ├── Bypass Admin (With Valid Token)
                          ├── Bypass Webhook/Callback Routes
                          └── Block Public Users -> Return HTTP 503
                                └── Client App interceptor
                                      └── Redirect to Branded Maintenance Page
```

---

## 2. Codebase Files Reference

### Backend Components
* **Mongoose Schema** ([system.model.ts](file:///d:/VerifyMyKyc/backend/src/modules/system/system.model.ts)): Defines the `SystemSettings` schema with properties: `maintenanceMode`, `maintenanceTitle`, `maintenanceMessage`, `estimatedEndTime`, and `showCountdown`.
* **In-Memory Cache** ([maintenance-cache.ts](file:///d:/VerifyMyKyc/backend/src/modules/system/maintenance-cache.ts)): Caches settings in memory to avoid checking the database on every HTTP request. Initializes default settings on app start.
* **Middleware** ([maintenance.ts](file:///d:/VerifyMyKyc/backend/src/common/middleware/maintenance.ts)): Global API interceptor that blocks public routing when maintenance is active. Allows admin tokens and `/callback` webhooks.
* **Routes & Controllers** ([system.router.ts](file:///d:/VerifyMyKyc/backend/src/modules/system/system.router.ts) & [system.controller.ts](file:///d:/VerifyMyKyc/backend/src/modules/system/system.controller.ts)): Provides `GET /api/system/settings` (public) and `PUT /api/system/settings` (admin-protected).

### Client Components
* **Axios Interceptor** ([baseApi.ts](file:///d:/VerifyMyKyc/client/src/services/api/baseApi.ts)): Redirects the browser instantly to `/maintenance` when a `503 Service Unavailable` response is intercepted.
* **Global Route Guard** ([MaintenanceContext.tsx](file:///d:/VerifyMyKyc/client/src/context/MaintenanceContext.tsx)): Monitors status changes and renders the Maintenance Page globally, blocking all sub-routes for public users.
* **Maintenance Page** ([MaintenancePage.tsx](file:///d:/VerifyMyKyc/client/src/pages/MaintenancePage.tsx)): A clean light-themed UI featuring the actual branded logo, live countdown timer, and status refresh trigger.
* **Router Hooks** ([AppRoutes.tsx](file:///d:/VerifyMyKyc/client/src/routes/AppRoutes.tsx)): Integrates `MaintenanceProvider` and maps the `/maintenance` route.

### Admin Components
* **API Wrapper** ([systemApi.ts](file:///d:/VerifyMyKyc/admin/src/services/api/systemApi.ts)): Updates settings payload.
* **Admin Form Controls** ([Settings.tsx](file:///d:/VerifyMyKyc/admin/src/pages/Settings.tsx)): Added a settings form under the "Maintenance Mode" tab.
* **Dashboard Warning Bar** ([DashboardLayout.tsx](file:///d:/VerifyMyKyc/admin/src/components/layout/DashboardLayout.tsx)): Pulsing red banner shown to admins while maintenance is active.

---

## 3. Whitelisted Paths
During maintenance, the following backend routes bypass interception:
1. `POST /api/auth/login` (Admin/User authentication)
2. `POST /api/auth/login/phone-password` (Admin/User mobile authentication)
3. `GET /api/system/settings` (Client-side check)
4. Any path containing `/callback` (e.g. `/api/callback/ccrv`, `/api/ccrv/callback` webhook endpoints)

---

## 4. Verification Checklist

* [x] **Verification 1: Inactive Mode**
  * Admin toggle set to **OFF**.
  * Public users can view the homepage and access products, pricing, and profile routes normally.

* [x] **Verification 2: Active Mode (Public Users)**
  * Admin toggle set to **ON**.
  * Public requests return `503 Service Unavailable`.
  * Browser is redirected to `/maintenance` showing customized messages and countdown.
  * Direct route navigation (e.g., to `/profile`) is blocked.

* [x] **Verification 3: Active Mode (Administrators)**
  * Admin toggle set to **ON**.
  * Admins with a valid token can navigate the client platform and the admin panel dashboard without hitting the maintenance blocks.

* [x] **Verification 4: Dynamic Recheck**
  * Toggling maintenance to **OFF** and clicking **Refresh Status** on the client screen instantly restores public availability without restarting node servers.
