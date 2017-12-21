import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import logger from './middleware/logger';

if (fs.existsSync(path.join(__dirname, '.env'))) {
    const dotenvConfig = dotenv.config();
    if (dotenvConfig.error) {
        logger.error('Error: ', dotenvConfig.error);
    } else {
        logger.info('Finished loading from environment variable file.');
        if (process.env.NODE_ENV !== 'production') {
            logger.info(dotenvConfig);
        }
    }
}

// Need to come after load env.
import Mavis from './mavis';
import { Config } from './config';

async function main(): Promise<void> {
    if (!Config.BOT_FRAMEWORK_CONFIG.appId) {
        logger.error('Environment variables not loaded into Config. Was Config initialized somewhere else before?');
        process.exit(1);
    }
    const app = new Mavis();
    logger.info('Inititalizing Mavis...');
    await app.init();
    logger.info('Starting Mavis...');
    await app.start();
}

main().catch(err => {
    logger.error('Cannot start Mavis.', err);
    process.exit(1);
});