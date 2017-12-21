import * as Express from 'express';
import { Library, UniversalBot } from 'botbuilder';
import { BaseSkill } from './index';
import logger from '../middleware/logger';

export class SecretarySkill extends BaseSkill {
    
    constructor(bot: UniversalBot) {
        super(bot);
    }

    public init() {
        // this.bot.dialog('/', function (session) {
        //     logger.info(session)
        //     session.send('Sorry, I don\'t understand: \'%s\'.', session.message.text);
        // }).triggerAction({ matches: 'input.unknown' });
    }
    
    public routes(app: Express.Application) {
        app.post('/api/ifttt/notifications', (req, res) => {
            logger.info('Received Android notification: ' + JSON.stringify(req.body, null, 4));
        });
    }
}