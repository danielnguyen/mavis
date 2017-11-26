import { Skill } from '../index';

/**
 * Video Jockey skills
 * 
 * Scenarios:
 * 
 *  - "Turn on/off the projector/TV/monitor"
 *  - "Play/tune to the leafs/hockey"
 *  - "Cast <show> to my projector/TV/monitor"
 */
export class VJ implements Skill {

    public canHandle(message: string): boolean {
        // TODO this needs to be replaced
        return (message.toLowerCase().indexOf('video') !== -1);
    }

    public handle(message: string): string {
        // TODO This needs to be better and is for testing only
        if (message.toLowerCase().indexOf('video') !== -1) {
            return 'sure I can play that.';
        }
        return "";
    }

}


