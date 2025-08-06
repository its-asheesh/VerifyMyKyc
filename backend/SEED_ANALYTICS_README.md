# Analytics Data Seeding

This script populates the database with realistic user and order data for testing the analytics graphs.

## Data Overview

The seed script creates data from **September 2024 to August 2025** with the following characteristics:

### User Data (440 total users)
- **Monthly Growth Pattern:**
  - Sep 2024: 18 new users
  - Oct 2024: 22 new users
  - Nov 2024: 25 new users
  - Dec 2024: 28 new users
  - Jan 2025: 32 new users
  - Feb 2025: 35 new users
  - Mar 2025: 38 new users
  - Apr 2025: 42 new users
  - May 2025: 45 new users
  - Jun 2025: 48 new users
  - Jul 2025: 52 new users
  - Aug 2025: 55 new users

- **User Distribution:**
  - Admin Users: 55 (12% of total)
  - Regular Users: 385 (88% of total)
  - Active Users: ~330 (75% of total)
  - Inactive Users: ~110 (25% of total)

### Order Data (1,018 total orders)
- **Monthly Revenue Pattern:**
  - Sep 2024: ₹45,000 (45 orders)
  - Oct 2024: ₹52,000 (52 orders)
  - Nov 2024: ₹58,000 (58 orders)
  - Dec 2024: ₹65,000 (65 orders)
  - Jan 2025: ₹72,000 (72 orders)
  - Feb 2025: ₹78,000 (78 orders)
  - Mar 2025: ₹85,000 (85 orders)
  - Apr 2025: ₹92,000 (92 orders)
  - May 2025: ₹98,000 (98 orders)
  - Jun 2025: ₹105,000 (105 orders)
  - Jul 2025: ₹112,000 (112 orders)
  - Aug 2025: ₹118,000 (118 orders)

## Prerequisites

1. **MongoDB Connection**: Ensure your MongoDB is running
2. **Environment Variables**: Set your `MONGODB_URI` environment variable
3. **Dependencies**: Install required packages

## Installation

```bash
# Install dependencies
npm install

# Set MongoDB connection (if not already set)
export MONGODB_URI="mongodb://localhost:27017/verifymykyc"
```

## Running the Seed Script

```bash
# Run the analytics seed script
npm run seed-analytics
```

## Expected Output

```
Starting database seeding...
Clearing existing data...
Generating user data...
✅ Inserted 440 users
Generating order data...
✅ Inserted 1018 orders

📊 Seed Data Summary:
Users: 440
Orders: 1018
Date Range: September 2024 - August 2025
Admin Users: 55
Active Users: 330
Completed Orders: 678

🎉 Database seeding completed successfully!
You can now test the analytics graphs with realistic data.
```

## Testing the Analytics

After running the seed script:

1. **Start the backend server:**
   ```bash
   npm run dev
   ```

2. **Start the admin frontend:**
   ```bash
   cd ../admin
   npm run dev
   ```

3. **Test the Analytics Graphs:**
   - Open User Analytics Modal
   - Test different date range filters:
     - "Last Year" → Should show all 12 months
     - "Last 3 Months" → Should show Jun, Jul, Aug 2025
     - "Last Month" → Should show Aug 2025 only
   - Open Order Analytics Modal
   - Test the same filters with revenue and order data

## Data Features

- **Realistic Growth Patterns**: Data shows natural growth with seasonal variations
- **Proper Date Distribution**: Users and orders are distributed across months
- **Realistic Relationships**: Orders are linked to actual users
- **Varied Statuses**: Mix of completed, pending, and failed orders
- **Geographic Diversity**: Users from different Indian cities
- **Company Diversity**: Various company names for realistic data

## Troubleshooting

### Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Verify connection string
echo $MONGODB_URI
```

### Permission Issues
```bash
# Make sure you have write permissions to the database
# Check your MongoDB user permissions
```

### Data Not Appearing
```bash
# Clear browser cache
# Restart both frontend and backend servers
# Check browser console for any errors
```

## Notes

- The script will **clear existing data** before seeding
- All users have password: `password123`
- Data is distributed randomly within each month
- Realistic variations are added to make data more natural
- The script uses the same schemas as your actual models 