/**
 * Logger utility for consistent logging across the application
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message, meta = {}) => {
  const timestamp = getTimestamp();
  let metaStr = '';
  
  if (Object.keys(meta).length > 0) {
    try {
      metaStr = JSON.stringify(meta);
    } catch (error) {
      metaStr = '[Circular or Non-Serializable Data]';
    }
  }
  
  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaStr}`;
};

const logger = {
  info: (message, meta = {}) => {
    console.log(colors.green + formatMessage('info', message, meta) + colors.reset);
  },
  
  warn: (message, meta = {}) => {
    console.warn(colors.yellow + formatMessage('warn', message, meta) + colors.reset);
  },
  
  error: (message, meta = {}) => {
    console.error(colors.red + formatMessage('error', message, meta) + colors.reset);
  },
  
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(colors.blue + formatMessage('debug', message, meta) + colors.reset);
    }
  },
  
  http: (message, meta = {}) => {
    console.log(colors.cyan + formatMessage('http', message, meta) + colors.reset);
  }
};

export default logger; 