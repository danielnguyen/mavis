import { DialogFlowConfiguration, DialogFlowResponse, DialogFlowResult } from './index.d';
import { DialogFlowService } from './DialogFlowService';
import * as HTTP_STATUS from 'http-status-codes';
import logger from '../logger';

export * from './DialogFlowRecognizer';
export * from './DialogFlowService';
export * from './index.d';

/**
 * Main DialogFlow Middleware class. Provides operations to interact with the Dialog Flow sevice.
 */
export class DialogFlow {

    private dialogFlowService: DialogFlowService;

    constructor(config: DialogFlowConfiguration) {
        if (!config || !config.endpoint || !config.projectId || !config.accessToken) {
            logger.error('Error: Please specify DialogFlow credentials.');
        } else {
            this.dialogFlowService = new DialogFlowService(config);
        }
    }

    /**
     * Recognize the intent given a specific text.
     * 
     * @param text The text to recognize the Intent from.
     */
    public async detectIntent(text: string): Promise<DialogFlowResult> {
        return await this.dialogFlowService.detectIntent(text, {}, (err: Error, res: any, body: string) => {
            if (err || res.statusCode !== HTTP_STATUS.OK) {
                logger.error(err);
            } else {
                const data: DialogFlowResponse = JSON.parse(body);
                return data.result;
            }
        }).catch((error) => {
            logger.error('DialogFlow detect intent Error: ', error);  
        });
    }
}