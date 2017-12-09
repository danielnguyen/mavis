import { BotFrameworkController, Message } from 'botkit';
import { Config } from '../config';
import { Skill } from '../skills';

export interface Bot {
    createWebhookEndpoints(webserver: any): any;
}

export abstract class BotkitBot implements Bot {
    
    protected _botkitBot: any;
    protected _botkitController: any;

    constructor(bot: any, controller: any) {
        this._botkitBot = bot;
        this._botkitController = controller;
    }
    
    public getBot(): any {
        return this._botkitBot;
    }

    public getController(): any {
        return this._botkitController;
    }
    
    /**
     * Adds the capture middleware to the BotKit Controller.
     * 
     * As users respond to questions posed using convo.ask(), their answers will 
     * first be passed through any capture middleware endpoints. The capture middleware 
     * can modify the message in any way, including changing the value that will be used 
     * to test pre-defined patterns and that will ultimately be stored as the final user answer.
     * 
     * Occurs AFTER response via convo.ask().
     * 
     * @param middleware A callback function to do preprocessing.
     */
    public addCaptureMiddleware(middleware: any) {
        this._botkitController.middleware.capture.use(middleware);
    }
    
    /**
     * Adds the heard middleware to the BotKit Controller.
     * 
     * Heard middleware can be used to modify or enrich a message with additional information 
     * before it is handled by the callback function. This can be useful for developers who 
     * want to use NLP tools, but want to limit the type and number of messages sent to be 
     * classified. It is also useful for developers who want to mix internal application 
     * data (for example, user account information) into messages.
     * 
     * Occurs AFTER pattern matching.
     * 
     * @param middleware A callback function to do preprocessing.
     */
    public addHeardMiddleware(middleware: any) {
        this._botkitController.middleware.heard.use(middleware);
    }
    
    /**
     * Adds the receive middleware to the BotKit Controller.
     * 
     * A Receive middleware can be used to preprocess all incoming messages.
     * 
     * Occurs BEFORE pattern matching.
     * 
     * @param middleware A callback function to do preprocessing.
     */
    public addReceiveMiddleware(middleware: any) {
        this._botkitController.middleware.receive.use(middleware);
    }
    
    /**
     * Adds the send middleware to the BotKit Controller.
     * 
     * Send middleware can be used to preprocess the message content before being
     * sent out to the client.
     * 
     * Occurs BEFORE sending replies. 
     * 
     * @param middleware A callback function to do preprocessing.
     */
    public addSendMiddleware(middleware: any) {
        this._botkitController.middleware.send.use(middleware);
    }

    /**
     * Replaces the way the Bot handles pattern matching of messages.
     * 
     * Applies to all hears() implementations.
     * 
     * @param middleware A callback function to do preprocessing.
     */
    public changeEars(middleware: any) {
        this._botkitController.changeEars(middleware);
    }

    abstract createWebhookEndpoints(webserver: any): any;
}

export class BotFrameworkBot extends BotkitBot {

    public createWebhookEndpoints(webserver: any): BotFrameworkController {
        const controller: BotFrameworkController = this._botkitController;
        controller.createWebhookEndpoints(webserver, this._botkitBot, () => {
            // BotKit BotFramework is buggy because hardcodes 'http://' and the 
            // BotFrameworkConfiguration interface doesn't have 'port', which is why it's undefined.
            controller.log('** Bot is available as a Microsoft Bot Framework Bot at: ' + Config.APP_ENDPOINT + '/botframework/receive');
        });
        return this._botkitController;
    }
 }