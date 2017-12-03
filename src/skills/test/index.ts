import { Controller, Message} from 'BotKit';
import { BotkitDialogFlow, DialogFlowMessage } from '../../middleware/botkit-dialogflow-v1';
import { BotkitLuis, LuisMessage } from '../../middleware/botkit-luis'
import { Skill } from '../index';

export class TestLuis implements Skill {

    public hears(controller: Controller<any, any, any>) {
        controller.hears('Utilities.Confirm', 'message_received', BotkitLuis.hear, async (bot, message: LuisMessage) => {
            let reply = message.text || "";
            if (message.topIntent) {
                reply = 'You called Utilities.Confirm';
            }
            
            bot.reply(message, reply, (err: Error) => {
                console.error(err);
            });

        });
            
    }
}

export class TestDialogFlow implements Skill {
    
    public hears(controller: Controller<any, any, any>) {
        controller.hears('smalltalk.*', 'message_received', BotkitDialogFlow.hear, async (bot, message: DialogFlowMessage) => {
            let reply = "Not sure I understand that yet.";
            if (message.topIntent) {
                reply = message.fulfillment.speech;
            }
            
            bot.reply(message, reply, (err: Error) => {
                console.error(err);
            });

        });
            
    }
}