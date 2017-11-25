import * as BotKit from 'BotKit';
import { BotFrameworkConfiguration, BotFrameworkController, BotFrameworkSpawnConfiguration } from 'BotKit';
import { BotkitFactory } from './BotFactory';
import { BotFrameworkBot, Skill } from '../models';
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
            console.log('Error: Specify Microsoft App Credentials in environment');
            process.exit(1);
        }
        
        return new BotFrameworkBot(this.spawn(config), this._controller);
    }
    
    public addSkill(skill: Skill) {
        // not implemented
    }
}