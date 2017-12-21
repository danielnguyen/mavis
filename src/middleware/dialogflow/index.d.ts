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

    /**
     * An optional logger
     */
    logger?: any
}

export interface QueryParameters {
    v?: string,
    lang?: string,
    sessionId?: string,
    query?: string,
    timezone?: string,
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
    source?: string,
    action?: string,
    actionIncomplete?: boolean,
    paramters?: any,
    context?: any[],
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