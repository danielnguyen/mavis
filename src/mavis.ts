import * as Botkit from 'BotKit';
import { Config } from './config';
import { AlexaFactory, AlexaConversationHandler,Bot, BotkitBot, BotkitConversationHandler, BotFrameworkFactory } from './botcore';
import { Server } from './server';
import { alexa } from './middleware';

export default class Mavis {

    public _bots: Bot[] = [];
    private _startTime: Date;

    constructor() {}
    
    public init() {
        this.initAlexaBot();
        this.initBotFrameworkBot();
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

        // Connect middleware
        alexa(webserver.getExpressApp());
        
        this._startTime = new Date();
        
        const _bots = this._bots;
        await webserver.start((webserver: Server) => {
            this._bots.forEach(bot => {
                bot.createWebhookEndpoints(webserver);
            });
            console.log('** MAVIS is online!');
        });
    }

    private initAlexaBot() {

    }

    private initBotFrameworkBot() {
        const bfFactory = new BotFrameworkFactory({
            debug: Config.__DEVELOPMENT__,
            hostname: Config.APP_HOST
            // log, logger
        })

        // create the bot
        const bfBot = bfFactory.createBot(Config.BOT_FRAMEWORK_CONFIG);

        // hook up the handler/controller
        new BotkitConversationHandler().handle(bfBot.getController());

        // add to the bot list
        this._bots.push(bfBot);
    }
}