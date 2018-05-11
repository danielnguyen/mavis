import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

export class Environment {

    public static async loadEnv() {
        const dotenvConfig = await dotenv.config();
        if (dotenvConfig.error) console.error('Error: ', dotenvConfig.error);
        if (process.env.NODE_ENV !== 'production') console.log(dotenvConfig);
    }
}