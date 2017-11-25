import BotKit = require('botkit');
import { BotFrameworkBot, BotFrameworkConfiguration, BotFrameworkSpawnConfiguration, BotFrameworkController, sparkbot } from 'botkit';
import { Config } from '../config';
import { BotkitBot, Skill } from '../models';

export class BotFramework implements BotkitBot {
    
    private _bot: BotFrameworkBot;
    private _config: BotFrameworkConfiguration;
    private _controller: BotKit.BotFrameworkController;
    
    constructor(config: BotFrameworkConfiguration, spawnConfig: BotFrameworkSpawnConfiguration) {
        if ((!config || !config.debug) && (!spawnConfig || !spawnConfig.appId || !spawnConfig.appPassword)) {
            console.log('Error: Specify Microsoft App Credentials in environment');
            process.exit(1);
        }
        
        // Create the BotKit Controller
        this._controller = BotKit.botframeworkbot(this._config);

        // Spawn the bot
        this.spawn(spawnConfig);
    }

    public getController(): BotFrameworkController {
        return this._controller;
    }

    public getBot(): BotFrameworkBot {
        return this._bot;
    }

    private spawn(spawnConfig: BotFrameworkSpawnConfiguration): BotFrameworkBot {
        this._bot = this._controller.spawn(spawnConfig);
        return this._bot;
    }

    public createWebhookEndpoints(webserver: any): BotFrameworkController {
        // TS complains of missing type annotation.
        const controller: BotFrameworkController = this._controller;
        controller.createWebhookEndpoints(webserver, this.getBot(), function() {
            // BotKit BotFramework is buggy because hardcodes 'http://' and the 
            // BotFrameworkConfiguration interface doesn't have 'port', which is why it's undefined.
            controller.log('** Bot is available as a Microsoft Bot Framework Bot at: ' + Config.APP_ENDPOINT + '/botframework/receive');
        });
        return this._controller;
    }

    public addSkill(skill: Skill) {
        
    }

}