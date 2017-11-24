import BotKit = require('botkit');
import { BotFrameworkConfiguration, BotFrameworkSpawnConfiguration, BotFrameworkController } from 'botkit';

export class Bot {
    
    private _bot: BotKit.BotFrameworkBot;
    private _controller: BotKit.BotFrameworkController;
    
    constructor(config: BotFrameworkConfiguration) {
        if (!config) config = {};

        this._controller = BotKit.botframeworkbot(config);
    }

    public getController(): BotFrameworkController {
        return this._controller;
    }

    public setController(customController: BotFrameworkController) {
        this._controller = customController;
    }

    public spawn(spawnConfig: BotFrameworkSpawnConfiguration) {
        return this._controller.spawn(spawnConfig);
    }

    public addSkill(skill: any) {
        
    }

}