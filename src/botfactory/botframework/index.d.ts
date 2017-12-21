import { UniversalBot, ChatConnector } from "botbuilder";

export interface ChatBot {
    bot: UniversalBot,
    connector: ChatConnector
}

export interface BotFrameworkConfiguration {
    appId: string,
    appPassword: string
}