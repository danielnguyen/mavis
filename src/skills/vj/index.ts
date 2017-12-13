import { Controller, Message, Conversation} from 'botkit';
import { BotkitNLP, NLPMessage } from '../../middleware/botkit-nlp';
import { Skill } from '../index';
import { VideoRequestModel } from './index.d';
import { Config } from '../../config'
import { platform } from 'os';

/**
 * Final catch-all skill for unsupported skills.
 */
export class VJSkill implements Skill {

    /**
     * List of video platforms
     */
    private static VIDEO_PLATFORMS: string[] = ['youtube', 'netflix', 'anime', 'vimeo', 'hulu', 'cbc', 'dramafevor', 'twice', 'vevo'];

    /**
     * List of projection mediums
     */
    private static PROJECTION_MEDIUMS: string[] = ['tv', 'television', 'projector'];

    /**
     * List of common strings to remove to make the search more accurate.
     */
    private static COMMON_STRINGS: string[] = ['on', 'the']
    
    /**
     * Video Play
     * @param controller The Bot Controller
     */
    public hears(controller: Controller<any, any, any>) {
        controller.hears('video.play', 'message_received', BotkitNLP.hear, async (bot, message: NLPMessage) => {

            let reply: string = 'Not sure how to play this yet...'

            let nlpParameters: any;
            if (message.topIntent && message.topIntent.data && message.topIntent.data.parameters) {
                nlpParameters = message.topIntent.data.parameters;

                const videoInfo: VideoRequestModel = this.getVideoInformation(message.text, nlpParameters);
                
                if (!videoInfo.medium || !videoInfo.service || !videoInfo.title) {

                    // Start conversation to retrieve missing information
                    await bot.startConversation(message,(err: Error, convo: Conversation<any>) => {

                        if (!videoInfo.title) {
                            convo.addQuestion('What did you want to watch?', (response,convo) => {
                                convo.next();
                            },{key: 'videoTitle'},'default');
                        }

                        if (!videoInfo.service) {
                            convo.addQuestion('Which video service did you want to watch it on?', (response,convo) => {
                                convo.next();
                            },{key: 'videoService'},'default');
                        }

                        if (!videoInfo.medium) {
                            convo.addQuestion('Where do you want to play it on?', (response,convo) => {
                                convo.next();
                            },{key: 'videoMedium'},'default');
                        }
                        
                        convo.on('end', (convo) => {
                            if (convo.status=='completed') {
                                if (!videoInfo.title) videoInfo.title = convo.extractResponse('videoTitle');
                                if (!videoInfo.service) videoInfo.service = convo.extractResponse('videoService');
                                if (!videoInfo.medium) videoInfo.medium = this.stringRemove(convo.extractResponse('videoMedium'), VJSkill.COMMON_STRINGS);      
                                reply = this.searchAndPlay(videoInfo);
                            }
                        });
                        convo.activate();
                    });
                } else {
                    reply = this.searchAndPlay(videoInfo);
                }
                
            }
            
            bot.reply(message, reply, (err: Error) => {
                console.error(err);
            });

        });
            
    }

    /**********************
     * Helpers
     */

    /**
     * Fallback to try and guess the video service if NLP Service fails.
     * 
     * @param message the message to guess from.
     */
    private getVideoService(message: string) {
        const platformFound = VJSkill.VIDEO_PLATFORMS.map((platform) => {
            return message.toLowerCase().includes(platform.toLowerCase()) ? platform : '';
        });
        return platformFound.join('');
    }

    /**
     * Return the medium to cast to, or an empty string if none is found.
     * 
     * @param message the message to extract the medium from.
     */
    private getProjectionMedium(message: string) {
        const mediumFound = VJSkill.PROJECTION_MEDIUMS.map((medium) => {
            return message.toLowerCase().includes(medium.toLowerCase()) ? medium : '';
        });
        return mediumFound.join('');
    }

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
        if (nlpParameters.service && VJSkill.PROJECTION_MEDIUMS.includes(nlpParameters.service)) {
            videoInformation.service = nlpParameters.service;
        } else {
            const platformFound = this.getVideoService(rawMessage);
            videoInformation.service = platformFound;
        }

        // Find the Projection Medium
        videoInformation.medium = this.getProjectionMedium(rawMessage);
        
        // Find the video title
        if (nlpParameters.movie) {
            videoInformation.title = nlpParameters.movie.toLowerCase();
        } else if (nlpParameters.video) {
            videoInformation.title = nlpParameters.video.toLowerCase();
        }

        // Strip the platform and medium from the title to improve video search results
        const toTrim: string[] = VJSkill.COMMON_STRINGS.concat([videoInformation.service, videoInformation.medium]);
        videoInformation.title = this.stringRemove(videoInformation.title, toTrim);
        console.log('Video title: ' + videoInformation.title);
        return videoInformation;
    }

    private searchAndPlay(videoInfo: VideoRequestModel) {
        return 'Looking for "' + videoInfo.title + '" on ' + videoInfo.service + ' to play on ' + videoInfo.medium;
    }

    /**
     * Remove specified strings from a string.
     * 
     * @param srcStr the string to remove from.
     * @param trimStrings the strings to remove.
     */
    private stringRemove(srcStr: string, trimStrings: string[]): string {
        trimStrings.forEach((trim) => {
            srcStr = srcStr.replace(new RegExp(trim, 'g'), '');
        });
        return srcStr.trim();
    }
}