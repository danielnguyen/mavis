import * as Alexa from 'alexa-sdk';
import * as Skills from '../../skills';

export class AlexaConversationHandler {

    protected _skills: Skills.Skill[] = [];

    constructor() {
        this._skills.push(new Skills.Converse());
    }
    
    public handle() {
    }

}