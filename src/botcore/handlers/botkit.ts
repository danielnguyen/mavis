import { Controller, Conversation, Message } from 'BotKit';
import { Config } from '../../config';
import * as Skills from '../../skills';

export class BotkitConversationHandler {

    protected _skills: Skills.Skill[] = [];
    protected _nlpTrainer: Skills.Skill;

    constructor() {
        this._skills.push(new Skills.Converse());
        this._skills.push(new Skills.Help());
        this._skills.push(new Skills.VJ());

        this._nlpTrainer = new Skills.Learn();
    }

    private getSkills(message: string): Skills.Skill[] {
        // Skills that know how to handle the message.
        const supportedSkills: Skills.Skill[] = [];
        this._skills.forEach((skill) => {
            if (skill.canHandle(message)) {
                supportedSkills.push(skill);
            }
        });
        return supportedSkills;
    }
    
    public handle(controller: Controller<any, any, any>) {
    
        controller.hears('.*', 'message_received', async (bot, message: Message) => {

            let supportedSkills = this.getSkills(message.text);

            if (supportedSkills.length > 0) {
                
                // Pass the message to all skills to handle
                supportedSkills.forEach((skill) => {
                    const reply = skill.handle(message.text);
                    if (reply && reply !== "") {
                        bot.reply(message, reply, (err: Error) => {
                            console.error(err);
                        });
                    }
                });
            } else {
                bot.reply(message, 'I don\'t have any skills to handle that... Sorry.', (err: Error) => {
                    console.error(err);
                });
            }

        });
    }

}