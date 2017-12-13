import { Controller, Message} from 'botkit';
import { BotkitNLP, NLPMessage } from '../../middleware/botkit-nlp';
import { Skill } from '../index';

/**
 * Final catch-all skill for unsupported skills.
 */
export class SmartHomeSkill implements Skill {

    private static SUPPORTED_DEVICES: string[] = ['tv', 'television', 'projector'];
    
    public hears(controller: Controller<any, any, any>) {
        controller.hears('smarthome.device.switch.on', 'message_received', BotkitNLP.hear, async (bot, message: NLPMessage) => {
            let reply = "Not sure I understand that yet.";
            
            const device = this.getDevice(message.text);

            reply = "You want me to turn on the " + device + ".";
            
            bot.reply(message, reply, (err: Error) => {
                console.error(err);
            });

        });

        controller.hears('smarthome.device.switch.off', 'message_received', BotkitNLP.hear, async (bot, message: NLPMessage) => {
            let reply = "Not sure I understand that yet.";
            
            const device = this.getDevice(message.text);

            reply = "You want me to turn off the " + device + ".";
            
            bot.reply(message, reply, (err: Error) => {
                console.error(err);
            });

        });
            
    }
    
    /**
     * Get the requested device to control.
     * 
     * @param message the message to extract the medium from.
     */
    private getDevice(message: string) {
        const mediumFound = SmartHomeSkill.SUPPORTED_DEVICES.map((medium) => {
            return message.toLowerCase().includes(medium.toLowerCase()) ? medium : '';
        });
        return mediumFound.join('');
    }


}