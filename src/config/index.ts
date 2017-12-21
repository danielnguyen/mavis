import { BotFrameworkConfiguration, MongoConfiguration } from '../botfactory/botframework';
import { DialogFlowConfiguration } from '../middleware/dialogflow';

export class Config {
    
    public static __DEVELOPMENT__: boolean = process.env.NODE_ENV !== 'production' ? true : false;
    
    public static SECURE: boolean = process.env.HTTPS === 'on' ? true : false;

    public static APP_PROTOCOL: string = Config.SECURE ? 'https' : 'http';

    public static APP_HOST: string = process.env.HOST || 'localhost';

    public static APP_PORT: number = +process.env.PORT || (Config.__DEVELOPMENT__ ? 3000 : 443);

    public static APP_ENDPOINT: string = Config.APP_PROTOCOL + '://' + Config.APP_HOST + ':' + Config.APP_PORT;

    public static BOT_FRAMEWORK_CONFIG: BotFrameworkConfiguration = {
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    };

    public static MONGO_CONFIG: MongoConfiguration = {
        api: process.env.MONGO_ENDPOINT,
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD
    };

    public static DIALOGFLOW_CONFIG: DialogFlowConfiguration = {
        endpoint: process.env.DIALOGFLOW_ENDPOINT || 'https://api.dialogflow.com',
        accessToken: process.env.DIALOGFLOW_ACCESS_TOKEN,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    };
    
    public static ENABLE_DIALOGFLOW: boolean = process.env.ENABLE_DIALOGFLOW === 'true' ? true : false;
}