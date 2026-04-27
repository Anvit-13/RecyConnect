import pool, { generateId } from '../config/database.js';
import { hashPassword, comparePassword, generateToken, formatResponse, formatError } from '../utils/helpers.js';

export const register = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { name, email, password, phone, address, role = 'user' } = req.body;

    // Check if user exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json(formatError('Email already registered'));
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Generate UUID
    const userId = generateId();

    // Insert user
    await client.query(
      `INSERT INTO users (id, name, email, password, phone, address, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, email, hashedPassword, phone || null, address || null, role]
    );

    const user = { id: userId, name, email, phone, address, role, eco_points: 0 };
    const token = generateToken(user.id);

    res.status(201).json(formatResponse(true, { user, token }, 'Registration successful'));
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(formatError('Registration failed'));
  } finally {
    client.release();
  }
};

export const login = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { email, password } = req.body;

    // Find user
    const result = await client.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json(formatError('Invalid credentials'));
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json(formatError('Account is inactive'));
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json(formatError('Invalid credentials'));
    }

    // Update last login
    await client.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    delete user.password;

    res.json(formatResponse(true, { user, token }, 'Login successful'));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(formatError('Login failed'));
  } finally {
    client.release();
  }
};

export const getProfile = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      'SELECT id, name, email, phone, address, role, is_active, eco_points, last_login, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json(formatError('User not found'));
    }

    res.json(formatResponse(true, { user: result.rows[0] }));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(formatError('Failed to fetch profile'));
  } finally {
    client.release();
  }
};

export const updateProfile = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { name, phone, address } = req.body;

    await client.query(
      `UPDATE users 
       SET name = COALESCE(?, name), 
           phone = COALESCE(?, phone), 
           address = COALESCE(?, address)
       WHERE id = ?`,
      [name || null, phone || null, address || null, req.user.id]
    );

    const result = await client.query(
      'SELECT id, name, email, phone, address, role, eco_points, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(formatResponse(true, { user: result.rows[0] }, 'Profile updated successfully'));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json(formatError('Failed to update profile'));
  } finally {
    client.release();
  }
};

export const changePassword = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { currentPassword, newPassword } = req.body;

    // Get current password
    const result = await client.query(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );

    const user = result.rows[0];

    // Verify current password
    const isValid = await comparePassword(currentPassword, user.password);
    
    if (!isValid) {
      return res.status(400).json(formatError('Current password is incorrect'));
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await client.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json(formatResponse(true, null, 'Password changed successfully'));
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json(formatError('Failed to change password'));
  } finally {
    client.release();
  }
};
