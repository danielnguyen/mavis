import { Controller, Message} from "botkit";

/**
 * Base skill class.
 */
export abstract class BaseSkill {

    protected controller: Controller<any, any, any>;

    constructor(controller: Controller<any, any, any>) {
        this.controller = controller;
        this.init();
    }

    protected abstract init(): void;
}