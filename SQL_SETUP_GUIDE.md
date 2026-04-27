# SQL Database Setup Guide

## Database: PostgreSQL

Your e-waste management system uses **PostgreSQL**, a powerful open-source SQL database.

## Prerequisites

### Install PostgreSQL

#### Windows
1. Download from https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the `postgres` user
4. Default port: 5432

#### macOS
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Database Setup

### Step 1: Create Database

#### Option A: Using psql command line
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ewaste_db;

# Exit psql
\q
```

#### Option B: Using pgAdmin (GUI)
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Name: `ewaste_db`
5. Click "Save"

### Step 2: Configure Backend Environment

Edit `backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ewaste_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Alternative: Use DATABASE_URL (single connection string)
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ewaste_db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### Step 3: Run Database Setup Script

The setup script will create all necessary tables, indexes, and triggers:

```bash
cd backend
npm run setup-db
```

This creates:
- `users` table
- `pickup_requests` table
- `devices` table
- `device_images` table
- `recycling_records` table
- `collection_routes` table
- Indexes for performance
- Triggers for automatic timestamps

## Database Schema

### Tables Created

#### 1. users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Roles**: `user`, `admin`, `collector`, `recycler`

#### 2. pickup_requests
```sql
CREATE TABLE pickup_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    pickup_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    total_estimated_value DECIMAL(10, 2),
    collector_id UUID REFERENCES users(id),
    recycler_id UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Status values**: `pending`, `scheduled`, `in-progress`, `completed`, `cancelled`

#### 3. devices
```sql
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pickup_request_id UUID REFERENCES pickup_requests(id) ON DELETE CASCADE,
    device_type VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    condition VARCHAR(20) NOT NULL,
    quantity INTEGER DEFAULT 1,
    estimated_value DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Device types**: `laptop`, `desktop`, `smartphone`, `tablet`, `monitor`, `printer`, `other`

**Conditions**: `working`, `partially-working`, `not-working`, `broken`

#### 4. device_images
```sql
CREATE TABLE device_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. recycling_records
```sql
CREATE TABLE recycling_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pickup_request_id UUID REFERENCES pickup_requests(id),
    recycler_id UUID REFERENCES users(id),
    material_type VARCHAR(50) NOT NULL,
    weight_kg DECIMAL(10, 2) NOT NULL,
    value DECIMAL(10, 2),
    processed_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. collection_routes
```sql
CREATE TABLE collection_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collector_id UUID REFERENCES users(id),
    route_name VARCHAR(255) NOT NULL,
    pickup_request_ids UUID[] DEFAULT '{}',
    scheduled_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'planned',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Useful SQL Commands

### View All Tables
```sql
\dt
```

### View Table Structure
```sql
\d users
\d pickup_requests
\d devices
```

### Check All Users
```sql
SELECT id, name, email, role, is_active, created_at 
FROM users 
ORDER BY created_at DESC;
```

### Check Pickup Requests
```sql
SELECT 
    pr.id,
    u.name as user_name,
    pr.address,
    pr.pickup_date,
    pr.status,
    pr.total_estimated_value,
    COUNT(d.id) as device_count
FROM pickup_requests pr
JOIN users u ON pr.user_id = u.id
LEFT JOIN devices d ON d.pickup_request_id = pr.id
GROUP BY pr.id, u.name, pr.address, pr.pickup_date, pr.status, pr.total_estimated_value
ORDER BY pr.created_at DESC;
```

### Check Devices for a Pickup Request
```sql
SELECT 
    d.device_type,
    d.brand,
    d.model,
    d.condition,
    d.quantity,
    d.estimated_value
FROM devices d
WHERE d.pickup_request_id = 'your-pickup-request-id';
```

### Find Inactive Users (90+ days)
```sql
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.last_login,
    CURRENT_DATE - u.last_login::date as inactive_days,
    COUNT(pr.id) as total_requests
FROM users u
LEFT JOIN pickup_requests pr ON u.id = pr.user_id
WHERE u.last_login < CURRENT_DATE - INTERVAL '90 days'
   OR u.last_login IS NULL
GROUP BY u.id, u.name, u.email, u.role, u.last_login
ORDER BY inactive_days DESC;
```

### Create Admin User
```sql
-- First, register a user through the app, then update their role
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Create Test Users
```sql
-- Create a collector
INSERT INTO users (name, email, password, role, phone, address)
VALUES (
    'John Collector',
    'collector@example.com',
    '$2b$10$YourHashedPasswordHere',
    'collector',
    '+1234567890',
    '123 Collector St'
);

-- Create a recycler
INSERT INTO users (name, email, password, role, phone, address)
VALUES (
    'Jane Recycler',
    'recycler@example.com',
    '$2b$10$YourHashedPasswordHere',
    'recycler',
    '+1234567891',
    '456 Recycler Ave'
);
```

### View Statistics
```sql
-- Total users by role
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;

-- Pickup requests by status
SELECT status, COUNT(*) as count
FROM pickup_requests
GROUP BY status;

-- Total estimated value
SELECT SUM(total_estimated_value) as total_value
FROM pickup_requests
WHERE status = 'completed';

-- Most common device types
SELECT device_type, COUNT(*) as count
FROM devices
GROUP BY device_type
ORDER BY count DESC;
```

## Database Backup and Restore

### Backup Database
```bash
# Backup entire database
pg_dump -U postgres ewaste_db > ewaste_backup.sql

# Backup with timestamp
pg_dump -U postgres ewaste_db > ewaste_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
# Drop existing database (careful!)
dropdb -U postgres ewaste_db

# Create new database
createdb -U postgres ewaste_db

# Restore from backup
psql -U postgres ewaste_db < ewaste_backup.sql
```

## Database Maintenance

### Vacuum Database (Clean up)
```sql
VACUUM ANALYZE;
```

### Check Database Size
```sql
SELECT 
    pg_size_pretty(pg_database_size('ewaste_db')) as database_size;
```

### Check Table Sizes
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Indexes for Performance

The setup script creates these indexes automatically:

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Pickup request queries
CREATE INDEX idx_pickup_requests_user_id ON pickup_requests(user_id);
CREATE INDEX idx_pickup_requests_status ON pickup_requests(status);
CREATE INDEX idx_pickup_requests_pickup_date ON pickup_requests(pickup_date);

-- Device queries
CREATE INDEX idx_devices_pickup_request_id ON devices(pickup_request_id);
CREATE INDEX idx_devices_device_type ON devices(device_type);

-- Recycling records
CREATE INDEX idx_recycling_records_pickup_request_id ON recycling_records(pickup_request_id);
CREATE INDEX idx_recycling_records_recycler_id ON recycling_records(recycler_id);

-- Collection routes
CREATE INDEX idx_collection_routes_collector_id ON collection_routes(collector_id);
CREATE INDEX idx_collection_routes_scheduled_date ON collection_routes(scheduled_date);
```

## Troubleshooting

### Can't connect to database
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Check connection
psql -U postgres -h localhost -p 5432
```

### Permission denied
```bash
# Grant permissions
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE ewaste_db TO your_user;
```

### Reset database
```bash
# Drop and recreate
dropdb -U postgres ewaste_db
createdb -U postgres ewaste_db
cd backend
npm run setup-db
```

### View logs
```bash
# PostgreSQL logs location
# Linux: /var/log/postgresql/
# macOS: /usr/local/var/log/
# Windows: C:\Program Files\PostgreSQL\15\data\log\
```

## Connection Pooling

The application uses connection pooling for better performance:

```javascript
// backend/src/config/database.js
const pool = new Pool({
  max: 20,                      // Maximum connections
  idleTimeoutMillis: 30000,     // Close idle connections after 30s
  connectionTimeoutMillis: 2000 // Timeout after 2s
});
```

## Security Best Practices

1. **Never commit `.env` file** - Contains database credentials
2. **Use strong passwords** - For database users
3. **Limit database access** - Only from application server
4. **Regular backups** - Automated daily backups
5. **Use SSL/TLS** - For production database connections
6. **Parameterized queries** - Already implemented (prevents SQL injection)
7. **Least privilege** - Create separate DB user for application

### Create Application Database User
```sql
-- Create user with limited privileges
CREATE USER ewaste_app WITH PASSWORD 'secure_password';

-- Grant only necessary privileges
GRANT CONNECT ON DATABASE ewaste_db TO ewaste_app;
GRANT USAGE ON SCHEMA public TO ewaste_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ewaste_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ewaste_app;

-- Update .env to use this user
DB_USER=ewaste_app
DB_PASSWORD=secure_password
```

## Production Considerations

### For Production Deployment:

1. **Use managed database service**
   - AWS RDS for PostgreSQL
   - Google Cloud SQL
   - Azure Database for PostgreSQL
   - DigitalOcean Managed Databases

2. **Enable SSL connections**
```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
```

3. **Set up automated backups**
4. **Monitor database performance**
5. **Use read replicas** for scaling
6. **Implement connection retry logic**
7. **Set up database monitoring and alerts**

## Testing Database Connection

```bash
cd backend
node -e "import('./src/config/database.js').then(m => m.default.query('SELECT NOW()')).then(r => console.log('✅ Connected:', r.rows[0])).catch(e => console.error('❌ Error:', e))"
```

## Summary

Your e-waste management system uses:
- ✅ **PostgreSQL** - Robust SQL database
- ✅ **6 tables** - Normalized schema
- ✅ **Indexes** - Optimized queries
- ✅ **Foreign keys** - Data integrity
- ✅ **Triggers** - Auto-update timestamps
- ✅ **Connection pooling** - Better performance
- ✅ **Parameterized queries** - SQL injection prevention

The database is production-ready and follows SQL best practices!
