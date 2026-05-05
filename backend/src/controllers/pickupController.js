import pool, { generateId } from '../config/database.js';
import { calculateEstimatedValue, formatResponse, formatError } from '../utils/helpers.js';

export const createPickupRequest = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { address, pickupDate } = req.body;
  // devices arrives as a JSON string in multipart/form-data
  const devices = typeof req.body.devices === 'string' ? JSON.parse(req.body.devices) : req.body.devices;
    const userId = req.user.id;

    // Calculate total estimated value
    let totalEstimatedValue = 0;
    (devices || []).forEach(device => {
      const value = calculateEstimatedValue(device);
      totalEstimatedValue += value;
    });

    const pickupId = generateId();

    // Insert pickup request
    await client.query(
      `INSERT INTO pickup_requests (id, user_id, address, pickup_date, total_estimated_value, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [pickupId, userId, address, pickupDate, totalEstimatedValue]
    );

    const pickupRequest = {
      id: pickupId,
      user_id: userId,
      address,
      pickup_date: pickupDate,
      total_estimated_value: totalEstimatedValue,
      status: 'pending'
    };

    // Insert devices
    const devicePromises = (devices || []).map(device => {
      const estimatedValue = calculateEstimatedValue(device);
      const deviceId = generateId();
      return client.query(
        `INSERT INTO devices (id, pickup_request_id, device_type, brand, model, \`condition\`, quantity, estimated_value)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [deviceId, pickupId, device.deviceType, device.brand, device.model, device.condition, device.quantity, estimatedValue]
      ).then(() => ({
        id: deviceId,
        pickup_request_id: pickupId,
        device_type: device.deviceType,
        brand: device.brand,
        model: device.model,
        condition: device.condition,
        quantity: device.quantity,
        estimated_value: estimatedValue
      }));
    });

    const insertedDevices = await Promise.all(devicePromises);

    // Save uploaded images if any
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // For now, associate all images with the first device (or you could map differently)
      const firstDeviceId = insertedDevices.length > 0 ? insertedDevices[0].id : null;
      if (firstDeviceId) {
        const imageInsertPromises = req.files.map(file => {
          const imageUrl = `/uploads/${file.filename}`;
          return client.query(
            `INSERT INTO device_images (id, device_id, image_url) VALUES (?, ?, ?)`,
            [generateId(), firstDeviceId, imageUrl]
          );
        });
        await Promise.all(imageInsertPromises);
      }
    }

    await client.query('COMMIT');
    
    res.status(201).json(formatResponse(true, {
      pickupRequest,
      devices: insertedDevices
    }, 'Pickup request created successfully'));

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create pickup error:', error);
    // If files were uploaded, log their paths for debugging
    if (req.files && Array.isArray(req.files)) {
      console.log('Uploaded files:', req.files.map(f => f.filename));
    }
    res.status(500).json(formatError('Failed to create pickup request'));
  } finally {
    client.release();
  }
};

export const getUserPickupRequests = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT pr.*, 
              r.name as recycler_name,
              (
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'id', d.id,
                    'device_type', d.device_type,
                    'brand', d.brand,
                    'model', d.model,
                    'condition', d.\`condition\`,
                    'quantity', d.quantity,
                    'estimated_value', d.estimated_value
                  )
                )
                FROM devices d WHERE d.pickup_request_id = pr.id
              ) as devices,
              (SELECT COUNT(*) FROM devices d WHERE d.pickup_request_id = pr.id) as device_count
       FROM pickup_requests pr
       LEFT JOIN users r ON pr.recycler_id = r.id
       WHERE pr.user_id = ?
       ORDER BY pr.created_at DESC`,
      [req.user.id]
    );

    // Parse devices string to JSON if it's a string, handle null
    const pickupRequests = result.rows.map(row => ({
      ...row,
      devices: typeof row.devices === 'string' ? JSON.parse(row.devices || '[]') : (row.devices || [])
    }));

    res.json(formatResponse(true, { pickupRequests }));
  } catch (error) {
    console.error('Get pickup requests error:', error);
    res.status(500).json(formatError('Failed to fetch pickup requests'));
  } finally {
    client.release();
  }
};

export const getPickupRequestById = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;

    const result = await client.query(
      `SELECT pr.*, 
              u.name as user_name, u.email as user_email, u.phone as user_phone,
              c.name as collector_name,
              r.name as recycler_name,
              (
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'id', d.id,
                    'device_type', d.device_type,
                    'brand', d.brand,
                    'model', d.model,
                    'condition', d.\`condition\`,
                    'quantity', d.quantity,
                    'estimated_value', d.estimated_value
                  )
                )
                FROM devices d WHERE d.pickup_request_id = pr.id
              ) as devices
       FROM pickup_requests pr
       JOIN users u ON pr.user_id = u.id
       LEFT JOIN users c ON pr.collector_id = c.id
       LEFT JOIN users r ON pr.recycler_id = r.id
       WHERE pr.id = ?`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json(formatError('Pickup request not found'));
    }

    const row = result.rows[0];
    const pickupRequest = {
      ...row,
      devices: typeof row.devices === 'string' ? JSON.parse(row.devices || '[]') : (row.devices || [])
    };

    // Check authorization
    if (req.user.role === 'user' && pickupRequest.user_id !== req.user.id) {
      return res.status(403).json(formatError('Access denied'));
    }

    res.json(formatResponse(true, { pickupRequest }));
  } catch (error) {
    console.error('Get pickup request error:', error);
    res.status(500).json(formatError('Failed to fetch pickup request'));
  } finally {
    client.release();
  }
};

export const getAllPickupRequests = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT pr.*, 
             u.name as user_name, u.email as user_email,
             (
               SELECT JSON_ARRAYAGG(
                 JSON_OBJECT(
                   'id', d.id,
                   'device_type', d.device_type,
                   'brand', d.brand,
                   'model', d.model,
                   'condition', d.\`condition\`,
                   'quantity', d.quantity,
                   'estimated_value', d.estimated_value
                 )
               )
               FROM devices d WHERE d.pickup_request_id = pr.id
             ) as devices,
             (SELECT COUNT(*) FROM devices d WHERE d.pickup_request_id = pr.id) as device_count
      FROM pickup_requests pr
      JOIN users u ON pr.user_id = u.id
    `;

    const params = [];
    let whereClauses = [];

    if (status) {
      whereClauses.push(`pr.status = ?`);
      params.push(status);
    }

    if (req.user && req.user.role === 'recycler') {
      whereClauses.push(`pr.recycler_id = ?`);
      params.push(req.user.id);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ` + whereClauses.join(' AND ');
    }

    query += ` ORDER BY pr.created_at DESC
               LIMIT ? OFFSET ?`;
    
    // cast to number for mysql2 limit
    params.push(parseInt(limit), parseInt(offset));

    const result = await client.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM pickup_requests pr';
    const countParams = [];
    let countWhereClauses = [];

    if (status) {
      countWhereClauses.push('pr.status = ?');
      countParams.push(status);
    }

    if (req.user && req.user.role === 'recycler') {
      countWhereClauses.push('pr.recycler_id = ?');
      countParams.push(req.user.id);
    }

    if (countWhereClauses.length > 0) {
      countQuery += ' WHERE ' + countWhereClauses.join(' AND ');
    }
    const countResult = await client.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Parse devices string to JSON if it's a string, handle null
    const pickupRequests = result.rows.map(row => ({
      ...row,
      devices: typeof row.devices === 'string' ? JSON.parse(row.devices || '[]') : (row.devices || [])
    }));

    res.json(formatResponse(true, {
      pickupRequests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (error) {
    console.error('Get all pickup requests error:', error);
    res.status(500).json(formatError('Failed to fetch pickup requests'));
  } finally {
    client.release();
  }
};

export const updatePickupStatus = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { status, collectorId, recyclerId, notes } = req.body;

    const result = await client.query(
      `UPDATE pickup_requests 
       SET status = COALESCE(?, status),
           collector_id = COALESCE(?, collector_id),
           recycler_id = COALESCE(?, recycler_id),
           notes = COALESCE(?, notes)
       WHERE id = ?`,
      [status || null, collectorId || null, recyclerId || null, notes || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json(formatError('Pickup request not found'));
    }

    const updated = await client.query('SELECT * FROM pickup_requests WHERE id = ?', [id]);

    res.json(formatResponse(true, { pickupRequest: updated.rows[0] }, 'Pickup request updated successfully'));
  } catch (error) {
    console.error('Update pickup status error:', error);
    res.status(500).json(formatError('Failed to update pickup request'));
  } finally {
    client.release();
  }
};

export const deletePickupRequest = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;

    // Check if request exists and belongs to user
    const checkResult = await client.query(
      'SELECT user_id, status FROM pickup_requests WHERE id = ?',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json(formatError('Pickup request not found'));
    }

    const pickupRequest = checkResult.rows[0];

    // Only allow deletion if user owns it and status is pending
    if (req.user.role === 'user' && pickupRequest.user_id !== req.user.id) {
      return res.status(403).json(formatError('Access denied'));
    }

    if (pickupRequest.status !== 'pending') {
      return res.status(400).json(formatError('Cannot delete pickup request that is not pending'));
    }

    await client.query('DELETE FROM pickup_requests WHERE id = ?', [id]);

    res.json(formatResponse(true, null, 'Pickup request deleted successfully'));
  } catch (error) {
    console.error('Delete pickup request error:', error);
    res.status(500).json(formatError('Failed to delete pickup request'));
  } finally {
    client.release();
  }
};
