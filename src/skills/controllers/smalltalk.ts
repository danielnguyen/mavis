import { Bot, Controller, Message} from "botkit";
import { BotkitNLP, NLPMessage } from "../../middleware/botkit-nlp";
import { BaseSkill } from "./_skill";

/**
 * Final catch-all skill for unsupported skills.
 */
export class FinalSkill extends BaseSkill {

    constructor(controller: Controller<any, any, any>) {
        super(controller);
    }

    protected init() {
        this.controller.hears(".*", "message_received", BotkitNLP.hear, this.handleDefault);
    }

    private handleDefault(bot: Bot<any, any>, message: NLPMessage) {
        let reply = "Not sure I understand that yet.";
        if (message.topIntent) {
            console.log("Intent: " + JSON.stringify(message));
            if (message.fulfillment) {
                reply = message.fulfillment.speech;
            } else {
                reply = "Not sure how to handle this new intent: " + message.topIntent.intent;
            }
        }
        
        bot.reply(message, reply, (err: Error) => {
            console.error(err);
        });
    }
}