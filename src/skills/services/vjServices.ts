import { VideoRequestModel } from "../models/vj";
export class VJServices {

    /**
     * Tries to look for the requested video and play it.
     * 
     * @param videoInfo Metadata for the requested video.
     */
    public searchAndPlay(videoInfo: VideoRequestModel) {
        // TODO
        return "Looking for \"" + videoInfo.title + "\" on " + videoInfo.service + " to play on " + videoInfo.medium;
    }
}