import { Controller, Message} from 'botkit';
import { BotkitNLP, NLPMessage } from '../../middleware/botkit-nlp';
import { Skill } from '../index';

/**
 * Final catch-all skill for unsupported skills.
 */
export class FinalSkill implements Skill {
    
    public hears(controller: Controller<any, any, any>) {
        controller.hears('.*', 'message_received', BotkitNLP.hear, async (bot, message: NLPMessage) => {
            let reply = "Not sure I understand that yet.";
            if (message.topIntent) {
                console.log('Intent: ' + JSON.stringify(message));
                if (message.fulfillment) {
                    reply = message.fulfillment.speech;
                } else {
                    reply = 'Not sure how to handle this new intent: ' + message.topIntent.intent;
                }
            }
            
            bot.reply(message, reply, (err: Error) => {
                console.error(err);
            });

        });
            
    }
}