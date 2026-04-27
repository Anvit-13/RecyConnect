import pool, { generateId } from '../config/database.js';
import { formatResponse, formatError } from '../utils/helpers.js';

export const getRecyclerDashboardStats = async (req, res) => {
  const client = await pool.connect();
  try {
    const recyclerId = req.user.id;

    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM pickup_requests WHERE recycler_id = ?) as total_processed,
        (SELECT COUNT(*) FROM pickup_requests WHERE recycler_id = ? AND status = 'delivered') as processing,
        (SELECT COALESCE(SUM(weight_kg), 0) FROM recycling_records WHERE recycler_id = ?) as materials_recovered,
        (SELECT COALESCE(SUM(value_usd), 0) FROM recycling_records WHERE recycler_id = ?) as value_generated
    `, [recyclerId, recyclerId, recyclerId, recyclerId]);

    const processingQueue = await client.query(`
      SELECT pr.id, pr.address, pr.created_at, pr.status, pr.total_estimated_value,
             (SELECT COUNT(*) FROM devices WHERE pickup_request_id = pr.id) as device_count
      FROM pickup_requests pr
      WHERE pr.recycler_id = ? AND pr.status = 'delivered'
      ORDER BY pr.created_at DESC LIMIT 10
    `, [recyclerId]);

    const weeklyData = await client.query(`
      SELECT 
        DATE_FORMAT(processing_date, '%Y-%m-%d') as \`day\`, 
        SUM(weight_kg) as amount
      FROM recycling_records
      WHERE recycler_id = ? AND processing_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
      GROUP BY DATE_FORMAT(processing_date, '%Y-%m-%d')
      ORDER BY \`day\` ASC
    `, [recyclerId]);

    res.json(formatResponse(true, {
      stats: stats.rows[0],
      processingQueue: processingQueue.rows,
      weeklyData: weeklyData.rows
    }));
  } catch (error) {
    console.error('Get recycler dashboard error:', error);
    res.status(500).json(formatError('Failed to fetch dashboard stats'));
  } finally {
    client.release();
  }
};

export const getRecyclingRecords = async (req, res) => {
  const client = await pool.connect();
  try {
    const recyclerId = req.user.id;
    
    // Admin check: if admin, no recyclerId filter
    const isAdmin = req.user.role === 'admin';

    let query = `
      SELECT rr.id, rr.material_type, rr.weight_kg, rr.value_usd, rr.processing_date, 
             pr.id as pickup_id, u.name as recycler_name
      FROM recycling_records rr
      LEFT JOIN pickup_requests pr ON rr.pickup_request_id = pr.id
      LEFT JOIN users u ON rr.recycler_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (!isAdmin) {
      query += ` AND rr.recycler_id = ?`;
      params.push(recyclerId);
    }
    
    query += ` ORDER BY rr.processing_date DESC LIMIT 100`;

    const records = await client.query(query, params);

    res.json(formatResponse(true, { records: records.rows }));
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json(formatError('Failed to fetch recycling records'));
  } finally {
    client.release();
  }
};

export const getRecoveryMaterials = async (req, res) => {
  const client = await pool.connect();
  try {
    const recyclerId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let statsQuery = `
      SELECT material_type as name, 
             COUNT(*) as batches, 
             SUM(weight_kg) as weight,
             SUM(value_usd) as value
      FROM recycling_records
      WHERE 1=1
    `;
    const params = [];

    if (!isAdmin) {
      statsQuery += ` AND recycler_id = ?`;
      params.push(recyclerId);
    }
    
    statsQuery += ` GROUP BY material_type ORDER BY weight DESC`;

    const stats = await client.query(statsQuery, params);

    let monthlyQuery = `
      SELECT 
        DATE_FORMAT(processing_date, '%b') as month,
        SUM(CASE WHEN material_type = 'electronic' THEN weight_kg ELSE 0 END) as electronics,
        SUM(CASE WHEN material_type = 'battery' THEN weight_kg ELSE 0 END) as batteries,
        SUM(CASE WHEN material_type = 'metal' THEN weight_kg ELSE 0 END) as metals,
        SUM(CASE WHEN material_type = 'plastic' THEN weight_kg ELSE 0 END) as plastics
      FROM recycling_records
      WHERE processing_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
    `;
    
    if (!isAdmin) {
      monthlyQuery += ` AND recycler_id = ?`;
    }
    
    monthlyQuery += ` GROUP BY DATE_FORMAT(processing_date, '%b'), DATE_FORMAT(processing_date, '%m')
                      ORDER BY DATE_FORMAT(processing_date, '%m') ASC`;

    const monthlyRecovery = await client.query(monthlyQuery, isAdmin ? [] : [recyclerId]);

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
    const materialStats = stats.rows.map((row, idx) => ({
      ...row,
      color: colors[idx % colors.length]
    }));

    res.json(formatResponse(true, { 
      materialStats,
      monthlyRecovery: monthlyRecovery.rows 
    }));
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json(formatError('Failed to fetch material stats'));
  } finally {
    client.release();
  }
};

export const createRecyclingRecord = async (req, res) => {
  const client = await pool.connect();
  try {
    const recyclerId = req.user.id;
    const { pickupId, materialType, weight, value } = req.body;

    const id = generateId();

    await client.query(
      `INSERT INTO recycling_records (id, material_type, weight_kg, value_usd, recycler_id, pickup_request_id, processing_date)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE)`,
      [id, materialType, parseFloat(weight), parseFloat(value || 0), recyclerId, pickupId]
    );

    // Give eco points to the user (10 points per 1 USD value)
    const pickupResult = await client.query('SELECT user_id FROM pickup_requests WHERE id = ?', [pickupId]);
    if (pickupResult.rows && pickupResult.rows.length > 0) {
      const userId = pickupResult.rows[0].user_id;
      const points = Math.floor(parseFloat(value || 0) * 10);
      if (points > 0) {
        await client.query('UPDATE users SET eco_points = eco_points + ? WHERE id = ?', [points, userId]);
      }
    }

    res.json(formatResponse(true, null, 'Record created successfully'));
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json(formatError('Failed to create record'));
  } finally {
    client.release();
  }
};
