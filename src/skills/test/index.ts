import { Controller, Message} from 'botkit';
import { BotkitNLP, NLPMessage } from '../../middleware/botkit-nlp';
import { DialogFlow } from '../../middleware/botkit-nlp/dialogflow-v1';
import { LUIS } from '../../middleware/botkit-nlp/luis'
import { Skill } from '../index';

export class TestLuis implements Skill {

    public hears(controller: Controller<any, any, any>) {
        controller.hears(['Utilities.*', 'HomeAutomation.*'], 'message_received', BotkitNLP.hear, async (bot, message: NLPMessage) => {
            console.log('LUIS TEST SKILL HEARD.\n'+JSON.stringify(message.topIntent));
            let reply = message.text || "";
            if (message.topIntent && message.topIntent.intent) {
                reply = 'Intent: ' + message.topIntent.intent;
            }
            
            bot.reply(message, reply, (err: Error) => {
                console.error(err);
            });

        });
            
    }
}

export class TestDialogFlow implements Skill {
    
    public hears(controller: Controller<any, any, any>) {
        controller.hears('smalltalk.*', 'message_received', BotkitNLP.hear, async (bot, message: NLPMessage) => {
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

export class TestFinal implements Skill {
    
    public hears(controller: Controller<any, any, any>) {
        controller.hears('.*', 'message_received', BotkitNLP.hear, async (bot, message: NLPMessage) => {
            let reply = "Not sure I understand that yet.";
            if (message.topIntent) {
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