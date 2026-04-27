import pool, { generateId } from '../config/database.js';
import { formatResponse, formatError, hashPassword } from '../utils/helpers.js';

export const getAllUsers = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, email, phone, role, is_active, last_login, created_at FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ` AND role = ?`;
      params.push(role);
    }

    if (isActive !== undefined) {
      query += ` AND is_active = ?`;
      params.push(isActive === 'true' ? 1 : 0);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await client.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
    const countParams = [];
    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }
    if (isActive !== undefined) {
      countQuery += ` AND is_active = ?`;
      countParams.push(isActive === 'true' ? 1 : 0);
    }

    const countResult = await client.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json(formatResponse(true, {
      users: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json(formatError('Failed to fetch users'));
  } finally {
    client.release();
  }
};

export const getInactiveUsers = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { days = 90 } = req.query;

    const result = await client.query(
      `SELECT id, name, email, role, last_login, created_at,
              COALESCE(DATEDIFF(CURRENT_TIMESTAMP, last_login), 
                       DATEDIFF(CURRENT_TIMESTAMP, created_at)) as inactive_days,
              (SELECT COUNT(*) FROM pickup_requests WHERE user_id = users.id) as total_requests
       FROM users
       WHERE is_active = 1
         AND (last_login < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL ? DAY)
              OR (last_login IS NULL AND created_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL ? DAY)))
       ORDER BY inactive_days DESC`,
      [parseInt(days), parseInt(days)]
    );

    res.json(formatResponse(true, { inactiveUsers: result.rows }));
  } catch (error) {
    console.error('Get inactive users error:', error);
    res.status(500).json(formatError('Failed to fetch inactive users'));
  } finally {
    client.release();
  }
};

export const deleteUser = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json(formatError('Cannot delete your own account'));
    }

    const result = await client.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json(formatError('User not found'));
    }

    res.json(formatResponse(true, null, 'User deleted successfully'));
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json(formatError('Failed to delete user'));
  } finally {
    client.release();
  }
};

export const toggleUserStatus = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;

    const result = await client.query(
      'UPDATE users SET is_active = NOT is_active WHERE id = ?',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json(formatError('User not found'));
    }
    
    const updated = await client.query('SELECT id, is_active FROM users WHERE id = ?', [id]);

    res.json(formatResponse(true, { user: updated.rows[0] }, 'User status updated successfully'));
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json(formatError('Failed to update user status'));
  } finally {
    client.release();
  }
};

export const createUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Check if user exists
    const checkResult = await client.query('SELECT id FROM users WHERE email = ?', [email]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json(formatError('User with this email already exists'));
    }

    const userId = generateId();
    const hashedPassword = await hashPassword(password);

    await client.query(
      `INSERT INTO users (id, name, email, password, role, phone, address, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [userId, name, email, hashedPassword, role, phone, address]
    );

    const newUser = { id: userId, name, email, role, phone, address, is_active: 1 };

    res.status(201).json(formatResponse(true, { user: newUser }, 'User created successfully'));
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json(formatError('Failed to create user'));
  } finally {
    client.release();
  }
};

export const updateUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { name, email, password, role, phone, address } = req.body;

    // Check if user exists
    const checkResult = await client.query('SELECT id FROM users WHERE id = ?', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json(formatError('User not found'));
    }

    let query = 'UPDATE users SET name = ?, email = ?, role = ?, phone = ?, address = ?';
    const params = [name, email, role, phone, address];

    if (password) {
      const hashedPassword = await hashPassword(password);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await client.query(query, params);

    const updated = await client.query(
      'SELECT id, name, email, role, phone, address, is_active FROM users WHERE id = ?',
      [id]
    );

    res.json(formatResponse(true, { user: updated.rows[0] }, 'User updated successfully'));
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json(formatError('Failed to update user'));
  } finally {
    client.release();
  }
};

export const getDashboardStats = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const statsResult = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_customers,
        (SELECT COUNT(*) FROM users WHERE role = 'collector') as total_collectors,
        (SELECT COUNT(*) FROM users WHERE role = 'recycler') as total_recyclers,
        (SELECT COUNT(*) FROM pickup_requests) as total_requests,
        (SELECT COUNT(*) FROM pickup_requests WHERE status = 'pending') as pending_requests,
        (SELECT COUNT(*) FROM pickup_requests WHERE status = 'completed') as completed_requests,
        (SELECT COALESCE(SUM(total_estimated_value), 0) FROM pickup_requests WHERE status = 'completed') as total_value_recycled
    `);

    // Monthly trends (last 6 months)
    const trendsResult = await client.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as requests,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM pickup_requests
      WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);

    // Format month for frontend (e.g. "2026-03" -> "Mar")
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRequests = trendsResult.rows.map(row => {
      const [year, monthStr] = row.month.split('-');
      return {
        month: monthNames[parseInt(monthStr) - 1],
        requests: parseInt(row.requests),
        completed: parseInt(row.completed),
        pending: parseInt(row.pending)
      };
    });

    // Device types distribution
    const devicesResult = await client.query(`
      SELECT device_type as name, COUNT(*) as value
      FROM devices
      GROUP BY device_type
    `);

    const colors = ['#10b981', '#14b8a6', '#059669', '#0d9488', '#6ee7b7', '#a7f3d0'];
    const deviceTypes = devicesResult.rows.map((row, index) => ({
      name: row.name.charAt(0).toUpperCase() + row.name.slice(1),
      value: parseInt(row.value),
      color: colors[index % colors.length]
    }));

    // Recycling Stats (by material type)
    const recyclingResult = await client.query(`
      SELECT material_type as category, SUM(weight_kg) as weight
      FROM recycling_records
      GROUP BY material_type
    `);

    const recyclingColors = ['#eab308', '#94a3b8', '#3b82f6', '#f59e0b', '#ef4444'];
    const recyclingStats = recyclingResult.rows.map((row, index) => ({
      category: row.category,
      weight: parseFloat(row.weight),
      color: recyclingColors[index % recyclingColors.length]
    }));

    res.json(formatResponse(true, { 
      stats: statsResult.rows[0],
      monthlyRequests,
      deviceTypes,
      recyclingStats
    }));
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json(formatError('Failed to fetch dashboard stats'));
  } finally {
    client.release();
  }
};
