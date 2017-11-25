import { Context, Handler, RequestBody } from 'alexa-sdk';
import { BotFactory } from '.';
import { Bot, Skill } from '../models';

export class AlexaFactory extends BotFactory {

    protected _handler: Handler<any>;
    
    constructor() {
        super();
    }

    public createBot(): Bot {
        return undefined;
    }
    
    public addSkill(skill: Skill) {
        // not implemented
    }

    public handler(event: RequestBody<any>, context: Context, cb: any) {
        
    }
}