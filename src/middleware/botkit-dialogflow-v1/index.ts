import { Bot, Message } from 'BotKit';
import { DialogFlowConfiguration, DialogFlowMessage, Intent, DialogFlowResponse } from './index.d';
import * as HTTP_STATUS from 'http-status-codes';
import * as request from 'request';
import { CoreOptions } from 'request';
import * as querystring from 'querystring';


export class BotkitDialogFlow {

    private static readonly LANGUAGE: string = 'en';

    private static readonly DIALOGFLOW_QUERY_API: string = '/v1/query';

    private _dialogFlowConfig: DialogFlowConfiguration;

    constructor() {}

    /**
     * Preprocesses the message from Botkit and passes it to Luis for NLP.
     * 
     * @param bot The Botkit Bot.
     * @param message The received Botkit message.
     * @param next The next function which must be called to continue processing the middleware stack.
     */
    public receive(options: DialogFlowConfiguration) {

        if (!options || (!options.projectId && !options.accessToken)) {
            console.error('Error: Need to specify DialogFlow Configuration.');
        } else {
            this._dialogFlowConfig = options;
            console.log(this._dialogFlowConfig);   
        }

        return (bot: Bot<any, any>, message: any, next: () => void) => {
            console.log(this._dialogFlowConfig);
            if (message.text && !message.topIntent) {

                // Construct the query params to pass to the LUIS API.
                const queryParams = {
                    v: '20150910', // DialogFlow API Version (Required)
                    lang: BotkitDialogFlow.LANGUAGE,
                    sessionId: 'some-session-id',
                    query: message.text,
                    timezone: 'America/New_York'
                };
                
                // Construct the URL Endpoint to call the DialogFlow DetectIntent API.
                const url = this._dialogFlowConfig.endpoint + BotkitDialogFlow.DIALOGFLOW_QUERY_API
                    + '?' + querystring.stringify(queryParams);

                // Configure any necessary properties.
                const requestOptions: CoreOptions = {
                    headers: {
                        Authorization: 'Bearer ' + this._dialogFlowConfig.accessToken,
                    }
                };

                // Perform the API call.
                request.get(url, requestOptions, (err, res, body) => {
                    if (err || res.statusCode !== HTTP_STATUS.OK) {
                        console.log(err);
                    } else {
                        const data: DialogFlowResponse = JSON.parse(body);

                        if (data.result) {
                            const intent: Intent = {
                                intent: data.result.action,
                                score: data.result.score
                            }
                            message.topIntent = intent;
                            message.fulfillment = data.result.fulfillment;
                        }
                        
                        console.log('AUDIT:\n\n url: '+url+'\nDialogFlow results' + body);
                    }
                    // Continue with next handler
                    next();
                });
            } else {
                // Continue with next handler
                next();
            }
        }
    }

    /**
     * Listens to messages for supported NLP intents.
     * 
     * @param patterns A list of supported NLP intents.
     * @param message The message being heard.
     */
    public static hear(patterns: any, message: DialogFlowMessage) {
        let input: string = "";

        // if intent doesn't exist, use message.text as input as it is
        // possible that LUIS NLP is disabled.
        if (message.topIntent && message.topIntent.intent) {
            input = message.topIntent.intent.trim()
        } else {
            input = message.text;
        }

        let tests;
        if (Array.isArray(patterns)) {
            tests = patterns;
        } else {
            tests = [patterns];
        }
        for (let i = 0; i < tests.length; i++) {
            let test = null;
            try {
                test = new RegExp(tests[i], 'i');
            } catch (err) {
                console.error('Error in regular expression: ' + tests[i] + ': ' + err);
                return false;
            }
            if (!test) {
                return false;
            }

            if (input !== "" && input.match(test)) {
                return true;
            }
        }
        return false;
    }
}

export * from './index.d';