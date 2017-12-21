import { ChatConnector, MemoryBotStorage, UniversalBot } from 'botbuilder';
import { AzureBotStorage, IBotStorage } from 'botbuilder-azure';
import { MongoClient } from 'mongodb';
import { BotFrameworkConfiguration, MongoStorageClient } from './index';
import logger from '../../middleware/logger';
import { Config } from '../../config';

export interface BotFrameworkObject {
    bot: UniversalBot,
    connector: ChatConnector
}

export class BotFrameworkFactory {

    private _bot: UniversalBot;
    private _config: BotFrameworkConfiguration;
    private _connector: ChatConnector;
    private _botStorage: IBotStorage;

    constructor(config: BotFrameworkConfiguration) {
        if (!config || !config.appId || !config.appPassword) {
            logger.error('Error: Specify Microsoft App Credentials in environment.');
        } else {
            this._config = config;
            // Create the BotBuilder Connector
            this._connector = new ChatConnector(this._config);
            // Create the Bot Storage
            if (Config.__DEVELOPMENT__) {
                logger.info('BotFrameworkStorage: In development mode. Initializing Memory Storage.');
                this._botStorage = new MemoryBotStorage();
            } else {
                logger.info('BotFrameworkStorage: In production mode. Initializing MongoDB Storage.');
                const mongoStorage = new MongoStorageClient(Config.MONGO_CONFIG);
                this._botStorage = new AzureBotStorage({ gzipData: false }, mongoStorage);
            }
        }
    }
    
    public createBot(): BotFrameworkObject {
        this._bot = new UniversalBot(this._connector).set('storage', new MemoryBotStorage()); // Register in memory storage;
        return {
            bot: this._bot,
            connector: this._connector
        }
    }
    
    public getConnector(): ChatConnector {
        return this._connector;
    }
}