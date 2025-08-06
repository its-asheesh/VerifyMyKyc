import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from './auth.model'

dotenv.config()

const countries = [
  { name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'] },
  { name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur'] },
  { name: 'United Kingdom', cities: ['London', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Edinburgh', 'Liverpool', 'Manchester', 'Bristol'] },
  { name: 'Canada', cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'] },
  { name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'] },
  { name: 'Germany', cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'] },
  { name: 'France', cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'] },
  { name: 'Japan', cities: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'] },
  { name: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'] },
  { name: 'Mexico', cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Ciudad Juárez', 'León', 'Zapopan', 'Nezahualcóyotl', 'Guadalupe'] },
  { name: 'Singapore', cities: ['Singapore'] },
  { name: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'] },
  { name: 'Sweden', cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'] },
  { name: 'Switzerland', cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 'St. Gallen', 'Lucerne', 'Lugano', 'Biel'] },
  { name: 'South Korea', cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Seongnam'] }
]

const regions = [
  'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'
]

const timezones = [
  'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Denver',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Asia/Dubai',
  'Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth',
  'Pacific/Auckland', 'Pacific/Honolulu'
]

async function seedUserLocations() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not set')
    }

    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Get all users without location data
    const users = await User.find({ 
      $or: [
        { 'location.country': { $exists: false } },
        { location: null },
        { 'location.country': null }
      ]
    })
    console.log(`Found ${users.length} users without location data`)

    if (users.length === 0) {
      console.log('All users already have location data')
      return
    }

    // Update users with random location data
    for (const user of users) {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)]
      const randomCity = randomCountry.cities[Math.floor(Math.random() * randomCountry.cities.length)]
      const randomRegion = regions[Math.floor(Math.random() * regions.length)]
      const randomTimezone = timezones[Math.floor(Math.random() * timezones.length)]
      
      // Generate a random IP address
      const randomIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

      user.location = {
        country: randomCountry.name,
        city: randomCity,
        region: randomRegion,
        timezone: randomTimezone,
        ipAddress: randomIP
      }

      await user.save()
    }

    console.log(`Successfully updated ${users.length} users with location data`)

    // Display some statistics
    const locationStats = await User.aggregate([
      {
        $match: {
          'location.country': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$location.country',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    console.log('\nLocation Statistics:')
    locationStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} users`)
    })

  } catch (error) {
    console.error('Error seeding user locations:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the seed function
seedUserLocations() 