import { Skill } from '../models';
import { BotFrameworkController } from 'BotKit';
import { Config } from '../config';

export interface Bot {
    createWebhookEndpoints(webserver: any): any;
}

export class AlexaBot implements Bot {

    public createWebhookEndpoints(webserver: any): any {
        return undefined;
    }
}

export abstract class BotkitBot implements Bot {
    
    protected _botkitBot: any;
    protected _botkitController: any;

    constructor(bot: any, controller: any) {
        this._botkitBot = bot;
        this._botkitController = controller;
    }
    
    public getBot(): any {
        return this._botkitBot;
    }

    public getController(): any {
        return this._botkitController;
    }

    abstract createWebhookEndpoints(webserver: any): any;
}

export class BotFrameworkBot extends BotkitBot {

    public createWebhookEndpoints(webserver: any): BotFrameworkController {
        const controller: BotFrameworkController = this._botkitController;
        controller.createWebhookEndpoints(webserver, this._botkitBot, () => {
            // BotKit BotFramework is buggy because hardcodes 'http://' and the 
            // BotFrameworkConfiguration interface doesn't have 'port', which is why it's undefined.
            controller.log('** Bot is available as a Microsoft Bot Framework Bot at: ' + Config.APP_ENDPOINT + '/botframework/receive');
        });
        return this._botkitController;
    }
 }