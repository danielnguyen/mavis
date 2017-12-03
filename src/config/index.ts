import { BotFrameworkSpawnConfiguration } from 'BotKit';
import { DialogFlowConfiguration, BotkitDialogFlow } from '../middleware/botkit-dialogflow-v1';
import { MicrosoftLuisConfiguration } from '../middleware/botkit-luis';

export class Config {
    
    public static __DEVELOPMENT__: boolean = process.env.NODE_ENV !== 'production' ? true : false;
    
    public static SECURE: boolean = process.env.HTTP === 'on' ? false : true;

    public static APP_PROTOCOL: string = Config.SECURE ? 'https' : 'http';

    public static APP_HOST: string = process.env.HOST || 'localhost';

    public static APP_PORT: number = +process.env.PORT || (Config.__DEVELOPMENT__ ? 3000 : 443);

    public static APP_ENDPOINT: string = Config.APP_PROTOCOL + '://' + Config.APP_HOST + ':' + Config.APP_PORT;

    public static ALLOW_NLP_LEARNING: boolean = process.env.ALLOW_NLP_LEARNING === 'true' ? true : false;

    public static BOT_FRAMEWORK_CONFIG: BotFrameworkSpawnConfiguration = {
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    };

    public static DIALOGFLOW_CONFIG: DialogFlowConfiguration = {
        endpoint: process.env.DIALOGFLOW_ENDPOINT || 'https://api.dialogflow.com',
        accessToken: process.env.DIALOGFLOW_ACCESS_TOKEN,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    }

    public static LUIS_CONFIG: MicrosoftLuisConfiguration = {
        endpoint: process.env.LUIS_ENDPOINT || 'https://westus.api.cognitive.microsoft.com',
        appId: process.env.LUIS_APP_ID,
        apiKey: process.env.LUIS_API_KEY,
        verbose: process.env.LUIS_VERBOSE === 'true' ? true : false
    }
}