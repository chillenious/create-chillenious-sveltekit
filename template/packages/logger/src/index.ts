import { format, Logger, createLogger, transports } from 'winston';

import { LOG_LEVEL, LOG_STYLE } from './config';

/**
 * Returns true if the current environment is a test environment or the log style is set to local.
 */
const isTestOrLocal = () =>
  LOG_STYLE.toLowerCase() === 'local' || process.env.JEST_WORKER_ID || typeof jest !== 'undefined';

/**
 * Create a logger using custom options.
 */
const getLogger = (options = {}): Logger => {
  const formats = isTestOrLocal()
    ? [format.colorize({ all: true }), format.splat(), format.prettyPrint({ depth: 10 }), format.simple()]
    : [format.splat(), format.timestamp(), format.json()];

  const opts = {
    level: LOG_LEVEL,
    format: format.combine(...formats),
    transports: [new transports.Console({ silent: process.argv.includes('--silent') })],
    ...options,
  };
  return createLogger(opts);
};

export { getLogger, Logger };
