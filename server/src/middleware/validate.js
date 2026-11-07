import mongoose from 'mongoose';

/**
 * Validates that an ID parameter in the URL is a valid MongoDB ObjectId.
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID parameter: '${id}' is not a valid identifier.`
      });
    }
    next();
  };
};

/**
 * Validates required fields in the request body.
 */
export const validateRequiredFields = (fields = []) => {
  return (req, res, next) => {
    const missing = [];
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missing.join(', ')}`
      });
    }
    next();
  };
};
