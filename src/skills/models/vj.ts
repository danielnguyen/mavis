export interface VideoRequestModel {
    
    /**
     * Title of the requested video.
     */
    title: string,

    /**
     * The requested video platform.
     */
    service: string
    
    /**
     * The target medium to display.
     */
    medium: string
}