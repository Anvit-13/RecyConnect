import pool, { generateId } from './database.js';
import { hashPassword } from '../utils/helpers.js';

const setupDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('🔧 Setting up MySQL database schema...');

    // Drop existing tables to ensure clean schema (Dev only)
    await client.query('SET FOREIGN_KEY_CHECKS = 0');
    await client.query('DROP TABLE IF EXISTS collection_routes');
    await client.query('DROP TABLE IF EXISTS recycling_records');
    await client.query('DROP TABLE IF EXISTS device_images');
    await client.query('DROP TABLE IF EXISTS devices');
    await client.query('DROP TABLE IF EXISTS pickup_requests');
    await client.query('DROP TABLE IF EXISTS users');
    await client.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('🔧 Setting up MySQL database schema...');

    // Users table
    await client.query(`
      CREATE TABLE users (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        role ENUM('user', 'admin', 'collector', 'recycler') NOT NULL DEFAULT 'user',
        is_active TINYINT(1) DEFAULT 1,
        eco_points INT DEFAULT 0,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Pickup requests table
    await client.query(`
      CREATE TABLE pickup_requests (
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        address TEXT NOT NULL,
        pickup_date DATE NOT NULL,
        status ENUM('pending', 'scheduled', 'in-progress', 'collected', 'delivered', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        total_estimated_value DECIMAL(10,2),
        collector_id CHAR(36),
        recycler_id CHAR(36),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (collector_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (recycler_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Devices table
    await client.query(`
      CREATE TABLE devices (
        id CHAR(36) PRIMARY KEY,
        pickup_request_id CHAR(36) NOT NULL,
        device_type VARCHAR(100) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        \`condition\` ENUM('working', 'partially-working', 'not-working', 'broken') NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        estimated_value DECIMAL(10,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pickup_request_id) REFERENCES pickup_requests(id) ON DELETE CASCADE
      );
    `);

    // Device images table
    await client.query(`
      CREATE TABLE device_images (
        id CHAR(36) PRIMARY KEY,
        device_id CHAR(36) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
      );
    `);

    // Recycling records table
    await client.query(`
      CREATE TABLE recycling_records (
        id CHAR(36) PRIMARY KEY,
        pickup_request_id CHAR(36) NOT NULL,
        recycler_id CHAR(36) NOT NULL,
        material_type VARCHAR(100) NOT NULL,
        weight_kg DECIMAL(10,2) NOT NULL,
        value_usd DECIMAL(10,2) DEFAULT 0,
        processing_date DATE NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pickup_request_id) REFERENCES pickup_requests(id) ON DELETE CASCADE,
        FOREIGN KEY (recycler_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Collection routes table
    await client.query(`
      CREATE TABLE collection_routes (
        id CHAR(36) PRIMARY KEY,
        collector_id CHAR(36) NOT NULL,
        route_name VARCHAR(255) NOT NULL,
        area VARCHAR(255) NOT NULL,
        schedule_day VARCHAR(20),
        \`date\` DATE,
        status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
        vehicle_id VARCHAR(50),
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (collector_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create indexes for better performance
    // Note: MySQL automatically creates indexes for UNIQUE and FOREIGN KEY columns
    try { await client.query(`CREATE INDEX idx_users_role ON users(role);`); } catch(e) {}
    try { await client.query(`CREATE INDEX idx_pickup_requests_status ON pickup_requests(status);`); } catch(e) {}

    console.log('🌱 Seeding default users...');
    const hashedAdminPassword = await hashPassword('admin123');
    const hashedCollectorPassword = await hashPassword('collector123');
    const hashedRecyclerPassword = await hashPassword('recycler123');

    // Default Admin
    await client.query(`
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `, [generateId(), 'System Admin', 'admin@recyconnect.com', hashedAdminPassword, 'admin']);

    // Default Collector
    await client.query(`
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `, [generateId(), 'Test Collector', 'collector@example.com', hashedCollectorPassword, 'collector']);

    // Default Recycler
    await client.query(`
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `, [generateId(), 'Green Recycling Co.', 'recycler@example.com', hashedRecyclerPassword, 'recycler']);

    console.log('✅ MySQL database schema and seed data created successfully!');
    console.log('📊 Tables created: users, pickup_requests, devices, device_images, recycling_records, collection_routes');
    console.log('👥 Default accounts created: admin@recyconnect.com, collector@example.com, recycler@example.com (Password: userrole + 123)');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    if (client.release) client.release();
    await pool.end();
  }
};

setupDatabase()
  .then(() => {
    console.log('🎉 Database setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  });
