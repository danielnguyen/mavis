import { Intent, Entity, Context } from './nlp.model';

export class NLP {

    public getIntent(message: string): Intent {
        return undefined;
    }

    public getEntity(message: string): Entity {
        return undefined;
    }
    
    public getContext(message: string): Context {
        return undefined;
    }
}