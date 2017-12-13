import { Message } from 'botkit';

export interface Intent {
    
    /**
     * The intent name.
     */
    intent: string,

    /**
     * The confidence score of the intent.
     */
    score: number

    /**
     * Any additional data (optional)
     */
    data?: any
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

export interface NLPMessage extends Message {


    /**
     * The top intent of the message.
     */
    topIntent: Intent,
    
    /**
     * Fulfillments if NLP Service provides any.
     */
    fulfillment: any
}