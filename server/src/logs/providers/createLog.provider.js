import { Log } from '../log.schema.js';
import logger from '../../helpers/winston.helper.js';

export const createLogProvider = async ({ userId, inputString, outputResult }) => {
  try {
    const log = new Log({
      userId,
      inputString,
      outputResult
    });
    await log.save();
  } catch (error) {
    logger.error(`Failed to save action log: ${error.message}`);
  }
};
