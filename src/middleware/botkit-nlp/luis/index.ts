import { Bot, Message } from 'botkit';
import * as HTTP_STATUS from 'http-status-codes';
import { MicrosoftLuisConfiguration, LuisResponse } from './index.d';
import * as querystring from 'querystring';
import * as request from 'request-promise';

export class LUIS {

    private static readonly LUIS_QUERY_API = '/luis/v2.0/apps/';

    private _luisConfig: MicrosoftLuisConfiguration;

    constructor(options: MicrosoftLuisConfiguration) {
        if (!options || !options.endpoint || !options.appId || !options.apiKey) {
            console.error('Error: Please specify LUIS credentials. Got: ' + JSON.stringify(options));
        } else {
            this._luisConfig = options;            
        }
    }

    /**
     * Preprocesses the message from Botkit and passes it to Luis for NLP.
     * 
     * @param bot The Botkit Bot.
     * @param message The received Botkit message.
     * @param next The next function which must be called to continue processing the middleware stack.
     */
    public async getTopIntent(text: string) {
            
        // Construct the query params to pass to the LUIS API.
        const queryParams = {
            'subscription-key': this._luisConfig.apiKey,
            'verbose': this._luisConfig.verbose,
            'timezoneOffset': '-300',
            'q': text // The utterance quiery
        };
        
        // Construct the URL Endpoint to call with the params.
        const url = this._luisConfig.endpoint + LUIS.LUIS_QUERY_API + this._luisConfig.appId 
                + '?' + querystring.stringify(queryParams);
        
        // Perform the API call.
        return await request.get(url, (err, res, body) => {
            if (err || res.statusCode !== HTTP_STATUS.OK) {
                console.log(err);
            } else {
                const data: LuisResponse = JSON.parse(body);
                return data.topScoringIntent;
            }
        }).catch((error) => {
            console.error('LUIS Middleware Error: ', error);            
        });
    }
}

export * from './index.d';