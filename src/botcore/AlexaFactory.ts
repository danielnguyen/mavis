import { Context, Handler, RequestBody } from 'alexa-sdk';
import { BotFactory } from './index';
import { Bot } from '../botcore';

export class AlexaFactory extends BotFactory {

    protected _handler: Handler<any>;
    
    constructor() {
        super();
    }

    public createBot(): Bot {
        return undefined;
    }

    public handler(event: RequestBody<any>, context: Context, cb: any) {
        
    }
}