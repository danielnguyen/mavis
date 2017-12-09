import * as BotKit from 'botkit';
import { BotkitFactory, BotFrameworkBot } from './index';
import { BotFrameworkConfiguration, BotFrameworkController, BotFrameworkSpawnConfiguration } from 'botkit';
import { Config } from '../config';

export class BotFrameworkFactory extends BotkitFactory {

    constructor(config: BotFrameworkConfiguration) {
        super();
        this._config = config;
        // Create the BotKit Controller
        this._controller = BotKit.botframeworkbot(this._config);
    }
    
    public createBot(config: BotFrameworkSpawnConfiguration): BotFrameworkBot {
        if ((!this._config || !this._config.debug) && (!config || !config.appId || !config.appPassword)) {
            console.error('Error: Specify Microsoft App Credentials in environment');
        }
        
        return new BotFrameworkBot(this.spawn(config), this._controller);
    }
}