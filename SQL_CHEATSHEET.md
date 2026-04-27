# SQL Cheatsheet - E-Waste Management System

Quick reference for common SQL operations in your e-waste management system.

## Connect to Database

```bash
# Connect to PostgreSQL
psql -U postgres ewaste_db

# Or with password prompt
psql -U postgres -d ewaste_db -h localhost
```

## Basic Commands

```sql
-- List all tables
\dt

-- Describe table structure
\d users
\d pickup_requests
\d devices

-- List all databases
\l

-- Switch database
\c ewaste_db

-- Quit psql
\q
```

## User Management

### View All Users
```sql
SELECT id, name, email, role, is_active, created_at 
FROM users 
ORDER BY created_at DESC;
```

### Create Admin User
```sql
-- First register through the app, then:
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

### Find User by Email
```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

### Count Users by Role
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

### Deactivate User
```sql
UPDATE users 
SET is_active = false 
WHERE email = 'user@example.com';
```

### Delete User (and all their data)
```sql
DELETE FROM users WHERE email = 'user@example.com';
-- Note: This cascades to pickup_requests and devices
```

## Pickup Requests

### View All Pickup Requests
```sql
SELECT 
    pr.id,
    u.name as user_name,
    u.email,
    pr.address,
    pr.pickup_date,
    pr.status,
    pr.total_estimated_value,
    pr.created_at
FROM pickup_requests pr
JOIN users u ON pr.user_id = u.id
ORDER BY pr.created_at DESC;
```

### View Pickup Requests with Device Count
```sql
SELECT 
    pr.id,
    u.name as user_name,
    pr.status,
    pr.pickup_date,
    COUNT(d.id) as device_count,
    pr.total_estimated_value
FROM pickup_requests pr
JOIN users u ON pr.user_id = u.id
LEFT JOIN devices d ON d.pickup_request_id = pr.id
GROUP BY pr.id, u.name, pr.status, pr.pickup_date, pr.total_estimated_value
ORDER BY pr.created_at DESC;
```

### View Pending Requests
```sql
SELECT * FROM pickup_requests 
WHERE status = 'pending' 
ORDER BY pickup_date;
```

### Update Request Status
```sql
UPDATE pickup_requests 
SET status = 'completed' 
WHERE id = 'request-id-here';
```

### Assign Collector to Request
```sql
UPDATE pickup_requests 
SET collector_id = 'collector-user-id',
    status = 'scheduled'
WHERE id = 'request-id-here';
```

### Count Requests by Status
```sql
SELECT status, COUNT(*) as count 
FROM pickup_requests 
GROUP BY status;
```

## Devices

### View All Devices
```sql
SELECT 
    d.id,
    d.device_type,
    d.brand,
    d.model,
    d.condition,
    d.quantity,
    d.estimated_value,
    pr.id as request_id,
    u.name as user_name
FROM devices d
JOIN pickup_requests pr ON d.pickup_request_id = pr.id
JOIN users u ON pr.user_id = u.id
ORDER BY d.created_at DESC;
```

### View Devices for Specific Request
```sql
SELECT * FROM devices 
WHERE pickup_request_id = 'request-id-here';
```

### Count Devices by Type
```sql
SELECT device_type, COUNT(*) as count 
FROM devices 
GROUP BY device_type 
ORDER BY count DESC;
```

### Total Estimated Value by Device Type
```sql
SELECT 
    device_type,
    COUNT(*) as count,
    SUM(estimated_value) as total_value,
    AVG(estimated_value) as avg_value
FROM devices
GROUP BY device_type
ORDER BY total_value DESC;
```

### Find High-Value Devices
```sql
SELECT 
    d.device_type,
    d.brand,
    d.model,
    d.estimated_value,
    u.name as owner
FROM devices d
JOIN pickup_requests pr ON d.pickup_request_id = pr.id
JOIN users u ON pr.user_id = u.id
WHERE d.estimated_value > 10000
ORDER BY d.estimated_value DESC;
```

## Inactive Users

### Find Users Inactive for 90+ Days
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
HAVING CURRENT_DATE - u.last_login::date > 90 OR u.last_login IS NULL
ORDER BY inactive_days DESC NULLS LAST;
```

### Find Users Who Never Logged In
```sql
SELECT id, name, email, created_at 
FROM users 
WHERE last_login IS NULL;
```

### Find Users with Zero Requests
```sql
SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN pickup_requests pr ON u.id = pr.user_id
WHERE pr.id IS NULL
  AND u.role = 'user';
```

## Statistics & Reports

### Dashboard Statistics
```sql
-- Total users by role
SELECT 
    COUNT(*) FILTER (WHERE role = 'user') as total_users,
    COUNT(*) FILTER (WHERE role = 'collector') as total_collectors,
    COUNT(*) FILTER (WHERE role = 'recycler') as total_recyclers,
    COUNT(*) FILTER (WHERE role = 'admin') as total_admins
FROM users;

-- Request statistics
SELECT 
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    SUM(total_estimated_value) as total_value
FROM pickup_requests;
```

### Monthly Request Trend
```sql
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as request_count,
    SUM(total_estimated_value) as total_value
FROM pickup_requests
WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;
```

### Top Users by Request Count
```sql
SELECT 
    u.name,
    u.email,
    COUNT(pr.id) as request_count,
    SUM(pr.total_estimated_value) as total_value
FROM users u
JOIN pickup_requests pr ON u.id = pr.user_id
GROUP BY u.id, u.name, u.email
ORDER BY request_count DESC
LIMIT 10;
```

### Device Condition Distribution
```sql
SELECT 
    condition,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM devices
GROUP BY condition
ORDER BY count DESC;
```

## Data Cleanup

### Delete Old Cancelled Requests (older than 6 months)
```sql
DELETE FROM pickup_requests 
WHERE status = 'cancelled' 
  AND created_at < CURRENT_DATE - INTERVAL '6 months';
```

### Archive Completed Requests (example)
```sql
-- First create archive table
CREATE TABLE pickup_requests_archive AS 
SELECT * FROM pickup_requests WHERE 1=0;

-- Move old completed requests
INSERT INTO pickup_requests_archive
SELECT * FROM pickup_requests
WHERE status = 'completed' 
  AND created_at < CURRENT_DATE - INTERVAL '1 year';

-- Delete from main table
DELETE FROM pickup_requests
WHERE status = 'completed' 
  AND created_at < CURRENT_DATE - INTERVAL '1 year';
```

## Backup & Restore

### Backup Database
```bash
# Full backup
pg_dump -U postgres ewaste_db > backup.sql

# Backup with timestamp
pg_dump -U postgres ewaste_db > backup_$(date +%Y%m%d).sql

# Backup specific tables
pg_dump -U postgres -t users -t pickup_requests ewaste_db > users_backup.sql
```

### Restore Database
```bash
# Restore full backup
psql -U postgres ewaste_db < backup.sql

# Restore specific tables
psql -U postgres ewaste_db < users_backup.sql
```

## Performance

### Check Table Sizes
```sql
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### View Active Queries
```sql
SELECT 
    pid,
    usename,
    application_name,
    state,
    query,
    query_start
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;
```

### Analyze Table Performance
```sql
ANALYZE users;
ANALYZE pickup_requests;
ANALYZE devices;
```

### Vacuum Database
```sql
VACUUM ANALYZE;
```

## Testing Data

### Insert Test User
```sql
INSERT INTO users (name, email, password, role, phone, address)
VALUES (
    'Test User',
    'test@example.com',
    '$2b$10$YourHashedPasswordHere',  -- Use bcrypt to hash
    'user',
    '+1234567890',
    '123 Test Street'
);
```

### Insert Test Pickup Request
```sql
-- First get a user ID
SELECT id FROM users WHERE email = 'test@example.com';

-- Then insert request
INSERT INTO pickup_requests (user_id, address, pickup_date, status, total_estimated_value)
VALUES (
    'user-id-from-above',
    '123 Test Street',
    CURRENT_DATE + INTERVAL '3 days',
    'pending',
    15000.00
);
```

### Insert Test Device
```sql
-- Get pickup request ID
SELECT id FROM pickup_requests ORDER BY created_at DESC LIMIT 1;

-- Insert device
INSERT INTO devices (pickup_request_id, device_type, brand, model, condition, quantity, estimated_value)
VALUES (
    'request-id-from-above',
    'laptop',
    'Apple',
    'MacBook Pro 14" M2 Pro',
    'working',
    1,
    15000.00
);
```

## Useful Queries

### Find Requests Without Devices
```sql
SELECT pr.* 
FROM pickup_requests pr
LEFT JOIN devices d ON pr.id = d.pickup_request_id
WHERE d.id IS NULL;
```

### Find Duplicate Emails
```sql
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;
```

### Recent Activity (Last 7 Days)
```sql
SELECT 
    'User' as type,
    name,
    email,
    created_at
FROM users
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'

UNION ALL

SELECT 
    'Request' as type,
    u.name,
    u.email,
    pr.created_at
FROM pickup_requests pr
JOIN users u ON pr.user_id = u.id
WHERE pr.created_at >= CURRENT_DATE - INTERVAL '7 days'

ORDER BY created_at DESC;
```

## Tips

1. **Always backup before major changes**
2. **Use transactions for multiple related updates**
3. **Test queries on small datasets first**
4. **Use EXPLAIN to analyze query performance**
5. **Keep indexes updated with ANALYZE**
6. **Monitor database size regularly**
7. **Use parameterized queries in application code** (already done)

## Transaction Example

```sql
BEGIN;

-- Update request status
UPDATE pickup_requests 
SET status = 'completed' 
WHERE id = 'request-id';

-- Update user last activity
UPDATE users 
SET last_login = CURRENT_TIMESTAMP 
WHERE id = 'user-id';

-- If everything looks good
COMMIT;

-- Or if something went wrong
-- ROLLBACK;
```

## Need Help?

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- SQL Tutorial: https://www.postgresql.org/docs/current/tutorial.html
- See `SQL_SETUP_GUIDE.md` for detailed setup instructions
