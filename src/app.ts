import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Need to load env before importing anything else.
loadEnv().catch(err => {
    console.error('Cannot load environment settings.', err);
    process.exit(1);
});

// Need to come after load env.
import Mavis from './mavis';

main().catch(err => {
    console.error('Cannot start Mavis.', err);
    process.exit(1);
});
  
async function loadEnv(): Promise<void> {
    if (await fs.existsSync(path.join(__dirname, '.env'))) {       
        const dotenvConfig = await dotenv.config();
        if (dotenvConfig.error) console.error('Error: ', dotenvConfig.error);
        if (process.env.NODE_ENV !== 'production') console.log(dotenvConfig);
    }
}

async function main(): Promise<void> {    
    const app = new Mavis();
    await app.init();
    await app.start();
}