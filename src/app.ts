import { Environment } from "./common/env";

Environment.loadEnv();

import Mavis from './mavis';

main().catch(err => {
    console.error('Cannot start Mavis.', err);
    process.exit(1);
});

async function main(): Promise<void> {    
    const app = new Mavis();
    await app.init();
    await app.start();
}