import logger from './middleware/logger';
import { Config } from './config';
import { Server } from './server';
import { BotFrameworkFactory, BotFrameworkObject } from './botfactory';
import { DialogFlowRecognizer } from './middleware/dialogflow';
import { DefauktSkill, SmallTalkSkill, SmartHomeSkill, SecretarySkill, MediaManagerSkill } from './skills';
import { IntentRecognizerSet, RecognizeOrder } from 'botbuilder';

export default class Mavis {

    public _bots: BotFrameworkObject[] = [];
    private _webserver: Server;
    private _startTime: Date;

    constructor() {}
    
    public init() {
        this._webserver = new Server();

        // this.initAlexaBot();
        this.initBotFrameworkBot();
        this.initBotSkills();
    }
    
    public info() {
        return {
            uptime: Date.now() - this._startTime.getTime(),
            // TODO move this code to Application, the URL should
            // be accessible via this.get('http.url')
            url: Config.APP_ENDPOINT
        };
    }

    public async start() {
        this._startTime = new Date();
        await this._webserver.start(() => {
            const app = this._webserver.getExpressApp();
            this._bots.forEach((botObject: BotFrameworkObject) => {
                app.post('/api/messages', botObject.connector.listen());
                logger.info('** Bot is available as a Microsoft Bot Framework Bot at: ' + Config.APP_ENDPOINT + '/api/messages');
            });
            logger.info('** MAVIS is online!');
        });
    }

    private initBotFrameworkBot() {
        const bfFactory = new BotFrameworkFactory(Config.BOT_FRAMEWORK_CONFIG);     
        // create the bot
        const bfBot: BotFrameworkObject = bfFactory.createBot();
        // attach loggers to the bot
        bfBot.bot.on('error', function (err) {
            logger.error(err);
        });
        // add to the bot list
        this._bots.push(bfBot);
    }

    private initBotSkills() {
        this._bots.forEach((botObject: BotFrameworkObject) => {
            
            const bot = botObject.bot;

            // Add NLP recognizer
            bot.recognizer(new DialogFlowRecognizer(Config.DIALOGFLOW_CONFIG));
            
            // Add skills to the bot
            new MediaManagerSkill(bot);
            const secretary = new SecretarySkill(bot);
            secretary.routes(this._webserver.getExpressApp());
            new SmallTalkSkill(bot);
            new SmartHomeSkill(bot);
            
            new DefauktSkill(bot);
        });
    }
}