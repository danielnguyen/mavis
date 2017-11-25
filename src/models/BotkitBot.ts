import { Bot, Controller } from 'BotKit';
import { Skill } from '../models';

export interface BotkitBot {
    getController(): Controller<any, any, any>;
    getBot(): Bot<any, any>;
    createWebhookEndpoints(webserver: any): Controller<any, any, any>;
    addSkill(skill: Skill): void;
}