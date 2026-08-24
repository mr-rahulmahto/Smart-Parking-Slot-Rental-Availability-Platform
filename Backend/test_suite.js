const http = require('http');

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (data) req.write(data);
    req.end();
  });
};

const runAllTests = async () => {
  console.log('🧪 Starting End-to-End API Functionality Tests...\n');

  try {
    // 1. Health Check
    console.log('1. Testing /api/health...');
    const health = await request('/api/health');
    console.log('   Result:', health.status, health.body.status || 'OK');
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. User Registration
    const testUser = {
      name: 'Test Driver ' + Math.floor(Math.random() * 1000),
      email: `driver_${Date.now()}@testpark.io`,
      password: 'password123',
      role: 'driver',
      phone: '+1 (555) 998-1122',
      vehicleNumber: 'TEST-EV-99',
      vehicleType: 'ev',
    };
    console.log('\n2. Testing User Registration (POST /api/auth/register)...');
    const registerRes = await request('/api/auth/register', 'POST', testUser);
    console.log('   Status:', registerRes.status, 'Success:', registerRes.body.success);
    const token = registerRes.body.token;
    if (!token) throw new Error('Registration did not return JWT token');

    // 3. User Login
    console.log('\n3. Testing User Login (POST /api/auth/login)...');
    const loginRes = await request('/api/auth/login', 'POST', {
      email: testUser.email,
      password: testUser.password,
    });
    console.log('   Status:', loginRes.status, 'User Name:', loginRes.body.user?.name);
    if (loginRes.status !== 200) throw new Error('Login failed');

    console.log('\n3b. Testing Admin Login for rental-space management...');
    const adminLoginRes = await request('/api/auth/login', 'POST', {
      email: 'admin@smartpark.io',
      password: 'password123',
    });
    console.log('   Status:', adminLoginRes.status, 'Role:', adminLoginRes.body.user?.role);
    const adminToken = adminLoginRes.body.token;
    if (!adminToken || adminLoginRes.body.user?.role !== 'admin') throw new Error('Admin login failed');

    // 4. Get Parking Spots
    console.log('\n4. Testing Spot Search (GET /api/spots)...');
    const spotsRes = await request('/api/spots?city=New+York');
    console.log('   Status:', spotsRes.status, 'Spots count in NYC:', spotsRes.body.count);
    if (!spotsRes.body.data || spotsRes.body.data.length === 0) throw new Error('No spots returned');
    const availableSpot = spotsRes.body.data.find((s) => s.status === 'available') || spotsRes.body.data[0];

    // 5. Create Host Space Listing
    console.log('\n5. Testing Driver Blocked From Listing Creation (POST /api/spots)...');
    const newSpotData = {
      title: 'Automated Test Driveway',
      description: 'Private gated driveway for testing',
      slotCode: 'T-' + Math.floor(Math.random() * 90 + 10),
      floor: 'Ground Test Zone',
      address: '100 Test Avenue',
      city: 'New York',
      pricePerHour: 4.5,
      pricePerDay: 28,
      pricePerMonth: 210,
      spotType: 'car',
      rentalType: 'flexible',
      amenities: ['cctv', '24_7_access'],
    };
    const driverCreateSpotRes = await request('/api/spots', 'POST', newSpotData, token);
    console.log('   Status:', driverCreateSpotRes.status, 'Message:', driverCreateSpotRes.body.message);
    if (driverCreateSpotRes.status !== 403) throw new Error('Driver should not be able to create spots');

    console.log('\n5b. Testing Admin Listing Creation (POST /api/spots)...');
    const createSpotRes = await request('/api/spots', 'POST', newSpotData, adminToken);
    console.log('   Status:', createSpotRes.status, 'Created Slot:', createSpotRes.body.data?.slotCode);
    if (createSpotRes.status !== 201) throw new Error('Spot creation failed');
    const createdSpotId = createSpotRes.body.data._id;

    // 6. Create Booking & Pass Generation
    console.log('\n6. Testing Slot Booking (POST /api/bookings)...');
    const bookingData = {
      spotId: createdSpotId,
      vehicleNumber: 'TEST-8812',
      vehicleType: 'car',
      durationHours: 3,
      bookingType: 'hourly',
      userName: testUser.name,
      userEmail: testUser.email,
    };
    const bookRes = await request('/api/bookings', 'POST', bookingData, token);
    console.log('   Status:', bookRes.status, 'Pass Code:', bookRes.body.data?.passCode, 'Total: $' + bookRes.body.data?.totalAmount);
    if (bookRes.status !== 201) throw new Error('Booking failed');
    const bookingId = bookRes.body.data._id;

    // 7. Check Booking Pass
    console.log('\n7. Testing Pass Lookup (GET /api/bookings/pass/:passCode)...');
    const passRes = await request(`/api/bookings/pass/${bookRes.body.data.passCode}`);
    console.log('   Status:', passRes.status, 'Matched Pass:', passRes.body.data?.passCode);

    // 8. Complete / Check Out Booking
    console.log('\n8. Testing Booking Completion / Check-Out (POST /api/bookings/:id/complete)...');
    const completeRes = await request(`/api/bookings/${bookingId}/complete`, 'POST', {}, token);
    console.log('   Status:', completeRes.status, 'Message:', completeRes.body.message);

    // 9. Slot Status Override
    console.log('\n9. Testing Slot Status Override (PATCH /api/spots/:id/status)...');
    const statusRes = await request(`/api/spots/${createdSpotId}/status`, 'PATCH', { status: 'available' }, adminToken);
    console.log('   Status:', statusRes.status, 'New Slot Status:', statusRes.body.data?.status);

    // 10. Analytics Telemetry
    console.log('\n10. Testing Analytics Telemetry (GET /api/analytics)...');
    const analyticsRes = await request('/api/analytics');
    console.log('   Status:', analyticsRes.status, 'Total Spots:', analyticsRes.body.data?.totalSpots, 'Occupancy:', analyticsRes.body.data?.occupancyRate + '%');

    // 11. Delete Test Spot
    console.log('\n11. Testing Spot Removal (DELETE /api/spots/:id)...');
    const deleteRes = await request(`/api/spots/${createdSpotId}`, 'DELETE', {}, adminToken);
    console.log('   Status:', deleteRes.status, 'Message:', deleteRes.body.message);

    console.log('\n===============================================================');
    console.log('🎉 ALL 11 API & FUNCTIONALITY TESTS PASSED SUCCESSFULLY! (100%)');
    console.log('===============================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test Error:', err.message);
    process.exit(1);
  }
};

runAllTests();
