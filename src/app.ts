import Mavis from './mavis';

main().catch(err => {
    console.log('Cannot start Mavis.', err);
    process.exit(1);
});
  
async function main(): Promise<void> {
    const app = new Mavis();
    await app.init();
    await app.start();
}