// Utility functions for getting user location data

export interface LocationData {
  country?: string
  city?: string
  region?: string
  timezone?: string
  ipAddress?: string
}

// Get user's timezone
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

// Get user's IP address (this is a simplified version - in production you'd use a service)
export const getUserIPAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.warn('Could not fetch IP address:', error)
    return '127.0.0.1'
  }
}

// Get location data from IP address using a free geolocation service
export const getLocationFromIP = async (ip: string): Promise<Partial<LocationData>> => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()

    return {
      country: data.country_name,
      city: data.city,
      region: data.region,
      timezone: data.timezone,
      ipAddress: ip
    }
  } catch (error) {
    console.warn('Could not fetch location from IP:', error)
    return {
      ipAddress: ip
    }
  }
}

// Get complete location data for user
export const getUserLocationData = async (): Promise<LocationData> => {
  const timezone = getUserTimezone()
  const ip = await getUserIPAddress()
  const locationFromIP = await getLocationFromIP(ip)

  return {
    ...locationFromIP,
    timezone: timezone
  }
}

// Fallback location data for testing/development
export const getFallbackLocationData = (): LocationData => {
  const countries = [
    { name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
    { name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'] },
    { name: 'United Kingdom', cities: ['London', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield'] },
    { name: 'Canada', cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton'] },
    { name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'] }
  ]

  const randomCountry = countries[Math.floor(Math.random() * countries.length)]
  const randomCity = randomCountry.cities[Math.floor(Math.random() * randomCountry.cities.length)]

  return {
    country: randomCountry.name,
    city: randomCity,
    region: 'Unknown',
    timezone: getUserTimezone(),
    ipAddress: '127.0.0.1'
  }
} 