import Botkit = require('botkit');
import { WebServer } from './core/WebServer';

import { Config } from './config';
import { } from './models';

if (!Config.__DEVELOPMENT__ && (!Config.BOT_FRAMEWORK_CONFIG.appId || !Config.BOT_FRAMEWORK_CONFIG.appPassword)) {
    console.log('Error: Specify Microsoft App Credentials in environment');
    process.exit(1);
}

const controller = Botkit.botframeworkbot({
    debug: Config.__DEVELOPMENT__,
    hostname: Config.APP_HOST,
    // log, logger
});

// Spawn a new bot using the Microsoft Bot Framework credentials
const bot = controller.spawn(Config.BOT_FRAMEWORK_CONFIG);

// Import bot skills from the /src/skills directory
let normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file: any) {
  require("./skills/" + file)(controller);
});

let webServer = new WebServer();

webServer.addRoute(require("path").join(__dirname, "routes/routes"));

webServer.start(function(webserver: WebServer) {
    controller.log('** Starting webserver at https://' + webServer.config.hostname + ":" + webServer.config.port);
    controller.createWebhookEndpoints(webserver, bot, function() {
        // BotKit BotFramework is buggy because hardcodes 'http://' and the 
        // BotFrameworkConfiguration interface doesn't have 'port', which is why it's undefined.
        controller.log('** Serving webhook endpoints for the Microsoft Bot Framework at: '
        + Config.APP_ENDPOINT + '/botframework/receive');
        controller.log('** MAVIS is online!');
    });
});