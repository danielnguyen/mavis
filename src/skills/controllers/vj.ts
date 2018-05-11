import * as _ from "lodash";
import { Bot, Controller, Message, Conversation} from "botkit";
import { BotkitNLP, NLPMessage } from "../../middleware/botkit-nlp";
import { VideoRequestModel } from "../models/vj";
import { Config } from "../../config"
import { platform } from "os";
import { BaseSkill } from "./_skill";
import { MessageUtils } from "../helpers/messageutils";
import { VJServices } from "../services/vjServices";

/**
 * Video Jockey skills.
 */
export class VJSkill extends BaseSkill {

    /**
     * List of video platforms
     */
    private static VIDEO_PLATFORMS: string[] = ["youtube", "netflix", "anime", "vimeo", "hulu", "cbc", "dramafevor", "twice", "vevo"];

    /**
     * List of projection mediums
     */
    private static PROJECTION_MEDIUMS: string[] = ["tv", "television", "projector"];

    /**
     * List of common strings to remove to make the search more accurate.
     */
    private static COMMON_STRINGS: string[] = ["on", "the"]

    private vjServices: VJServices = new VJServices();
    
    constructor(controller: Controller<any, any, any>) {
        super(controller);
    }

    protected init() {
        this.controller.hears("video.play", "message_received", BotkitNLP.hear, this.handleVideoPlay);
    }

    public async handleVideoPlay(bot: Bot<any, any>, message: NLPMessage) {

        let reply: string = "Not sure how to play this yet..."

        let nlpParameters: any;
        if (message.topIntent && message.topIntent.data && message.topIntent.data.parameters) {
            nlpParameters = message.topIntent.data.parameters;

            const videoInfo: VideoRequestModel = this.getVideoInformation(message.text, nlpParameters);
            
            if (!videoInfo.medium || !videoInfo.service || !videoInfo.title) {

                // Start conversation to retrieve missing information
                await bot.startConversation(message,(err: Error, convo: Conversation<any>) => {

                    if (!videoInfo.title) {
                        convo.addQuestion("What did you want to watch?", (response,convo) => {
                            convo.next();
                        },{key: "videoTitle"},"default");
                    }

                    if (!videoInfo.service) {
                        convo.addQuestion("Which video service did you want to watch it on?", (response,convo) => {
                            convo.next();
                        },{key: "videoService"},"default");
                    }

                    if (!videoInfo.medium) {
                        convo.addQuestion("Where do you want to play it on?", (response,convo) => {
                            convo.next();
                        },{key: "videoMedium"},"default");
                    }
                    
                    convo.on("end", (convo) => {
                        if (convo.status=="completed") {
                            if (!videoInfo.title) videoInfo.title = convo.extractResponse("videoTitle");
                            if (!videoInfo.service) videoInfo.service = convo.extractResponse("videoService");
                            if (!videoInfo.medium) videoInfo.medium = this.stringRemove(convo.extractResponse("videoMedium"), VJSkill.COMMON_STRINGS);      
                            reply = this.vjServices.searchAndPlay(videoInfo);
                        }
                    });
                    convo.activate();
                });
            } else {
                reply = this.vjServices.searchAndPlay(videoInfo);
            }
            
        }
        
        bot.reply(message, reply, (err: Error) => {
            console.error(err);
        });
    }

    /**********************
     * Helpers
     */

    /**
     * Retrieve video information from the spoken input.
     * 
     * @param rawMessage the initial spoken message
     * @param nlpParameters the parameters extracted by DialogFlow
     */
    private getVideoInformation(rawMessage: string, nlpParameters: any): VideoRequestModel {
        let videoInformation: VideoRequestModel = {
            title: undefined,
            service: undefined,
            medium: undefined
        };

        // Find the Video Platform
        if (nlpParameters.service && _.includes(VJSkill.PROJECTION_MEDIUMS, nlpParameters.service)) {
            videoInformation.service = nlpParameters.service;
        } else {
            const platformsFound = MessageUtils.findMentions(rawMessage, VJSkill.VIDEO_PLATFORMS);
            // Use the first found
            if (platformsFound.length > 0) {
                videoInformation.service = platformsFound[0];
            }
        }

        // Find the Projection Medium. Use the first found
        const projectionMediums = MessageUtils.findMentions(rawMessage, VJSkill.PROJECTION_MEDIUMS);
        if (projectionMediums.length > 0) {
            videoInformation.medium = projectionMediums[0];
        }
        
        // Find the video title
        if (nlpParameters.movie) {
            videoInformation.title = nlpParameters.movie.toLowerCase();
        } else if (nlpParameters.video) {
            videoInformation.title = nlpParameters.video.toLowerCase();
        }

        // Strip the platform and medium from the title to improve video search results
        const toTrim: string[] = _.concat(VJSkill.COMMON_STRINGS, [videoInformation.service], [videoInformation.medium]);
        videoInformation.title = this.stringRemove(videoInformation.title, toTrim);
        console.log("Video title: " + videoInformation.title);
        return videoInformation;
    }

    /**
     * Remove specified strings from a string.
     * 
     * @param srcStr the string to remove from.
     * @param trimStrings the strings to remove.
     */
    private stringRemove(srcStr: string, trimStrings: string[]): string {
        trimStrings.forEach((trim) => {
            srcStr = srcStr.replace(new RegExp(trim, "g"), "");
        });
        return srcStr.trim();
    }
}