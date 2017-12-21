import { EntityRecognizer, UniversalBot, IEntity, RegExpRecognizer } from 'botbuilder';
import { BaseSkill } from './index';
import { DialogFlowFulfillment } from '../middleware/dialogflow'
import logger from '../middleware/logger';

/**
 * Small Talk skills
 */
export class SmallTalkSkill extends BaseSkill {

    constructor(bot: UniversalBot) {
        super(bot);
    }

    public init() {
        this.bot.dialog('smalltalkDialog', (session, args) => {
            if (args && args.intent && args.intent.entities) {
                let ent: IEntity = EntityRecognizer.findEntity(args.intent.entities, 'fulfillment');
                if (ent && ent.entity && ent.entity.speech) {
                    session.send(ent.entity.speech);
                } else {
                    logger.warn("'smalltalkDialog': No fulfillment replies found for message: '" + session.message.text + "'!");    
                }
            } else {
                logger.warn("'smalltalkDialog': No intent found for message: '" + session.message.text + "'!");
                session.send("I don't have a response yet...");
            }
        }).triggerAction({ 
            onFindAction: function (context, callback) {
                logger.info("Analyzing intent '" + context.intent.intent + "'");
                // The 'matches' mechanism requires an exact match, so you need to specify all intents.
                // Overriding the FindAction mechanism so we can default all 'smalltalk' replies with the fulfillment.
                if (context.intent && context.intent.intent.includes('smalltalk.')) {
                    logger.info("Match found for intent '" + context.intent.intent + "'");
                    // As smalltalk is a low priority skill, 
                    // lower confidence score to allow other intents to gain higher priority.
                    // Pass along intent metadata as well.
                    callback(null, 0.2, { intent: context.intent });
                } else {
                    callback(null, 0.0);
                }
            }
        });
    }
}