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

export interface DialogFlowMessage extends Message {


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
    entities: Entity[],

    /**
     * Fulfillments from DialogFlow.
     */
    fulfillment: DialogFlowFulfillment
}

export interface DialogFlowFulfillmentMessage {
    type: number,
    speech: string
}

export interface DialogFlowFulfillment {
    speech: string,
    messages: DialogFlowFulfillmentMessage[]
}

export interface DialogFlowResult {
    source: string,
    action: string,
    actionIncomplete: boolean,
    paramters: any,
    context: any[],
    fulfillment: DialogFlowFulfillment,
    score: number
}

export interface DialogFlowResponse {
    /**
     * The unique identifier of the response.
     */
    id: string,

    /**
     * The results of the conversational query or event processing.
     */
    result: DialogFlowResult,

    /**
     * The session ID of the request.
     */
    sessionId: string
}

/**
 * The interface for DialogFlow Configuration
 */
export interface DialogFlowConfiguration {
    /**
     * The DialogFlow Endpoint.
     */
    endpoint: string,

    /**
     * DialowFlow API Key.
     */
    accessToken: string,

    /**
     * The Google Cloud Project ID.
     */
    projectId: string
}
