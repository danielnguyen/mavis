// Need to declare the process variable and all environment variables used in the app.
declare let process: {
    env: {
        MICROSOFT_APP_ID: string;
        MICROSOFT_APP_PASSWORD: string;
        PORT: number;
        TEST: any;
    };
    exit(status?: number): any;
};
 
import Botkit = require('botkit');

if (!process.env.TEST && (!process.env.MICROSOFT_APP_ID || !process.env.MICROSOFT_APP_PASSWORD)) {
    console.log('Error: Specify Microsoft App Credentials in environment');
    process.exit(1);
}

const controller = Botkit.botframeworkbot({
    debug: true,
});

// Spawn a new bot using the Microsoft Bot Framework credentials
const bot = controller.spawn({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Import bot skills from the /src/skills directory
let normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file: any) {
  require("./skills/" + file)(controller);
});

controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('MAVIS is online!');
    });
});