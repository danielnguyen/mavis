import { Message } from 'botkit';
import { Intent, Entity } from '../index';

export interface LuisResponse {
    /**
     * The utterance to classify.
     */
    query: string,

    /**
     * The intent with the highest confidence score.
     */
    topScoringIntent: Intent,

    /**
     * The entities that match the utterance.
     */
    entities: Entity[]
}

/**
 * The interface for LUIS Configuration
 */
export interface MicrosoftLuisConfiguration {
    /**
     * The Microsoft LUIS Endpoint.
     */
    endpoint: string,

    /**
     * The Microsoft LUIS App ID.
     */
    appId: string,

    /**
     * The Microsoft LUIS API Key.
     */
    apiKey: string,

    /**
     * Set Verbose=true if you want the JSON response 
     * of your published app to include all intents defined 
     * in your app and their prediction scores
     */
    verbose: boolean
}
