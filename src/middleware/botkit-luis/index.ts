import { Bot, Message } from 'BotKit';
import * as HTTP_STATUS from 'http-status-codes';
import { MicrosoftLuisConfiguration, LuisMessage, Intent, LuisResponse } from './index.d';
import * as querystring from 'querystring';
import * as request from 'request';
import { CoreOptions } from 'request';

export class BotkitLuis {

    private static readonly LUIS_QUERY_API = '/luis/v2.0/apps/';

    private _luisConfig: MicrosoftLuisConfiguration;

    constructor() {}

    /**
     * Preprocesses the message from Botkit and passes it to Luis for NLP.
     * 
     * @param bot The Botkit Bot.
     * @param message The received Botkit message.
     * @param next The next function which must be called to continue processing the middleware stack.
     */
    public receive(options: MicrosoftLuisConfiguration) {
        
        if (!options || (!options.endpoint && !options.apiKey)) {
            console.error('Error: Need to specify LUIS Configuration.');
        } else {
            this._luisConfig = options;
        }
    
        return (bot: Bot<any, any>, message: LuisMessage, next: () => void) => {
            if (message.text && !message.topIntent) {
                
                // Construct the query params to pass to the LUIS API.
                const queryParams = {
                    'subscription-key': this._luisConfig.apiKey,
                    'verbose': this._luisConfig.verbose,
                    'timezoneOffset': '-300',
                    'q': message.text // The utterance quiery
                };
                
                // Construct the URL Endpoint to call with the params.
                const url = this._luisConfig.endpoint + BotkitLuis.LUIS_QUERY_API + this._luisConfig.appId 
                        + '?' + querystring.stringify(queryParams);
                
                // Configure any necessary properties.
                const requestOptions: CoreOptions = {};

                // Perform the API call.
                request.get(url, requestOptions, (err, res, body) => {
                    if (err || res.statusCode !== HTTP_STATUS.OK) {
                        console.log(err);
                    } else {
                        const data: LuisResponse = JSON.parse(body);
                        message.topIntent = data.topScoringIntent;
                        message.entities = data.entities;
                        
                        console.log('AUDIT:\n\n url: '+url+'\nLUIS results' + body);
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
    public static hear(patterns: any, message: LuisMessage) {

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