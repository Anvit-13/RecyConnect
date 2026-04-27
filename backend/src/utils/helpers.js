import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const calculateEstimatedValue = (device) => {
  const baseValues = {
    laptop: 16000,
    desktop: 12000,
    smartphone: 9600,
    tablet: 8000,
    monitor: 4800,
    printer: 2800,
    other: 2400,
  };

  const conditionMultipliers = {
    working: 1.0,
    'partially-working': 0.65,
    'not-working': 0.35,
    broken: 0.15,
  };

  const getBrandMultiplier = (deviceType, brand) => {
    if (!brand) return 1.0;
    const brandLower = brand.toLowerCase();
    
    switch (deviceType) {
      case 'laptop':
        if (brandLower.includes('apple')) return 1.2;
        if (brandLower.includes('razer') || brandLower.includes('alienware')) return 1.1;
        return 1.0;
      case 'smartphone':
        if (brandLower.includes('apple')) return 1.1;
        if (brandLower.includes('samsung') || brandLower.includes('google')) return 1.05;
        return 1.0;
      default:
        return 1.0;
    }
  };

  const type = device.device_type || device.deviceType;
  const condition = device.condition || device['condition'];
  const brand = device.brand;
  const quantity = parseInt(device.quantity) || 1;

  const baseValue = baseValues[type] || 2400;
  const brandMultiplier = getBrandMultiplier(type, brand);
  const conditionMultiplier = conditionMultipliers[condition] || 0.15;

  const estimated = baseValue * brandMultiplier * conditionMultiplier * 0.8 * quantity;
  return Math.round(estimated * 100) / 100;
};

export const formatResponse = (success, data = null, message = null) => {
  return {
    success,
    ...(data && { data }),
    ...(message && { message })
  };
};

export const formatError = (message, errors = null) => {
  return {
    success: false,
    error: message,
    ...(errors && { errors })
  };
};
