import BaseApi from './baseApi'

// Types
export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  company?: string
  phone?: string
  avatar?: string
  isActive: boolean
  lastLogin?: string
  emailVerified: boolean
  phoneVerified?: boolean
  location?: {
    country?: string
    city?: string
    region?: string
    timezone?: string
    ipAddress?: string
  }
  createdAt: string
  updatedAt: string
}

export interface UpdateUserRoleData {
  role: 'user' | 'admin'
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  newUsersThisMonth: number
  pendingVerifications: number
  totalAdmins: number
  trends: {
    users: { percentage: number; direction: 'up' | 'down' | 'neutral' }
    active: { percentage: number; direction: 'up' | 'down' | 'neutral' }
    pending: { percentage: number; direction: 'up' | 'down' | 'neutral' }
  }
}

export interface LocationStats {
  country: string
  userCount: number
  cityCount: number
  regionCount: number
  cities: string[]
  regions: string[]
}

export interface TopCity {
  _id: string
  count: number
  country: string
}

export interface LocationAnalytics {
  locationStats: LocationStats[]
  totalUsersWithLocation: number
  topCities: TopCity[]
  recentLocationActivity: Array<{
    _id: {
      country: string
      date: string
    }
    count: number
  }>
}

class UserApi extends BaseApi {
  async getAllUsers(): Promise<User[]> {
    return this.get<any>('/auth/users').then(res => res.data.users)
  }

  async getUserStats(): Promise<UserStats> {
    return this.get<any>('/auth/users/stats').then(res => res.data)
  }

  async getLocationAnalytics(): Promise<LocationAnalytics> {
    return this.get<any>('/auth/users/location-analytics').then(res => res.data)
  }

  async getUsersWithLocation(): Promise<User[]> {
    return this.get<any>('/auth/users/with-location').then(res => res.data.users)
  }

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    return this.put<any>(`/auth/users/${userId}/role`, { role }).then(res => res.data.user)
  }

  async toggleUserStatus(userId: string): Promise<User> {
    return this.put<any>(`/auth/users/${userId}/toggle-status`).then(res => res.data.user)
  }

  async updateUserLocation(userId: string, locationData: {
    country?: string
    city?: string
    region?: string
    timezone?: string
    ipAddress?: string
  }): Promise<User> {
    return this.put<any>(`/auth/users/${userId}/location`, locationData).then(res => res.data.user)
  }

  async verifyUserEmail(userId: string): Promise<User> {
    return this.put<any>(`/auth/users/${userId}/verify-email`).then(res => res.data.user)
  }

  async verifyUserPhone(userId: string): Promise<User> {
    return this.put<any>(`/auth/users/${userId}/verify-phone`).then(res => res.data.user)
  }

  async addUserTokens(userId: string, data: {
    verificationType: string
    numberOfTokens: number
    validityDays: number
  }): Promise<{
    order: {
      id: string
      orderId: string
      orderNumber: string
      verificationType: string
      serviceName: string
      numberOfTokens: number
      validityDays: number
      expiresAt: string
      remaining: number
    }
  }> {
    return this.post<any>(`/auth/users/${userId}/add-tokens`, data).then(res => res.data)
  }
}

export default new UserApi() 