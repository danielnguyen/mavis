import { Library, UniversalBot, Session } from 'botbuilder';
import { BaseSkill } from './index';
import logger from '../middleware/logger';

export class SmartHomeSkill extends BaseSkill {

    private static SUPPORTED_DEVICES: string[] = ['tv', 'television', 'projector'];
    
    constructor(bot: UniversalBot) {
        super(bot);
    }

    public init() {
        this.bot.dialog('turnOnDeviceDialog', this.turnOnDeviceDialog())
            .triggerAction({ matches: 'smarthome.device.switch.on' });
        this.bot.dialog('turnOffDeviceDialog', this.turnOffDeviceDialog())
            .triggerAction({ matches: 'smarthome.device.switch.off' });
    }

    public turnOnDeviceDialog() {
        return (session: Session) => {
            const device = this.getDevice(session.message.text);
            session.send("You want me to turn on the " + device + ".");
        }
    }

    public turnOffDeviceDialog() {
        return (session: Session) => {
            const device = this.getDevice(session.message.text);
            session.send("You want me to turn off the " + device + ".");
        }
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