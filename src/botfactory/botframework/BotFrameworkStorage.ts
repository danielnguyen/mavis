import { IStorageClient } from 'botbuilder-azure';
import { MongoClient, Db } from 'mongodb';
import { Config } from '../../config';
import logger from '../../middleware/logger';

export interface MongoConfiguration {
    api: string,
    user: string,
    password: string
}

export class MongoStorageClient implements IStorageClient {

    private endpoint: string;
    private mongoClient: MongoClient;

    constructor(config: MongoConfiguration) {
        if (!config || !config.api || !config.user || !config.password) {
            logger.error('Error: Mongo Credentials not specified. Cannot instantiate Bot Storage.');
        } else {
            this.endpoint = 'mongodb://' + Config.MONGO_CONFIG.user + ':' + Config.MONGO_CONFIG.password + '@' + Config.MONGO_CONFIG.api;
        }
            
    }

    public initialize(callback: any) {
        this.mongoClient = new MongoClient();
        this.mongoClient.connect(this.endpoint, (err: Error, database: Db) => {
            if (err) {
                logger.error(err);
                callback(err);
            } else {
                logger.info('BotFrameworkStorage: Connected to database (' + database.databaseName + ') successfully!');
                callback(null);
            }
        })
    }
    
    public insertOrReplace(partitionKey: any, rowKey: any, data: any, isCompressed: any, callback: any) {
        throw new Error("Method not implemented.");
    }
    
    public retrieve(partitionKey: any, rowKey: any, callback: any) {
        throw new Error("Method not implemented.");
    }
    
}