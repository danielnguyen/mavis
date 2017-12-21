import { DialogFlowConfiguration, QueryParameters } from './index.d';
import * as HTTP_STATUS from 'http-status-codes';
import * as request from 'request-promise';
import * as querystring from 'querystring';
import { RequestCallback } from 'request';

export class DialogFlowService {
    
        private dialogFlowEndpoint = 'https://api.dialogflow.com';
    
        private queryApiV1 = '/v1/query';
        
        private headers: any = {
            'Content-Type': 'application/json'
        };
    
        constructor(config: DialogFlowConfiguration) {
            
            // If necessary, override API host. 
            if (config.endpoint) this.dialogFlowEndpoint = config.endpoint;
    
            // Set Authorization for API request
            this.headers.Authorization = 'Bearer ' + config.accessToken
        }
        
        /**
         * Detects the intent from a given text.
         * 
         * @param text The text to detect the Intent from.
         * @param cb A callback function to handle the DialogFlow results.
         */
        public detectIntent(text: string, params: QueryParameters, cb: RequestCallback) {
            // Configure Query Parameters
            const queryParams: QueryParameters = {
                v: params.v || '20150910', // DialogFlow API Version (Required)
                lang: params.lang || 'en',
                sessionId: params.sessionId || `${Math.random()}`,
                query: text,
                timezone: params.timezone || 'America/New_York'
            };
    
            // Configure Request Options
            const requestOptions: any = {
                headers: this.headers
            }
    
            // Configure URL
            const requestUrl = this.dialogFlowEndpoint + this.queryApiV1 + '?' + querystring.stringify(queryParams);
    
            return request.get(requestUrl, requestOptions, cb);
        }
        
    }