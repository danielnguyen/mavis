import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as morgan from 'morgan';
import { Config } from './config';

export interface WebServerOptions {
    hostname?: string;
    port?: number;
    secure?: boolean;
    [prop: string]: any;
}

export class WebServer {

    public config: WebServerOptions;
    protected server: express.Application;

    private static readonly defaultConfig: WebServerOptions = {
        hostname: Config.APP_HOST,
        port: Config.APP_PORT,
        secure: Config.SECURE || true
    }

    constructor(public options?: WebServerOptions) {

        // If options not specified, set defaults
        this.config = options || WebServer.defaultConfig;

        this.server = express();
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({
            extended: true
        }));

        this.server.set('port', this.config.port);  
        this.server.set('host', this.config.hostname);

        this.server.use(morgan('dev'));  // log every request to the console 

    }

    public addRoute(route: string) {
        // Add any additionally specified routes
        require(route)(this.server);
    }

    public start(cb: any): any {

        if (this.config.secure) {
            // Start WebServer in https
            const options = {
                cert: fs.readFileSync(require('path').join(__dirname, './certs/server.crt')),
                key: fs.readFileSync(require('path').join(__dirname, './certs/key.pem'))
            };
            https.createServer(options, this.server).listen(this.server.get('port'), this.server.get('host'), () => {
                if (cb) cb(this.server);
            });
        } else {
            // Start WebServer in http
            this.server.listen(
                this.server.get('port'),
                this.server.get('host'),
                () => {
                    if (cb) cb(this.server);
                }
            )
        }

    }

}