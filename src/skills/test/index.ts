import { Controller, Message} from 'BotKit';
import { BotkitLuis, LuisMessage } from '../../middleware/botkit-luis'
import { Skill } from '../index';

export class Test implements Skill {

    public hears(controller: Controller<any, any, any>) {
        controller.hears('Utilities.Confirm', 'message_received', BotkitLuis.hear, async (bot, message: LuisMessage) => {
            let reply = message.text || "";
            if (message.topIntent) {
                reply = 'I hear the intent: ' + message.topIntent.intent + ' with confidence of ' + message.topIntent.score;
            }
            
            bot.reply(message, reply, (err: Error) => {
                console.error(err);
            });

        });
            
    }
}