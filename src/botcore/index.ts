import { Controller } from 'BotKit';
import { Bot } from './index';

export abstract class BotFactory {
    abstract createBot(config?: any): Bot;
}

export abstract class BotkitFactory extends BotFactory {

    protected _bot: Bot;
    protected _config: any;
    protected _controller: any;

    public getController(): any {
        return this._controller;
    }
    
    protected spawn(spawnConfig: any): any {
        this._bot = this._controller.spawn(spawnConfig);
        return this._bot;
    }
 }

 export * from './Bot';
 export * from './AlexaFactory';
 export * from './BotFrameworkFactory';
 export * from './handlers'