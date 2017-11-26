import { Skill } from '../index';

export class Help implements Skill {
    
    public canHandle(message: string): boolean {
        return false
    }

    public handle(message: string): string {
        return "";
    }

}


