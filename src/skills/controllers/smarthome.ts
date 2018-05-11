import * as _ from "lodash";
import { Bot, Controller, Message} from "botkit";
import { BotkitNLP, NLPMessage } from "../../middleware/botkit-nlp";
import { BaseSkill } from "./_skill";
import { MessageUtils } from "../helpers/messageutils";

/**
 * Smart home skills.
 */
export class SmartHomeSkill extends BaseSkill {

    private static SUPPORTED_DEVICES: string[] = ["tv", "television", "projector"];
    
    constructor(controller: Controller<any, any, any>) {
        super(controller);
    }

    protected init() {
        this.controller.hears("smarthome.device.switch.on", "message_received", BotkitNLP.hear, this.handleDeviceOn);
        this.controller.hears("smarthome.device.switch.off", "message_received", BotkitNLP.hear, this.handleDeviceOff);
    }

    public handleDeviceOn(bot: Bot<any, any>, message: NLPMessage) {
        let reply = "Not sure I understand that yet.";
        
        const devices = MessageUtils.findMentions(message.text, SmartHomeSkill.SUPPORTED_DEVICES);

        if (devices.length === 1) {
            reply = "You want me to turn on the " + devices[0] + ".";
        } else if (devices.length > 1) {
            reply = "You want me to turn on multiple devices: " + devices.join(", ");
        } else {
            reply = "I don't support that device yet.";
        }
        
        bot.reply(message, reply, (err: Error) => {
            console.error(err);
        });

    }

    public handleDeviceOff(bot: Bot<any, any>, message: NLPMessage) {
        let reply = "Not sure I understand that yet.";
        
        const devices = MessageUtils.findMentions(message.text, SmartHomeSkill.SUPPORTED_DEVICES);

        if (devices.length === 1) {
            reply = "You want me to turn off the " + devices[0] + ".";
        } else if (devices.length > 1) {
            reply = "You want me to turn off multiple devices: " + devices.join(", ");
        } else {
            reply = "I don't support that device yet.";
        }
        
        bot.reply(message, reply, (err: Error) => {
            console.error(err);
        }); 
    }
}