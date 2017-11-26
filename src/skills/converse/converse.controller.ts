import { Skill } from '../index';

export class Converse implements Skill {
    
    public canHandle(message: string): boolean {
        // TODO This needs to be replaced
        return (message.toLowerCase().indexOf('hello') !== -1);
    }

    public handle(message: string): string {
        // TODO This needs to be better and is for testing only
        if (message.toLowerCase().indexOf('hello') !== -1) {
            return 'hi!';
        }
        return "";
    }

}


