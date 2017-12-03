import { Message } from 'BotKit';

export interface Intent {
    
    /**
     * The intent name.
     */
    intent: string,

    /**
     * The confidence score of the intent.
     */
    score: number


}

export interface Entity {
    /**
     * The entity name.
     */
    entity: string,

    /**
     * The entity type.
     */
    type: string,
    
    startIndex: number,
    
    endIndex: number,
    
    /**
     * The confidence score of the entity.
     */
    score: number,

    resolution: any
}

export interface LuisMessage extends Message {


    /**
     * The top intent of the message.
     */
    topIntent: Intent,

    /**
     * A list of possible intents.
     */
    intents: Intent[],
    
    /**
     * The entities that match the utterance.
     */
    entities: Entity[]
}

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
export interface BotkitLuisConfiguration {
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
