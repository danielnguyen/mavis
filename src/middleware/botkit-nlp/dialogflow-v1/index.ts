import { Bot, Message } from 'botkit';
import { Intent } from '../index';
import { DialogFlowConfiguration, DialogFlowMessage, DialogFlowResult, DialogFlowResponse } from './index.d';
import * as HTTP_STATUS from 'http-status-codes';
import * as request from 'request-promise';
import * as querystring from 'querystring';


export class DialogFlow {

    private static readonly LANGUAGE: string = 'en';

    private static readonly DIALOGFLOW_QUERY_API: string = '/v1/query';

    private _dialogFlowConfig: DialogFlowConfiguration;

    constructor(options: DialogFlowConfiguration) {
        if (!options || !options.endpoint || !options.projectId || !options.accessToken) {
            console.error('Error: Please specify DialogFlow credentials.');
        } else {
            this._dialogFlowConfig = options;            
        }
    }

    public async getDialogFlowResult(text: string) {
         // Construct the query params to pass to the LUIS API.
         const queryParams = {
            v: '20150910', // DialogFlow API Version (Required)
            lang: DialogFlow.LANGUAGE,
            sessionId: 'some-session-id',
            query: text,
            timezone: 'America/New_York'
        };
        
        // Construct the URL Endpoint to call the DialogFlow DetectIntent API.
        const url = this._dialogFlowConfig.endpoint + DialogFlow.DIALOGFLOW_QUERY_API
            + '?' + querystring.stringify(queryParams);

        // Configure any necessary properties.
        const requestOptions = {
            headers: {
                Authorization: 'Bearer ' + this._dialogFlowConfig.accessToken,
            }
        };

        return await request.get(url, requestOptions, (err, res, body) => {
            if (err || res.statusCode !== HTTP_STATUS.OK) {
                console.log(err);
            } else {
                const data: DialogFlowResponse = JSON.parse(body);
                return data.result;
            }
        }).catch((error) => {
            console.error('DialogFlow Middleware Error: ', error);  
        });
    }
}

export * from './index.d';