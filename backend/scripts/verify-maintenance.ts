import '../src/config/dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import http from 'http';
import app from '../app';
import { SystemSettings } from '../src/modules/system/system.model';
import { refreshMaintenanceCache } from '../src/modules/system/maintenance-cache';
import { generateToken } from '../src/common/utils/jwt';
import { logger } from '../src/common/utils/logger';

const TEST_PORT = 5001;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runTests() {
  logger.info('--- STARTING MAINTENANCE MODE VERIFICATION SUITE ---');
  let server: http.Server | null = null;
  let originalSettings: any = null;

  try {
    // 1. Fetch original settings so we can restore them later
    logger.info('Fetching original settings from database...');
    originalSettings = await SystemSettings.findOne({ _id: 'system_settings' });
    logger.info('Original settings stored successfully.');

    // 2. Start Express app on temporary port
    logger.info(`Starting temporary test server on port ${TEST_PORT}...`);
    server = app.listen(TEST_PORT);
    logger.info('Test server started successfully.');

    // Helper to change settings in DB and refresh cache
    const setMaintenanceMode = async (enabled: boolean) => {
      await SystemSettings.findOneAndUpdate(
        { _id: 'system_settings' },
        {
          maintenanceMode: enabled,
          maintenanceTitle: 'Test Scheduled Maintenance',
          maintenanceMessage: 'This is a test maintenance message.',
          showCountdown: false,
          estimatedEndTime: null,
        },
        { upsert: true, new: true }
      );
      await refreshMaintenanceCache();
      // Small delay to ensure memory updates propagate
      await new Promise((resolve) => setTimeout(resolve, 100));
    };

    // --- TEST CASE 1: MAINTENANCE IS DISABLED ---
    logger.info('\n[TEST 1] Testing with Maintenance Mode OFF...');
    await setMaintenanceMode(false);

    // 1.a Settings route should be accessible and return maintenanceMode: false
    const res1a = await axios.get(`${BASE_URL}/api/system/settings`);
    if (res1a.status === 200 && res1a.data?.success && res1a.data?.data?.maintenanceMode === false) {
      logger.info('  ✅ PASS: /api/system/settings returns correct status (maintenance OFF).');
    } else {
      throw new Error(`TEST 1.a FAILED. Settings response: ${JSON.stringify(res1a.data)}`);
    }

    // 1.b Other routes should be accessible (not returning 503)
    try {
      await axios.get(`${BASE_URL}/api/reviews`);
      logger.info('  ✅ PASS: Public routes accessible normally.');
    } catch (err: any) {
      if (err.response?.status === 503) {
        throw new Error('TEST 1.b FAILED: Public route returned 503 when maintenance is OFF.');
      } else {
        logger.info('  ✅ PASS: Public routes not blocked by maintenance.');
      }
    }


    // --- TEST CASE 2: MAINTENANCE IS ENABLED (ANONYMOUS PUBLIC) ---
    logger.info('\n[TEST 2] Testing with Maintenance Mode ON (Anonymous User)...');
    await setMaintenanceMode(true);

    // 2.a Whitelisted system settings route should still be accessible
    const res2a = await axios.get(`${BASE_URL}/api/system/settings`);
    if (res2a.status === 200 && res2a.data?.data?.maintenanceMode === true) {
      logger.info('  ✅ PASS: /api/system/settings is whitelisted and accessible.');
    } else {
      throw new Error('TEST 2.a FAILED: Settings route blocked during maintenance.');
    }

    // 2.b Whitelisted /api/auth/login should not return 503 (it should return normal validation)
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, { email: 'bademail', password: 'badpassword' });
    } catch (err: any) {
      if (err.response?.status === 503) {
        throw new Error('TEST 2.b FAILED: /api/auth/login was blocked (returned 503) during maintenance.');
      } else {
        logger.info('  ✅ PASS: /api/auth/login is whitelisted (not blocked).');
      }
    }

    // 2.c /api/reviews should be blocked and return 503
    try {
      await axios.get(`${BASE_URL}/api/reviews`);
      throw new Error('TEST 2.c FAILED: Public route was accessible (not blocked) during maintenance.');
    } catch (err: any) {
      if (err.response?.status === 503 && err.response?.data?.maintenance === true) {
        logger.info('  ✅ PASS: Public route blocked correctly with 503.');
      } else {
        throw new Error(`TEST 2.c FAILED: Route returned status ${err.response?.status || err.message}`);
      }
    }

    // 2.d Callback webhook should bypass maintenance
    try {
      await axios.post(`${BASE_URL}/api/callback/ccrv`, {});
      logger.info('  ✅ PASS: /api/callback/ccrv webhook bypasses maintenance.');
    } catch (err: any) {
      if (err.response?.status === 503) {
        throw new Error('TEST 2.d FAILED: Webhook route blocked (returned 503) during maintenance.');
      } else {
        logger.info('  ✅ PASS: Webhook bypasses maintenance.');
      }
    }


    // --- TEST CASE 3: MAINTENANCE IS ENABLED (ADMIN BYPASS) ---
    logger.info('\n[TEST 3] Testing Admin user bypass during maintenance...');
    
    // Generate admin bypass token
    const mockAdmin = {
      _id: new mongoose.Types.ObjectId(),
      email: 'admin-test@verifymykyc.com',
      role: 'admin',
    };
    const adminToken = generateToken(mockAdmin as any);

    try {
      await axios.get(`${BASE_URL}/api/reviews`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      logger.info('  ✅ PASS: Admin successfully bypassed maintenance.');
    } catch (err: any) {
      if (err.response?.status === 503) {
        throw new Error('TEST 3 FAILED: Admin request returned 503.');
      } else {
        logger.info('  ✅ PASS: Admin bypassed maintenance block.');
      }
    }


    // --- TEST CASE 4: MAINTENANCE IS ENABLED (NORMAL USER BLOCKED) ---
    logger.info('\n[TEST 4] Testing standard User block during maintenance...');

    // Generate normal user token
    const mockUser = {
      _id: new mongoose.Types.ObjectId(),
      email: 'user-test@verifymykyc.com',
      role: 'user',
    };
    const userToken = generateToken(mockUser as any);

    try {
      await axios.get(`${BASE_URL}/api/reviews`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      throw new Error('TEST 4 FAILED: Normal user bypassed maintenance.');
    } catch (err: any) {
      if (err.response?.status === 503) {
        logger.info('  ✅ PASS: Normal user token blocked correctly with 503.');
      } else {
        throw new Error(`TEST 4 FAILED: Normal user request did not return 503. Status: ${err.response?.status}`);
      }
    }

    logger.info('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY! Maintenance Mode logic is working flawlessly.');

  } catch (error: any) {
    logger.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    process.exitCode = 1;
  } finally {
    // 3. Restore original settings
    if (originalSettings) {
      logger.info('\nRestoring original settings in database...');
      await SystemSettings.findOneAndUpdate(
        { _id: 'system_settings' },
        {
          maintenanceMode: originalSettings.maintenanceMode,
          maintenanceTitle: originalSettings.maintenanceTitle,
          maintenanceMessage: originalSettings.maintenanceMessage,
          showCountdown: originalSettings.showCountdown,
          estimatedEndTime: originalSettings.estimatedEndTime,
        }
      );
      await refreshMaintenanceCache();
      logger.info('Original settings restored.');
    }

    // 4. Shutdown Express test server
    if (server) {
      logger.info('Stopping test server...');
      server.close();
      logger.info('Test server stopped.');
    }

    // Close Mongoose connection
    logger.info('Closing database connection...');
    await mongoose.connection.close();
    logger.info('Database connection closed. Exiting.');
    process.exit();
  }
}

// Ensure database connection is active before running tests
mongoose.connection.on('connected', () => {
  runTests();
});
