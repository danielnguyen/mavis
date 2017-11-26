import * as express from 'express';

// No type defs available
const AlexaVerifier = require('alexa-verifier-middleware');

export function alexa(app: express.Application) {

    // create a router and attach to express
    const router = express.Router();
    
    app.use('/alexa', router);

    // attach the verifier middleware first because it needs the entire
    // request body, and express doesn't expose this on the request object
    router.use(AlexaVerifier);

    // Routes that handle alexa traffic are now attached here.
    // Since this is attached to a router mounted at /alexa,
    // this endpoint will be accessible at /alexa/weather_info
    router.get('/weather_info', (req, res) => {

    })
}


 
