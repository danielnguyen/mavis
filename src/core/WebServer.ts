const express = require("express");
import bodyParser = require("body-parser");
import fs = require("fs");
import http = require("http");
import https = require("https");
import { Config } from "../config";

export interface WebServerOptions {
    hostname?: string;
    port?: number;
    secure?: boolean;
    [prop: string]: any;
}

export class WebServer {

    public config: WebServerOptions; 
    public routes: string[] = [];

    private static readonly defaultConfig: WebServerOptions = {
        hostname: Config.APP_HOST,
        port: Config.APP_PORT,
        secure: Config.SECURE
    }

    constructor(public options?: WebServerOptions) {

        // If options not specified, set defaults
        this.config = options || WebServer.defaultConfig;

    }

    public addRoute(route: string) {
        this.routes.push(route);
    }

    public start(cb: any): any {

        let webserver = express();
        webserver.use(bodyParser.json());
        webserver.use(bodyParser.urlencoded({
            extended: true
        }));

        webserver.set("port", this.config.port);  
        webserver.set("host", this.config.hostname);

        // Add any additionally specified routes
        this.routes.forEach((route) => {
            require(route)(webserver);
        })

        if (this.config.secure) {
            // Start WebServer in https
            const options = {
                cert: fs.readFileSync(require("path").join(__dirname, "../certs/server.crt")),
                key: fs.readFileSync(require("path").join(__dirname, "../certs/key.pem"))
            };
            https.createServer(options, webserver).listen(webserver.get("port"), webserver.get("host"), () => {
                if (cb) cb(webserver);
            });
        } else {
            // Start WebServer in http
            webserver.listen(
                webserver.get("port"),
                webserver.get("host"),
                () => {
                    if (cb) cb(webserver);
                }
            )
        }

    }

}