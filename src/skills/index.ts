import { Library, UniversalBot } from 'botbuilder';
import logger from '../middleware/logger';

export abstract class BaseSkill {

    /**
     * The Bot to which skills are attached to.
     */
    protected bot: UniversalBot;

    constructor(bot: UniversalBot) {
        this.bot = bot;
        this.init();
    }

    abstract init(): void;
}

export class DefauktSkill extends BaseSkill {
    
    constructor(bot: UniversalBot) {
        super(bot);
    }

    public init() {
        this.bot.dialog('/', function (session) {
            logger.info(session)
            session.send('Sorry, I don\'t understand: \'%s\'.', session.message.text);
        }).triggerAction({ matches: 'input.unknown' });
    }
}

// export * from './index.d.ts';
export * from './MediaManager';
export * from './Secretary';
export * from './SmallTalk';
export * from './SmartHome';