import { IIntentRecognizerResult, IntentRecognizer, IRecognizeContext } from 'botbuilder';
import { DialogFlowConfiguration, DialogFlowResponse, DialogFlowResult } from './index.d';
import { DialogFlowService } from './DialogFlowService';
import * as HTTP_STATUS from 'http-status-codes';
import logger from '../logger';

/**
 * Convenience class to provide a Recognizer object to use with Microsoft Bot Framework.
 */
export class DialogFlowRecognizer extends IntentRecognizer {

    // DialogFlow object to interact with the DialogFlow service
    private dialogFlowService: DialogFlowService;

    constructor(config: DialogFlowConfiguration) {
        super();
        this.dialogFlowService = new DialogFlowService(config);
    }

    onRecognize(context: IRecognizeContext, callback: (err: Error, result: IIntentRecognizerResult) => void): void {
        let result: IIntentRecognizerResult = { score: 0.0, intent: null, intents: [], entities: [] };
        if (context && context.message && context.message.text) {
            this.dialogFlowService.detectIntent(context.message.text, {}, (err: Error, res: any, body: string) => {
                let dialogFlowResult: DialogFlowResult;
                if (err || res.statusCode !== HTTP_STATUS.OK) {
                    logger.error(err);
                } else {
                    const data: DialogFlowResponse = JSON.parse(body);
                    dialogFlowResult = data.result;
                    result.score = dialogFlowResult.score;
                    result.intent = dialogFlowResult.action;
                    result.intents.push({
                        intent: dialogFlowResult.action,
                        score: dialogFlowResult.score
                    });
                    result.entities.push({
                        type: "fulfillment",
                        entity: dialogFlowResult.fulfillment
                    });
                }
                if (!err) {
                    callback(null, result);
                } else {
                    callback(err, null);
                }
            });
        } else {
            callback(null, result);
        }
    }
}