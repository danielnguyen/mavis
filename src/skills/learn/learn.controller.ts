import { Skill } from '../index';

export class Learn implements Skill {
    
    public canHandle(message: string): boolean {
        return false
    }

    public handle(message: string): string {
        
        return 'What does \'' + message + '\' mean?';
    }

}


