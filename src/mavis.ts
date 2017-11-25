import * as Botkit from 'BotKit';
import { Config } from './config';
import { BotFactory, BotFrameworkFactory } from './core/botfactory';
import { Server } from './core/server';
import { Bot, BotkitBot } from './models';

export default class Mavis {

    public _bots: Bot[] = [];
    private _startTime: Date;

    constructor() {}
    
    public init() {

        const bfFactory = new BotFrameworkFactory({
            debug: Config.__DEVELOPMENT__,
            hostname: Config.APP_HOST
            // log, logger
        })
        
        this._bots.push(bfFactory.createBot(Config.BOT_FRAMEWORK_CONFIG));


        // Add skills from the /src/skills directory to each bot
        let normalizedPath = require('path').join(__dirname, 'skills');
        require('fs').readdirSync(normalizedPath).forEach((file: any) => {
            this._bots.forEach(bot => {
                if (bot instanceof BotkitBot) {
                    require('./skills/' + file)(bot.getController());
                }
            })
        });

    }
    public info() {
        return {
            uptime: Date.now() - this._startTime.getTime(),
            // TODO(bajtos) move this code to Application, the URL should
            // be accessible via this.get('http.url')
            url: Config.APP_ENDPOINT
        };
    }

    public async start() {
        let webserver = new Server();

        this._startTime = new Date();
        
        webserver.addRoute(require('path').join(__dirname, 'routes/routes'));

        const _bots = this._bots;
        await webserver.start((webserver: Server) => {
            this._bots.forEach(bot => {
                bot.createWebhookEndpoints(webserver);
            });
            console.log('** MAVIS is online!');
        });
    }
}