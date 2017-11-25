import * as Botkit from 'BotKit';
import { Config } from './config';
import { BotFramework } from './core/BotFramework';
import { BotkitBot } from './models';
import { WebServer } from './server';

const bots: BotkitBot[] = [];

// Creating the Bot Framework Bot
bots.push(new BotFramework({
    debug: Config.__DEVELOPMENT__,
    hostname: Config.APP_HOST
    // log, logger
}, Config.BOT_FRAMEWORK_CONFIG));

// Add skills from the /src/skills directory to each bot
let normalizedPath = require('path').join(__dirname, 'skills');
require('fs').readdirSync(normalizedPath).forEach(function(file: any) {
    bots.forEach(bot => {
        require('./skills/' + file)(bot.getController());
    })
});


let webserver = new WebServer();

webserver.addRoute(require('path').join(__dirname, 'routes/routes'));

webserver.start(function(webserver: WebServer) {
    bots.forEach(bot => {
        bot.createWebhookEndpoints(webserver);
    });
    console.log('** MAVIS is online!');
});