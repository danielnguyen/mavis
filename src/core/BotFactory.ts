import { Controller } from 'BotKit';
import { Bot, Skill } from '../models';

export abstract class BotFactory {
    abstract addSkill(skill: Skill): void;
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

 export * from './BotFrameworkFactory';