import pool from '../config/database.js';
import { formatResponse, formatError } from '../utils/helpers.js';

export const getCollectorDashboardStats = async (req, res) => {
  const client = await pool.connect();
  try {
    const collectorId = req.user.id;

    // Daily & weekly stats based on pickups & routes
    const statsResult = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM pickup_requests WHERE collector_id = ? AND DATE(pickup_date) = CURRENT_DATE) as todays_pickups,
        (SELECT COUNT(*) FROM pickup_requests WHERE collector_id = ? AND status IN ('collected', 'delivered', 'completed') AND DATE(pickup_date) = CURRENT_DATE) as completed_today,
        (SELECT COUNT(*) FROM pickup_requests WHERE collector_id = ? AND status IN ('collected', 'delivered', 'completed') AND pickup_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) as completed_this_week,
        (SELECT COALESCE(SUM(d.quantity), 0) 
         FROM devices d 
         JOIN pickup_requests pr ON d.pickup_request_id = pr.id 
         WHERE pr.collector_id = ? AND pr.status IN ('collected', 'delivered', 'completed') AND pr.pickup_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) as devices_collected
    `, [collectorId, collectorId, collectorId, collectorId]);

    // Active Routes (or current route status)
    const todayRouteResult = await client.query(`
      SELECT pr.id, pr.address, pr.status, pr.pickup_date as estimatedTime,
             (SELECT SUM(quantity) FROM devices WHERE pickup_request_id = pr.id) as device_count
      FROM pickup_requests pr
      WHERE pr.collector_id = ? AND pr.status IN ('scheduled', 'in-progress') AND DATE(pr.pickup_date) = CURRENT_DATE
      ORDER BY pr.created_at ASC
    `, [collectorId]);

    // Weekly performance trend
    const weeklyDataResult = await client.query(`
      SELECT DATE_FORMAT(pickup_date, '%Y-%m-%d') as \`day\`, COUNT(*) as count
      FROM pickup_requests
      WHERE collector_id = ? AND status IN ('collected', 'delivered', 'completed') AND pickup_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
      GROUP BY \`day\`
      ORDER BY \`day\` ASC
    `, [collectorId]);

    res.json(formatResponse(true, {
      stats: statsResult.rows[0],
      todayRoute: todayRouteResult.rows,
      weeklyData: weeklyDataResult.rows
    }));
  } catch (error) {
    console.error('Get collector dashboard error:', error);
    res.status(500).json(formatError('Failed to fetch dashboard stats'));
  } finally {
    client.release();
  }
};

export const getRoutes = async (req, res) => {
  const client = await pool.connect();
  try {
    const collectorId = req.user.id;

    const routesResult = await client.query(`
      SELECT 
        cr.id, cr.date, cr.status, cr.vehicle_id,
        (SELECT COUNT(*) FROM pickup_requests WHERE collector_id = cr.collector_id AND DATE(pickup_date) = cr.date) as stops
      FROM collection_routes cr
      WHERE cr.collector_id = ?
      ORDER BY cr.date DESC
      LIMIT 50
    `, [collectorId]);

    res.json(formatResponse(true, { routes: routesResult.rows }));
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json(formatError('Failed to fetch routes'));
  } finally {
    client.release();
  }
};

export const getCollections = async (req, res) => {
  const client = await pool.connect();
  try {
    const collectorId = req.user.id;

    const collectionsResult = await client.query(`
      SELECT pr.id, pr.status, pr.pickup_date as date, pr.address, pr.recycler_id,
             u.name as user_name,
             (SELECT SUM(quantity) FROM devices WHERE pickup_request_id = pr.id) as device_count
      FROM pickup_requests pr
      LEFT JOIN users u ON pr.user_id = u.id
      WHERE pr.collector_id = ? AND pr.status IN ('collected', 'delivered', 'completed')
      ORDER BY pr.pickup_date DESC
      LIMIT 100
    `, [collectorId]);

    res.json(formatResponse(true, { collections: collectionsResult.rows }));
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json(formatError('Failed to fetch collections'));
  } finally {
    client.release();
  }
};
export const updateRouteStatus = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status } = req.body;
    const collectorId = req.user.id;

    // Check if route exists and belongs to collector
    const checkResult = await client.query(
      'SELECT id FROM collection_routes WHERE id = ? AND collector_id = ?',
      [id, collectorId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json(formatError('Route not found or unauthorized'));
    }

    await client.query(
      'UPDATE collection_routes SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json(formatResponse(true, null, 'Route status updated successfully'));
  } catch (error) {
    console.error('Update route status error:', error);
    res.status(500).json(formatError('Failed to update route status'));
  } finally {
    client.release();
  }
};

export const getTodayStops = async (req, res) => {
  const client = await pool.connect();
  try {
    const collectorId = req.user.id;

    const result = await client.query(`
      SELECT 
        pr.id, pr.address, pr.status, pr.pickup_date, pr.total_estimated_value,
        u.name as user_name, u.phone as user_phone,
        (SELECT SUM(quantity) FROM devices WHERE pickup_request_id = pr.id) as device_count
      FROM pickup_requests pr
      LEFT JOIN users u ON pr.user_id = u.id
      WHERE pr.collector_id = ?
        AND pr.status IN ('scheduled', 'in-progress', 'pending')
        AND DATE(pr.pickup_date) = CURRENT_DATE
      ORDER BY pr.created_at ASC
    `, [collectorId]);

    res.json(formatResponse(true, { stops: result.rows }));
  } catch (error) {
    console.error('Get today stops error:', error);
    res.status(500).json(formatError('Failed to fetch today\'s stops'));
  } finally {
    client.release();
  }
};

export const getRecyclers = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT id, name, address, phone
      FROM users
      WHERE role = 'recycler' AND is_active = 1
    `);
    res.json(formatResponse(true, { recyclers: result.rows }));
  } catch (error) {
    console.error('Get recyclers error:', error);
    res.status(500).json(formatError('Failed to fetch recyclers'));
  } finally {
    client.release();
  }
};
