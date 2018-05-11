import * as _ from "lodash";

/**
 * Utilities to help with Bot messages
 */
export class MessageUtils {

    /**
     * Returns a list of specified words found in a string/message.
     * 
     * @param message Message to look into
     * @param toFind List of words to find
     */
    public static findMentions(message: string, toFind: string[]): string[] {
        return _.intersection(_.words(message.toLowerCase()), toFind);
    }
}