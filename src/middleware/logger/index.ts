import * as Bunyan from 'bunyan';
import { LoggerOptions } from 'bunyan';
import { Config } from '../../config';
const bunyanPretty = require('bunyan-pretty');

export const loggerOptions: LoggerOptions = {
    name: "logger",
    level: Bunyan.INFO,
    stream: process.stdout.isTTY ? bunyanPretty() : process.stdout
};

const logger: Bunyan = Bunyan.createLogger(loggerOptions);
export default logger;